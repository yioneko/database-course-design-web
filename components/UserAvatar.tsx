import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  isAdmin: boolean;
}

export function UserAvatar({ isAdmin, ...props }: UserAvatarProps) {
  return isAdmin ? (
    <Avatar
      alt="Admin avatar"
      icon={<UserOutlined />}
      {...props}
      className={`bg-red-400 ${props.className}`}
    />
  ) : (
    <Avatar
      alt="User avatar"
      icon={<UserOutlined />}
      {...props}
      className={`bg-green-400 ${props.className}`}
    />
  );
}
