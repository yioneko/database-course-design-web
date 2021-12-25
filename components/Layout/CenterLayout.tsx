import {
  CarryOutOutlined,
  NotificationOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import useAccessControl from "../../hooks/useAccessControl";
import Base from "./Base";

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

export function CenterLayout({ children }: { children?: React.ReactNode }) {
  useAccessControl();

  return (
    <Base
      hasSider
      routesToProps={routesToProps}
      className="max-w-screen-lg mx-auto"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {children}
    </Base>
  );
}
