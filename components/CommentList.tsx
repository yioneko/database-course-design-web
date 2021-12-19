import { Comment, List } from "antd";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useQuery } from "react-query";
import {
  CommentListSuccessResponse,
  PaginationBaseRequest,
} from "../common/interface";
import usePaginationParams from "../hooks/usePaginationParams";

export const initialPaginationParams: PaginationBaseRequest = {
  offset: 0,
  pageLimit: 10,
};

export async function getComments(
  isbn: string,
  paginationParams: PaginationBaseRequest
) {
  const response = await axios.get<CommentListSuccessResponse>(
    `/api/books/${isbn}/comments`,
    {
      params: paginationParams,
    }
  );
  return response.data;
}

function CommentList({ isbn }: { isbn: string }) {
  const { paginationParams, paginationConfig } = usePaginationParams(
    initialPaginationParams
  );

  const { data, isFetching } = useQuery(
    ["comments", isbn, paginationParams],
    () => getComments(isbn, paginationParams)
  );

  return (
    <List
      bordered
      itemLayout="vertical"
      loading={isFetching}
      dataSource={data?.comments}
      pagination={paginationConfig(data?.pageCount)}
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
