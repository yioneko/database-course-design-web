import {
  BankOutlined,
  CommentOutlined,
  CopyrightOutlined,
  DownCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Input, List } from "antd";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { BookListSuccessResponse } from "../common/interface";

function FieldDescription({
  field,
  description,
  icon,
}: {
  field: string;
  description: string;
  icon: typeof BankOutlined;
}) {
  return (
    <div className="flex items-center gap-1">
      {React.createElement(icon, {
        style: { position: "relative", top: "1px" },
      })}
      {`${field}: ${description}`}
    </div>
  );
}

const loadMoreLimit = 3;

function BookList() {
  const [filter, setFilter] = useState("");

  const { data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(
      ["books", { filter, pageLimit: loadMoreLimit }],
      async ({ pageParam = 0 }) => {
        const response = await axios.get<BookListSuccessResponse>(
          "/api/books",
          {
            params: {
              offset: pageParam * loadMoreLimit,
              pageLimit: loadMoreLimit,
              filter: filter,
            },
          }
        );
        return response.data;
      },
      {
        keepPreviousData: true,
        getNextPageParam: (lastPage, allPages) =>
          allPages.length < lastPage.total ? allPages.length : undefined,
      }
    );

  const onSearch = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto bg-white">
      <Input.Search
        className="mb-4"
        placeholder="Search books..."
        loading={isFetching}
        onSearch={onSearch}
        enterButton
      />
      <List
        itemLayout="horizontal"
        // NOTE: potential performance issue
        dataSource={data?.pages.flatMap((page) => page.books)}
        loadMore={
          <div className="flex justify-center">
            <Button
              type="primary"
              disabled={!hasNextPage || isFetchingNextPage}
              onClick={() => {
                fetchNextPage();
              }}
            >
              More
              <DownCircleOutlined />
            </Button>
          </div>
        }
        bordered
        renderItem={(item) => (
          <List.Item key={item.isbn} className="p-4">
            <List.Item.Meta
              title={item.title}
              description={
                <>
                  <FieldDescription
                    field="Authors"
                    description={item.author}
                    icon={EditOutlined}
                  />
                  <FieldDescription
                    field="Available"
                    description={item.available + ""}
                    icon={BankOutlined}
                  />
                  <FieldDescription
                    field="ISBN"
                    description={item.isbn}
                    icon={CopyrightOutlined}
                  />
                </>
              }
            />
            <Link href={`/comment/${item.isbn}`}>
              <a>
                <Button icon={<CommentOutlined />}>Comment</Button>
              </a>
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
}

export default BookList;
