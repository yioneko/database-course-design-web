import jwt from "jsonwebtoken";
import { UserInfo } from "../providers/user";

function verifyToken(token: string): Partial<UserInfo> {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as UserInfo;
  } catch {
    return {};
  }
}

export default verifyToken;
