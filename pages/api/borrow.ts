import type { NextApiRequest, NextApiResponse } from "next";
import { BookBorrowRequest, BookBorrowResponse } from "../../common/interface";
import { Copy, User, Transaction } from "database-course-design-model";
import message from "../../common/message.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookBorrowResponse>
) {
  try {
    const { userId, isbn } = req.body as BookBorrowRequest; //? should have copy ID instead of ISBN
    const user = await User.selectById(userId);
    if (user === null) return res.status(404).json({ error: message.userNF });
    const copy = await Copy.selectById(isbn);
    if (copy === null) return res.status(404).json({ error: message.bookNF });
    const transactionCount = await Transaction.count(
      "`copy_id`=? AND `returnDate` IS NULL",
      [copy.id]
    );
    if (transactionCount > 0)
      return res.status(404).json({ error: message.bookNotAvailable });
    const transaction = new Transaction(user, copy);
    await transaction.insert();
    return res.status(200).json({ dueDate: transaction.dueDate.toString() });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 500 Internal Server Error
  }
}
