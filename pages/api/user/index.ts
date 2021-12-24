import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UserListResponse,
  PaginationBaseRequest,
} from "../../../common/interface";
import { User } from "database-course-design-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserListResponse>
) {
  try {
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
      pageCount: userCount, //? currently row count instead of page count
    });
  } catch (err) {
    return res.status(500).json({
      //! HTTP 400 Bad Request -> HTTP 500 Internal Server Error
      error: (err as Error).message,
    });
  }
}
