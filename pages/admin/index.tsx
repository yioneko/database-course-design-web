import { Typography } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";
import { AdminLayout } from "../../components/Layout";
import message from "../../common/message.json";
import { message as antdMessage } from "antd";

const AdminHome: NextPage = () => {
  const router = useRouter();
  useLayoutEffect(() => {
    antdMessage.info(message.commingSoon);
    router.replace("/admin/books");
  }, [router]);

  return (
    <AdminLayout>
      <Typography.Title level={3} className="text-center">
        Admin Home
      </Typography.Title>
    </AdminLayout>
  );
};

export default AdminHome;
