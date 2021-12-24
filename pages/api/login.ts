import type { NextApiRequest, NextApiResponse } from "next";
import { LoginRequest, LoginResponse } from "../../common/interface";
import { User } from "database-course-design-model";
import message from "../../common/message.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  try {
    const { userId, password } = req.body as LoginRequest;
    const user = await User.selectById(userId);
    if (user === null || !user.authenticate(password))
      return res.status(401).json({ error: message.wrongNameOrPwd });
    else {
      const token = ""; // TODO: token
      return res
        .status(200)
        .setHeader("Set-Cookie", `token=${token}`)
        .json({ isAdmin: user.isAdministrator });
    }
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 500 Internal Server Error
  }
}
