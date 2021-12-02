import { Button, Form, Popover, Table, Input, message } from "antd";
import axios from "axios";
import { NextPage } from "next";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { SendNotificationRequest, UserResponse } from "../../api/types";
import { AdminLayout } from "../../components/Layout";
import { useMetaData } from "../../hooks/queries";
import UserCtx from "../../providers/user";

const UsersAdmin: NextPage = () => {
  const { data: metaData } = useMetaData();
  const [page, setPage] = useState(0);

  const { data, isFetching } = useQuery(["users", page], async () => {
    const response = await axios.get<UserResponse[]>("/api/user", {
      params: {
        page,
      },
    });
    return response.data;
  });

  const [notifyForm] = Form.useForm();
  const notificationMutation = useMutation(
    (req: SendNotificationRequest) => {
      return axios.post("/api/notifications", req);
    },
    {
      onSuccess: () => {
        message.success("Notification sent");
        notifyForm.resetFields();
      },
    }
  );
  const { userId } = useContext(UserCtx);

  if (typeof userId === "undefined") {
    return <div>Access denied</div>;
  }

  return (
    <AdminLayout>
      <Table
        dataSource={data}
        pagination={{
          total: metaData?.users.total,
          pageSize: data?.length,
        }}
        onChange={(pagination) => {
          setPage((pagination.current ?? 1) - 1);
        }}
        loading={isFetching}
      >
        <Table.Column title="User ID" dataIndex="userId" key="userId" />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column
          title="Admin"
          dataIndex="isAdmin"
          key="isAdmin"
          render={(isAdmin: boolean) => {
            return isAdmin ? "Yes" : "No";
          }}
        />
        <Table.Column<UserResponse>
          title="Action"
          key="action"
          render={(_, record) => (
            <Popover
              trigger="click"
              placement="bottom"
              content={
                <Form
                  form={notifyForm}
                  onFinish={(values) => {
                    notificationMutation.mutate({
                      receiverId: record.userId,
                      senderId: userId,
                      content: values.content,
                    });
                  }}
                >
                  <Form.Item name="message" className="mb-0">
                    <Input.TextArea placeholder="Message" />
                  </Form.Item>
                  <Form.Item className="mb-0">
                    <Button type="link" htmlType="submit">
                      Send
                    </Button>
                  </Form.Item>
                </Form>
              }
            >
              <Button type="link">Notify</Button>
            </Popover>
          )}
        />
      </Table>
    </AdminLayout>
  );
};

export default UsersAdmin;
