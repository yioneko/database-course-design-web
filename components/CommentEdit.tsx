import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BookInfoResponse } from "../api/types";
import UserCtx from "../providers/user";

export async function getBookInfo(isbn: string, userId?: number) {
  const response = await axios.get<BookInfoResponse>(
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
        queryClient.invalidateQueries(["bookInfo", isbn, userId]);
        message.success("Comment added");
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
            allowComment
              ? "Write down your feeling about this book!"
              : "Only user borrowing this book is allowed to comment"
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
