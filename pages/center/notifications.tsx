import { CheckSquareOutlined } from "@ant-design/icons";
import { Button, List, Typography } from "antd";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
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
      <Head>
        <title>User center - notifications</title>
        <meta name="description" content="Notifications of user" />
      </Head>
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
            <Typography.Paragraph>{item.message}</Typography.Paragraph>
            <Typography.Text className="text-purple-400">
              {item.date}
            </Typography.Text>
          </List.Item>
        )}
      />
    </CenterLayout>
  );
};

export default Notifications;
