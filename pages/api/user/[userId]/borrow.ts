import type { NextApiRequest, NextApiResponse } from "next";
import type { UserBorrowInfoResponse } from "../../../../common/interface";
import { User, Transaction } from "database-course-design-model";
import { AUTHOR_SEPARATOR } from "../../../../common/constants";
import message from "../../../../common/message.json";

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
      date: transaction.borrowTime.toString(),
      dueDate: transaction.dueDate.toString(),
      returnDate:
        transaction.returnTime === null
          ? undefined
          : transaction.returnTime.toString(),
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
