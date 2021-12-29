import {
  Button,
  Form,
  Input,
  message as antdMessage,
  Modal,
  Popover,
  Select,
  SelectProps,
  Space,
  Table,
} from "antd";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  BookBorrowRequest,
  BookCopiesSuccessResponse,
  BookCopiesUrlParams,
  BookInfo,
  BookListSuccessResponse,
  BookReturnRequest,
} from "../../common/interface";
import message from "../../common/message.json";
import BookAdd from "../../components/BookAdd";
import { AdminLayout } from "../../components/Layout";
import usePaginationParams from "../../hooks/usePaginationParams";

function useBorrowReturn(onScucess: () => void) {
  const queryClient = useQueryClient();
  const mergedOnSuccess = () => {
    queryClient.invalidateQueries("books");
    antdMessage.success(message.success);
    onScucess();
  };

  const borrowMutation = useMutation(
    async (body: BookBorrowRequest) => {
      const res = await axios.post("/api/borrow", body);
      return res.data;
    },
    { onSuccess: mergedOnSuccess }
  );

  const returnMutation = useMutation(
    async (body: BookReturnRequest) => {
      const res = await axios.post("/api/return", body);
      return res.data;
    },
    { onSuccess: mergedOnSuccess }
  );

  return {
    borrowMutation,
    returnMutation,
  };
}

function CopySelect({
  isbn,
  params,
  ...props
}: { isbn: string; params: BookCopiesUrlParams } & SelectProps<string>) {
  const { data: copies, isFetching } = useQuery(
    ["bookCopies", isbn],
    async () => {
      const res = await axios.get<BookCopiesSuccessResponse>(
        `/api/books/${isbn}/copies`,
        { params }
      );
      return res.data.copies;
    }
  );

  return (
    <Select loading={isFetching} {...props} className="!w-40">
      {(copies || []).map((copy) => (
        <Select.Option key={copy} value={copy}>
          {copy}
        </Select.Option>
      ))}
    </Select>
  );
}

function BorrowAction({ record }: { record: BookInfo }) {
  const [form] = Form.useForm();
  const { borrowMutation } = useBorrowReturn(() => form.resetFields());

  return (
    <BookActionWithPopover
      actionLabel={message.borrowAction}
      disabled={record.available === 0}
      content={
        <Form<BookBorrowRequest>
          form={form}
          layout="inline"
          onFinish={borrowMutation.mutate}
        >
          <Form.Item name="copyId" label="Copy ID" rules={[{ required: true }]}>
            <CopySelect isbn={record.isbn} params={{ borrowedOnly: true }} />
          </Form.Item>
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {message.confirm}
            </Button>
          </Form.Item>
        </Form>
      }
    />
  );
}

function ReturnAction({ record }: { record: BookInfo }) {
  const [form] = Form.useForm();
  const { returnMutation } = useBorrowReturn(form.resetFields);

  return (
    <BookActionWithPopover
      actionLabel={message.returnAction}
      content={
        <Form<BookReturnRequest>
          form={form}
          layout="inline"
          onFinish={returnMutation.mutate}
        >
          <Form.Item name="copyId" label="Copy ID" rules={[{ required: true }]}>
            <CopySelect isbn={record.isbn} params={{ borrowedOnly: true }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {message.confirm}
            </Button>
          </Form.Item>
        </Form>
      }
    />
  );
}

function BookActionWithPopover({
  actionLabel,
  content,
  disabled = false,
}: {
  actionLabel: string;
  content: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Popover
      trigger={disabled ? [] : "click"}
      placement="bottomRight"
      destroyTooltipOnHide
      title={actionLabel}
      content={content}
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

  return (
    <AdminLayout>
      <Head>
        <title>Books administration</title>
        <meta name="description" content="Administration page of books" />
      </Head>
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
        pagination={paginationConfig(data?.total)}
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
          render={(_, record) => (
            <Space direction="horizontal">
              <BorrowAction record={record} />
              <ReturnAction record={record} />
            </Space>
          )}
        />
      </Table>
    </AdminLayout>
  );
};

export default BooksAdmin;
