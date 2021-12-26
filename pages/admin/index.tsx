import { message as antdMessage, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";
import message from "../../common/message.json";
import { AdminLayout } from "../../components/Layout";

const AdminHome: NextPage = () => {
  const router = useRouter();
  useLayoutEffect(() => {
    antdMessage.info(message.commingSoon);
    router.replace("/admin/books");
  }, [router]);

  return (
    <AdminLayout>
      <Head>
        <title>Administration overview</title>
        <meta name="description" content="Overview page of administration" />
      </Head>
      <Typography.Title level={3} className="text-center">
        Admin Home
      </Typography.Title>
    </AdminLayout>
  );
};

export default AdminHome;
