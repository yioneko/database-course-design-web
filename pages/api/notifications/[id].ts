import type { NextApiRequest, NextApiResponse } from "next";
import { NotificationReadResponse } from "../../../common/interface";
import { Notification } from "database-course-design-model";
import message from "../../../common/message.json";

async function post(
  req: NextApiRequest,
  res: NextApiResponse<NotificationReadResponse>
) {
  const { id } = req.query as { id: string };
  const { isRead } = req.body as { isRead: boolean }; //? Not sure about this
  const notification = await Notification.selectById(id);
  if (notification === null)
    return res.status(404).json({ error: message.notificationNF }); //! HTTP 404 Not Found
  notification.isRead = isRead;
  await notification.update();
  return res.status(204).end(); //! HTTP 200 OK -> HTTP 204 No Content
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") return post(req, res);
    return res.status(405).json({ error: message.methodNotAllowed }); //! HTTP 405 Method Not Allowed
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 500 Internal Server Error
  }
}
