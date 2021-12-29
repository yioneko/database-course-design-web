import { NextApiRequest, NextApiResponse } from "next";
import {
  UserListResponse,
  PaginationBaseRequest,
} from "../../../common/interface";
import { User } from "database-course-design-model";
import message from "../../../common/message.json";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<UserListResponse>
) {
  const { offset, pageLimit } = req.query as Partial<PaginationBaseRequest>;
  const users = await User.select(undefined, undefined, {
    offset,
    limit: pageLimit,
  });
  const userCount = await User.count();
  return res.status(200).json({
    users: users.map((user) => ({
      userId: user.id,
      name: user.name,
      isAdmin: user.isAdministrator,
    })),
    total: userCount,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") return get(req, res);
    return res.status(405).json({ error: message.methodNotAllowed }); //! HTTP 405 Method Not Allowed
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 400 Bad Request -> HTTP 500 Internal Server Error
  }
}
