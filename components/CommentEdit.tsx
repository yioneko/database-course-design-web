import { Button, Form, Input, message as antdMessage } from "antd";
import axios from "axios";
import format from "date-fns/format";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  BookInfoSuccessResponse,
  CommentAddRequest,
} from "../common/interface";
import message from "../common/message.json";
import UserCtx from "../providers/user";

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
    (data: CommentAddRequest) =>
      axios.post(`/api/books/${isbn}/comments`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", isbn]);
        antdMessage.success(message.commentAdded);
      },
    }
  );

  const allowComment = !!data?.borrowed;

  return (
    <Form<{ comment: string }>
      onFinish={({ comment }) => {
        mutation.mutate({
          comment,
          date: format(new Date(), "yyyy-MM-dd"),
        });
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
