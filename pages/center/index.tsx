import { Descriptions } from "antd";
import { NextPage } from "next";
import { useContext } from "react";
import { CenterLayout } from "../../components/Layout";
import NameEdit from "../../components/NameEdit";
import PassowrdEdit from "../../components/PasswordEdit";
import { UserAvatar } from "../../components/UserAvatar";
import { useUserDetails } from "../../hooks/queries";
import UserCtx from "../../providers/user";

const Profile: NextPage = () => {
  const { userId, isAdmin } = useContext(UserCtx);
  const { data } = useUserDetails(userId);

  if (!userId) {
    return <></>;
  }

  return (
    <CenterLayout>
      <div className="bg-white flex flex-col items-center">
        <UserAvatar isAdmin={isAdmin} size="large" className="mt-4 mb-6" />
        <Descriptions
          column={1}
          className="max-w-lg border-2 border-indigo-100 border-solid rounded shadow-md p-4 mb-12"
          labelStyle={{ color: "var(--ant-primary-6)" }}
        >
          <Descriptions.Item label="ID">{userId}</Descriptions.Item>
          <Descriptions.Item label="Name">
            <NameEdit userId={userId} name={data?.name ?? ""} />
          </Descriptions.Item>
          <Descriptions.Item label="Reset password">
            <PassowrdEdit userId={userId} />
          </Descriptions.Item>
        </Descriptions>
      </div>
    </CenterLayout>
  );
};

export default Profile;
