import { Button, Form, Input, message as antdMessage } from "antd";
import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BookInfoSuccessResponse } from "../common/interface";
import UserCtx from "../providers/user";
import message from "../common/message.json";

export async function getBookInfo(isbn: string, userId?: string) {
  const response = await axios.get<BookInfoSuccessResponse>(
    `/api/books/${isbn}/info`,
    {
      params: {
        userId,
      },
    }
  );
  return response.data;
}

function CommentEdit({ isbn }: { isbn: string }) {
  const { userId } = useContext(UserCtx);
  const { data } = useQuery(["bookInfo", isbn, userId], () =>
    getBookInfo(isbn, userId)
  );

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (comment: string) =>
      axios.post(`/api/books/${isbn}/comments`, { userId, comment }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", isbn]);
        antdMessage.success(message.commentAdded);
      },
    }
  );

  const allowComment = !!data?.borrowed;

  return (
    <Form
      onFinish={({ comment }) => {
        mutation.mutate(comment);
      }}
    >
      <Form.Item>
        <Input.TextArea
          name="comment"
          placeholder={
            allowComment ? message.writeComment : message.disallowComment
          }
          disabled={!allowComment}
          rows={6}
          className="resize-none"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!allowComment}
          loading={mutation.isLoading}
        >
          Add comment
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CommentEdit;
