import { NextApiRequest, NextApiResponse } from "next";
import { BookBorrowRequest, BookBorrowResponse } from "../../common/interface";
import { Copy, User, Transaction } from "database-course-design-model";
import message from "../../common/message.json";
import formatDate from "../../utils/formatDate";

async function post(
  req: NextApiRequest,
  res: NextApiResponse<BookBorrowResponse>
) {
  const { userId, copyId } = req.body as BookBorrowRequest;
  const user = await User.selectById(userId);
  if (user === null) return res.status(404).json({ error: message.userNF });
  const copy = await Copy.selectById(copyId);
  if (copy === null) return res.status(404).json({ error: message.copyNF });
  const transactionCount = await Transaction.count(
    "`copy_id`=? AND `returnDate` IS NULL",
    [copy.id]
  );
  if (transactionCount > 0)
    return res.status(400).json({ error: message.bookNotAvailable });
  const transaction = new Transaction(user, copy);
  await transaction.insert();
  return res.status(200).json({ dueDate: formatDate(transaction.dueDate) });
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
