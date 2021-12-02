import { Layout, LayoutProps, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

export interface BaseLayoutProps extends LayoutProps {
  routesToProps: Record<
    string,
    { key: string; text: string; icon?: React.ReactNode }
  >;
}

const { Sider, Content } = Layout;

function Base({ routesToProps, children, ...props }: BaseLayoutProps) {
  const router = useRouter();
  const { key: curMenuKey } = routesToProps[router.pathname];

  return (
    <Layout {...props}>
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

export default Base;
