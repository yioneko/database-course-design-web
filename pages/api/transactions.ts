import type { NextApiRequest, NextApiResponse } from "next";
import {
  PaginationBaseRequest,
  TransactionListResponse,
} from "../../common/interface";
import { Transaction } from "database-course-design-model";
import { AUTHOR_SEPARATOR } from "../../common/constants";
import message from "../../common/message.json";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<TransactionListResponse>
) {
  const { offset, pageLimit } = req.query as Partial<PaginationBaseRequest>;
  const transactions = await Transaction.select(undefined, undefined, {
    offset,
    limit: pageLimit,
  });
  const transactionCount = await Transaction.count();
  return res.status(200).json({
    transactions: transactions.map((transaction) => ({
      isbn: transaction.copy.book.id,
      copyId: transaction.copy.id,
      title: transaction.copy.book.title,
      author: transaction.copy.book.authors.join(AUTHOR_SEPARATOR),
      userId: transaction.user.id,
      date: transaction.borrowDate.toString(),
      dueDate: transaction.dueDate.toString(),
      returnDate:
        transaction.returnDate === null
          ? undefined
          : transaction.returnDate.toString(),
      fine: isNaN(transaction.fine) ? 0 : transaction.fine,
    })),
    total: transactionCount,
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
