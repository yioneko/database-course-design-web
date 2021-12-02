import {
  BookOutlined,
  FileDoneOutlined,
  FundOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Base from "./Base";

const routesToProps = {
  "/admin": {
    key: "overview",
    text: "Overview",
    icon: <FundOutlined />,
  },
  "/admin/books": {
    key: "books",
    text: "Books",
    icon: <BookOutlined />,
  },
  "/admin/transactions": {
    key: "transactions",
    text: "Transactions",
    icon: <FileDoneOutlined />,
  },
  "/admin/users": {
    key: "users",
    text: "Users",
    icon: <TeamOutlined />,
  },
};

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Base
      hasSider
      routesToProps={routesToProps}
      className="max-w-screen-xl mx-auto"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {children}
    </Base>
  );
}
