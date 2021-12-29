import { Transaction, User } from "database-course-design-model";
import type { NextApiRequest, NextApiResponse } from "next";
import { AUTHOR_SEPARATOR } from "../../../../common/constants";
import type { UserBorrowInfoResponse } from "../../../../common/interface";
import message from "../../../../common/message.json";
import formatDate from "../../../../utils/formatDate";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<UserBorrowInfoResponse>
) {
  const { userId } = req.query as { userId: string };
  const user = await User.selectById(userId);
  if (user === null) return res.status(404).json({ error: message.userNF }); //! HTTP 404 Not Found
  const transactions = await Transaction.select("user_id=?", [user.id]);
  return res.status(200).json({
    transactions: transactions.map((transaction) => ({
      isbn: transaction.copy.book.id,
      copyId: transaction.copy.id,
      title: transaction.copy.book.title,
      author: transaction.copy.book.authors.join(AUTHOR_SEPARATOR),
      userId: transaction.user.id,
      date: formatDate(transaction.borrowDate),
      dueDate: formatDate(transaction.dueDate),
      returnDate:
        transaction.returnDate === null
          ? undefined
          : formatDate(transaction.returnDate),
      fine: isNaN(transaction.fine) ? 0 : transaction.fine,
    })),
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
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 500 Internal Server Error
  }
}
