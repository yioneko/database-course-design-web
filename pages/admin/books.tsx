import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  message,
  Modal,
  Table,
} from "antd";
import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  BookInfo,
  BooksResponse,
  BorrowRequest,
  ReturnRequest,
} from "../../api/types";
import BookAdd from "../../components/BookAdd";
import { AdminLayout } from "../../components/Layout";
import { useMetaData } from "../../hooks/queries";

function useBorrowReturn() {
  const [inActionBook, setInActionBook] = useState<
    { isbn: string; action: "borrow" | "return" } | undefined
  >(undefined);
  const queryClient = useQueryClient();

  const borrowMutation = useMutation(
    async (body: BorrowRequest) => {
      const res = await axios.post("/api/borrow", body);
      return res.data;
    },
    {
      onSuccess: () => {
        setInActionBook(undefined);
        queryClient.invalidateQueries("books");
        message.success("Success");
      },
      // TODO: better error handling
      onError: (err: AxiosError) => {
        message.error(err.response?.data.error);
      },
    }
  );

  const returnMutation = useMutation(
    async (body: ReturnRequest) => {
      const res = await axios.post("/api/return", body);
      return res.data;
    },
    {
      onSuccess: () => {
        setInActionBook(undefined);
        queryClient.invalidateQueries("books");
        message.success("Success");
      },
      onError: (err: AxiosError) => {
        message.error(err.response?.data.error);
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
  const { data: metaData } = useMetaData();

  const [page, setPage] = useState(0);
  const { data, isFetching } = useQuery(["books", page], async () => {
    const response = await axios.get<BooksResponse>("/api/books", {
      params: {
        page,
      },
    });
    return response.data;
  });

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
        pagination={{
          total: metaData?.books.total,
          pageSize: data?.books.length,
        }}
        onChange={(pagination) => {
          setPage((pagination.current ?? 1) - 1);
        }}
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
                          dueDate: values.dueDate.format("YYYY-MM-DD"),
                        });
                      }}
                    >
                      <Form.Item name="userId" label="ID">
                        <InputNumber controls={false} />
                      </Form.Item>
                      <Form.Item name="dueDate" label="Due">
                        <DatePicker />
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
                        <InputNumber controls={false} />
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
