import {
  BookFilled,
  DashboardOutlined,
  LogoutOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, MenuProps, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useUserDetails } from "../hooks/queries";
import UserCtx from "../providers/user";
import Login from "./Login";
import { UserAvatar } from "./UserAvatar";

function AvatarMenu(props: MenuProps) {
  const { isAdmin, dispatch } = useContext(UserCtx);
  const router = useRouter();

  return (
    <Menu mode="vertical" selectable={false} {...props}>
      <Menu.Item
        key="center"
        icon={<DashboardOutlined />}
        className="leading-8"
      >
        <Link href="/center">
          <a>User center</a>
        </Link>
      </Menu.Item>
      {isAdmin && (
        <Menu.Item
          key="admin"
          icon={<PieChartOutlined />}
          className="leading-8"
        >
          <Link href="/admin">
            <a>Administration</a>
          </Link>
        </Menu.Item>
      )}
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => dispatch({ type: "logout", router })}
        className="leading-8"
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
    <AntdHeader className="flex items-center bg-primary text-yellow-300">
      <Link href="/">
        <a className="inline-block mr-auto text-yellow-300 text-3xl hover:text-yellow-300">
          <BookFilled />
          <Typography.Title
            className="inline ml-2 !text-yellow-100 font-serif align-bottom"
            level={3}
          >
            SCUT Library
          </Typography.Title>
        </a>
      </Link>
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
        <Dropdown
          overlay={<AvatarMenu />}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="cursor-pointer leading-none">
            <Typography.Text className="text-gray-200 font-semibold text-center pr-1 align-middle">
              {data?.name}
            </Typography.Text>
            <UserAvatar isAdmin={isAdmin} />
          </div>
        </Dropdown>
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
