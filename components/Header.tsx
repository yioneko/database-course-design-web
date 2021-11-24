import {
  BookFilled,
  DashboardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Popover, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useUserDetails } from "../hooks/queries";
import UserCtx from "../providers/user";
import Login from "./Login";
import { UserAvatar } from "./UserAvatar";

function AvatarMenu() {
  const { dispatch } = useContext(UserCtx);
  const router = useRouter();

  return (
    <Menu mode="vertical" selectable={false}>
      <Menu.Item key="center" icon={<DashboardOutlined />}>
        <Link href="/center">
          <a>User center</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => dispatch({ type: "logout", router })}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
}

const { Header: AntdHeader } = Layout;

function Header() {
  const { userId, isAdmin } = useContext(UserCtx);
  const { data } = useUserDetails(userId);

  const [openLogin, setOpenLogin] = useState(false);

  return (
    <AntdHeader className="flex items-center p-8 bg-primary text-yellow-300">
      <BookFilled className="inline-block mr-auto text-yellow-300 text-3xl" />
      {typeof userId === "undefined" ? (
        <Button
          type="default"
          className="bg-green-300 hover:bg-green-200 focus:bg-green-200"
          onClick={() => {
            setOpenLogin(true);
          }}
        >
          Login
        </Button>
      ) : (
        <Popover
          content={<AvatarMenu />}
          trigger="click"
          placement="bottomRight"
        >
          <div className="cursor-pointer leading-none">
            <Typography.Text className="text-gray-200 font-semibold text-center pr-1 align-middle">
              {data?.name}
            </Typography.Text>
            <UserAvatar isAdmin={isAdmin} />
          </div>
        </Popover>
      )}
      <Login
        visible={openLogin}
        onLogin={() => {
          setOpenLogin(false);
        }}
        onCancel={() => {
          setOpenLogin(false);
        }}
      />
    </AntdHeader>
  );
}

export default Header;
