import { Button, Form, Input, message, Modal, Table } from "antd";
import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  BookBorrowRequest,
  BookInfo,
  BookListSuccessResponse,
  BookReturnRequest,
} from "../../common/interface";
import BookAdd from "../../components/BookAdd";
import { AdminLayout } from "../../components/Layout";
import usePaginationParams from "../../hooks/usePaginationParams";

function useBorrowReturn() {
  const [inActionBook, setInActionBook] = useState<
    { isbn: string; action: "borrow" | "return" } | undefined
  >(undefined);
  const queryClient = useQueryClient();

  const borrowMutation = useMutation(
    async (body: BookBorrowRequest) => {
      const res = await axios.post("/api/borrow", body);
      return res.data;
    },
    {
      onSuccess: () => {
        setInActionBook(undefined);
        queryClient.invalidateQueries("books");
        message.success("Success");
      },
    }
  );

  const returnMutation = useMutation(
    async (body: BookReturnRequest) => {
      const res = await axios.post("/api/return", body);
      return res.data;
    },
    {
      onSuccess: () => {
        setInActionBook(undefined);
        queryClient.invalidateQueries("books");
        message.success("Success");
      },
    }
  );

  return {
    inActionBook,
    setInActionBook,
    borrowMutation,
    returnMutation,
  };
}

const BooksAdmin: NextPage = () => {
  const { paginationParams, paginationConfig } = usePaginationParams();

  const { data, isFetching } = useQuery(
    ["books", paginationParams],
    async () => {
      const response = await axios.get<BookListSuccessResponse>("/api/books", {
        params: paginationParams,
      });
      return response.data;
    }
  );

  const [openAdd, setOpenAdd] = useState(false);

  const { inActionBook, setInActionBook, borrowMutation, returnMutation } =
    useBorrowReturn();

  return (
    <AdminLayout>
      <Modal
        title="Add Book"
        visible={openAdd}
        footer={null}
        onCancel={() => setOpenAdd(false)}
      >
        <BookAdd />
      </Modal>
      <Table
        dataSource={data?.books}
        rowKey="isbn"
        pagination={paginationConfig(data?.pageCount)}
        loading={isFetching}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={5} className="text-right">
              <Button onClick={() => setOpenAdd(true)}>Add</Button>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      >
        <Table.Column title="Title" dataIndex="title" key="title" />
        <Table.Column title="Author" dataIndex="author" key="author" />
        <Table.Column title="ISBN" dataIndex="isbn" key="isbn" />
        <Table.Column title="Available" dataIndex="available" key="available" />
        {/*TODO: nested line for actions*/}
        <Table.Column<BookInfo>
          title="Action"
          key="action"
          render={(_, record) => {
            if (inActionBook?.isbn === record.isbn) {
              return (
                <div>
                  {inActionBook.action === "borrow" ? (
                    <Form
                      layout="inline"
                      onFinish={(values) => {
                        borrowMutation.mutate({
                          isbn: record.isbn,
                          userId: values.userId,
                        });
                      }}
                    >
                      <Form.Item name="userId" label="ID">
                        <Input />
                      </Form.Item>
                      <Form.Item>
                        <Button htmlType="submit" type="link">
                          Confirm
                        </Button>
                      </Form.Item>
                    </Form>
                  ) : (
                    <Form
                      layout="inline"
                      onFinish={(values) => {
                        returnMutation.mutate({
                          isbn: record.isbn,
                          userId: values.userId,
                        });
                      }}
                    >
                      <Form.Item name="userId" label="ID">
                        <Input />
                      </Form.Item>
                      <Form.Item>
                        <Button htmlType="submit" type="link">
                          Confirm
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                  <Button
                    type="link"
                    onClick={() => {
                      setInActionBook(undefined);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              );
            } else {
              return (
                <div>
                  <Button
                    type="link"
                    onClick={() => {
                      setInActionBook({ isbn: record.isbn, action: "borrow" });
                    }}
                  >
                    Borrow
                  </Button>
                  <Button
                    type="link"
                    onClick={() => {
                      setInActionBook({ isbn: record.isbn, action: "return" });
                    }}
                  >
                    Return
                  </Button>
                </div>
              );
            }
          }}
        />
      </Table>
    </AdminLayout>
  );
};

export default BooksAdmin;
