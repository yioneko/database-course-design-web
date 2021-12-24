import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserInfoResponse,
  ModifyNameRequest,
  ModifyPasswordRequest,
  ModifyUserRequest,
  ModifyUserResponse,
} from "../../../../common/interface";
import { User } from "database-course-design-model";
import message from "../../../../common/message.json";

const isModifyNameRequest = (
  reqBody: ModifyUserRequest
): reqBody is ModifyNameRequest =>
  (reqBody as Partial<ModifyNameRequest>).name !== undefined;
const isModifyPasswordRequest = (
  reqBody: ModifyUserRequest
): reqBody is ModifyPasswordRequest =>
  (reqBody as Partial<ModifyPasswordRequest>).password !== undefined &&
  (reqBody as Partial<ModifyPasswordRequest>).newPassword !== undefined;

async function get(
  req: NextApiRequest,
  res: NextApiResponse<UserInfoResponse>
) {
  const { userId } = req.query as { userId: string };
  const user = await User.selectById(userId);
  if (user === null) return res.status(404).json({ error: message.userNF });
  else
    return res.status(200).json({
      name: user.name,
      isAdmin: user.isAdministrator,
    });
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<ModifyUserResponse>
) {
  const { userId } = req.query as { userId: string };
  const user = await User.selectById(userId);
  if (user === null) return res.status(404).json({ error: message.userNF });
  let isChanged = false;
  if (isModifyPasswordRequest(req.body)) {
    if (!user.authenticate(req.body.password))
      return res.status(403).json({ error: message.wrongPwd }); //! HTTP 400 Bad Request -> HTTP 403 Forbidden
    user.password = req.body.newPassword;
    isChanged = true;
  }
  if (isModifyNameRequest(req.body)) {
    user.name = req.body.name;
    isChanged = true;
  }
  if (isChanged) await user.update();
  return res.status(204).end(); //! HTTP 200 OK -> HTTP 204 No Content
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") return get(req, res);
    if (req.method === "POST") return post(req, res);
    return res.status(405).json({ error: message.methodNotAllowed }); //! HTTP 405 Method Not Allowed
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 500 Internal Server Error
  }
}
