import { SendOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message as antdMessage,
  Popover,
  Table,
} from "antd";
import axios from "axios";
import { NextPage } from "next";
import { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import {
  NotificationSendRequest,
  UserInfo,
  UserListSuccessResponse,
} from "../../common/interface";
import message from "../../common/message.json";
import { AdminLayout } from "../../components/Layout";
import usePaginationParams from "../../hooks/usePaginationParams";
import UserCtx from "../../providers/user";

function NotifyAction({ userId }: { userId: string }) {
  const [form] = Form.useForm();
  const notificationMutation = useMutation(
    (req: NotificationSendRequest) => {
      return axios.post("/api/notifications", req);
    },
    {
      onSuccess: () => {
        antdMessage.success(message.notified);
        form.resetFields();
      },
    }
  );

  return (
    <Popover
      trigger="click"
      placement="bottom"
      destroyTooltipOnHide
      content={
        <Form
          form={form}
          onFinish={(values) => {
            notificationMutation.mutate({
              receiverId: userId,
              message: values.message,
            });
          }}
        >
          <Form.Item
            name="message"
            className="mb-0"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              className="resize-none"
              placeholder="Message"
              rows={6}
              cols={40}
              allowClear
            />
          </Form.Item>
          <Form.Item className="mb-0 text-center">
            <Button type="link" htmlType="submit" icon={<SendOutlined />}>
              {message.sendAction}
            </Button>
          </Form.Item>
        </Form>
      }
    >
      <Button type="link" className="table-action-button">
        {message.notifyAction}
      </Button>
    </Popover>
  );
}

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
        rowKey="userId"
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
          render={(_, { userId }) => <NotifyAction userId={userId} />}
        />
      </Table>
    </AdminLayout>
  );
};

export default UsersAdmin;
