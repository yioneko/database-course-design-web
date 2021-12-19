import { CheckSquareOutlined } from "@ant-design/icons";
import { Button, List, Typography } from "antd";
import axios from "axios";
import { NextPage } from "next";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  NotificationReadParams,
  NotificationSuccessResponse,
} from "../../common/interface";
import { CenterLayout } from "../../components/Layout";
import UserCtx from "../../providers/user";

const Notifications: NextPage = () => {
  const { userId } = useContext(UserCtx);
  const { data, isFetching } = useQuery(["notifications", userId], async () => {
    const res = await axios.get<NotificationSuccessResponse>(
      `/api/notifications?userId=${userId}`
    );
    return res.data.notifications;
  });

  const queryClient = useQueryClient();
  const readMutation = useMutation(
    async (id: string) => {
      return await axios.post<NotificationReadParams>(
        `/api/notifications/${id}`,
        { isRead: true }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
      },
    }
  );

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
            <Typography.Paragraph>{item.message}</Typography.Paragraph>
          </List.Item>
        )}
      />
    </CenterLayout>
  );
};

export default Notifications;
