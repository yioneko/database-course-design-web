import {
  CarryOutOutlined,
  NotificationOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

const { Sider, Content } = Layout;

const routesToProps = {
  "/center": {
    key: "profile",
    text: "Profile",
    icon: <ProfileOutlined />,
  },
  "/center/notifications": {
    key: "notification",
    text: "Notifications",
    icon: <NotificationOutlined />,
  },
  "/center/borrow": {
    key: "borrow",
    text: "My borrowed",
    icon: <CarryOutOutlined />,
  },
};

function CenterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { key: curMenuKey } =
    routesToProps[router.pathname as keyof typeof routesToProps];

  return (
    <Layout
      hasSider
      className="max-w-screen-lg mx-auto"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <Sider theme="light">
        <Menu selectedKeys={[curMenuKey]} mode="vertical">
          {Object.entries(routesToProps).map(([route, props]) => (
            <Menu.Item key={props.key} icon={props.icon}>
              <Link href={route}>
                <a>
                  <span>{props.text}</span>
                </a>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Content className="bg-white">{children}</Content>
    </Layout>
  );
}

export default CenterLayout;
