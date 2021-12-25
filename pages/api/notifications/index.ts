import type { NextApiRequest, NextApiResponse } from "next";
import type {
  NotificationResponse,
  NotificationSendRequest,
  NotificationSendResponse,
} from "../../../common/interface";
import { User, Notification } from "database-course-design-model";
import message from "../../../common/message.json";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<NotificationResponse>
) {
  const { userId } = req.query as { userId?: string }; //? suggest using token to extract the user ID
  if (userId === undefined)
    return res.status(404).json({ error: message.userNF });
  const user = await User.selectById(userId);
  if (user === null) return res.status(404).json({ error: message.userNF });
  const notifications = await Notification.select("`user_id`=?", [user.id]);
  return res.status(200).json({
    notifications: notifications.map((notification) => ({
      id: notification.id,
      receiver: notification.user.id,
      date: notification.sentTime.toString(),
      message: notification.message,
      isRead: notification.isRead,
    })),
  });
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<NotificationSendResponse>
) {
  const { receiverId: userId, message: messageText } =
    req.body as NotificationSendRequest;
  const user = await User.selectById(userId);
  if (user === null) return res.status(404).json({ error: message.userNF });
  const notification = new Notification(user, messageText);
  await notification.insert();
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
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 400 Bad Request -> HTTP 500 Internal Server Error
  }
}
