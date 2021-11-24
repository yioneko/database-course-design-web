import { Comment, List } from "antd";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useQuery } from "react-query";
import { CommentResponse } from "../api/types";

export async function getComments(isbn: string) {
  const response = await axios.get<CommentResponse>(
    `/api/books/${isbn}/comments`
  );
  return response.data;
}

function CommentList({ isbn }: { isbn: string }) {
  const { data, isFetching } = useQuery(["comments", isbn], () =>
    getComments(isbn)
  );

  return (
    <List
      bordered
      itemLayout="vertical"
      loading={isFetching}
      dataSource={data?.comments}
      renderItem={(item) => {
        return (
          <List.Item>
            <Comment
              author={item.username}
              content={item.comment}
              datetime={formatDistanceToNow(Date.parse(item.date), {
                addSuffix: true,
              })}
            />
          </List.Item>
        );
      }}
    />
  );
}

export default CommentList;
