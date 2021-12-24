import {
  Button,
  Form,
  Input,
  message as antdMessage,
  Modal,
  Popover,
  Space,
  Table,
} from "antd";
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
import message from "../../common/message.json";

function useBorrowReturn() {
  const queryClient = useQueryClient();
  const onSuccess = () => {
    queryClient.invalidateQueries("books");
    antdMessage.success(message.success);
  };

  const borrowMutation = useMutation(
    async (body: BookBorrowRequest) => {
      const res = await axios.post("/api/borrow", body);
      return res.data;
    },
    { onSuccess }
  );

  const returnMutation = useMutation(
    async (body: BookReturnRequest) => {
      const res = await axios.post("/api/return", body);
      return res.data;
    },
    { onSuccess }
  );

  return {
    borrowMutation,
    returnMutation,
  };
}

interface BookActionProps {
  actionLabel: string;
  actionCb: (userId: string) => Promise<void>;
  disabled?: boolean;
}

function BookAction({
  actionLabel,
  actionCb,
  disabled = false,
}: BookActionProps) {
  const [form] = Form.useForm();

  return (
    <Popover
      trigger={disabled ? [] : "click"}
      placement="bottomRight"
      destroyTooltipOnHide
      title={actionLabel}
      content={
        <Form
          form={form}
          className="flex"
          onFinish={(values) => {
            actionCb(values.userId).then(() => {
              form.resetFields();
            });
          }}
        >
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="link" htmlType="submit">
              {message.confirm}
            </Button>
          </Form.Item>
        </Form>
      }
    >
      <Button type="link" className="table-action-button" disabled={disabled}>
        {actionLabel}
      </Button>
    </Popover>
  );
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

  const { borrowMutation, returnMutation } = useBorrowReturn();

  return (
    <AdminLayout>
      <Modal
        title={message.addBook}
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
              <Button onClick={() => setOpenAdd(true)}>{message.add}</Button>
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
          render={(_, { isbn, available }) => (
            <Space direction="horizontal">
              <BookAction
                actionLabel={message.borrowAction}
                actionCb={(userId) =>
                  borrowMutation.mutateAsync({ isbn: isbn, userId })
                }
                disabled={available === 0}
              />
              <BookAction
                actionLabel={message.returnAction}
                actionCb={(userId) =>
                  returnMutation.mutateAsync({ isbn: isbn, userId })
                }
              />
            </Space>
          )}
        />
      </Table>
    </AdminLayout>
  );
};

export default BooksAdmin;
