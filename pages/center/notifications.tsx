import { CheckSquareOutlined } from "@ant-design/icons";
import { Button, List, message, Typography } from "antd";
import axios from "axios";
import { NextPage } from "next";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { NotificationDetails } from "../../api/types";
import { CenterLayout } from "../../components/Layout";
import UserCtx from "../../providers/user";

const Notifications: NextPage = () => {
  const { userId, isAdmin } = useContext(UserCtx);
  const { data, isFetching } = useQuery(["notifications", userId], async () => {
    const res = await axios.get<NotificationDetails[]>(
      `/api/notifications?userId=${userId}`
    );
    return res.data;
  });

  const queryClient = useQueryClient();
  const readMutation = useMutation(
    async (id: number) => {
      return await axios.post(`/api/notifications/${id}`, { isRead: true });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
      },
    }
  );

  // TODO: Refactor this to avoid duplicate judgment
  if (userId === undefined) {
    message.error("You must login first");
    return <></>;
  }

  if (isAdmin) {
    return (
      <CenterLayout>
        <Typography.Title level={3}>👷 Not supported yet</Typography.Title>
      </CenterLayout>
    );
  }

  return (
    <CenterLayout>
      <List
        itemLayout="vertical"
        dataSource={data}
        size="small"
        loading={isFetching}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={`transition-colors ${item.isRead ? "" : "bg-green-200"}`}
            extra={
              item.isRead ? undefined : (
                <Button
                  type="primary"
                  icon={<CheckSquareOutlined />}
                  onClick={() => readMutation.mutate(item.id)}
                >
                  Read
                </Button>
              )
            }
          >
            <Typography.Text className="text-primary">
              {item.sender}
            </Typography.Text>
            <Typography.Text type="secondary">
              {" "}
              sent at {item.date}
            </Typography.Text>
            <Typography.Paragraph>{item.content}</Typography.Paragraph>
          </List.Item>
        )}
      />
    </CenterLayout>
  );
};

export default Notifications;
