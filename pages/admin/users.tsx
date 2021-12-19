import { Button, Form, Input, message, Popover, Table } from "antd";
import axios from "axios";
import { NextPage } from "next";
import { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import {
  NotificationSendRequest,
  UserInfo,
  UserListSuccessResponse,
} from "../../common/interface";
import { AdminLayout } from "../../components/Layout";
import usePaginationParams from "../../hooks/usePaginationParams";
import UserCtx from "../../providers/user";

const UsersAdmin: NextPage = () => {
  const { paginationParams, paginationConfig } = usePaginationParams();

  const { data, isFetching } = useQuery(
    ["users", paginationParams],
    async () => {
      const response = await axios.get<UserListSuccessResponse>("/api/user", {
        params: paginationParams,
      });
      return response.data;
    }
  );

  const [notifyForm] = Form.useForm();
  const notificationMutation = useMutation(
    (req: NotificationSendRequest) => {
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

  if (userId === undefined) {
    return <div>Access denied</div>;
  }

  return (
    <AdminLayout>
      <Table
        dataSource={data?.users}
        pagination={paginationConfig(data?.pageCount)}
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
        <Table.Column<UserInfo>
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
                      message: values.message,
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
