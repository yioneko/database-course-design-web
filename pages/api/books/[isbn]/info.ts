import type { NextApiRequest, NextApiResponse } from "next";
import { BookInfoResponse } from "../../../../common/interface";
import { Book, Transaction } from "database-course-design-model";
import { AUTHOR_SEPARATOR } from "../../../../common/constants";
import message from "../../../../common/message.json";
import verifyToken from "../../../../utils/verifyToken";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<BookInfoResponse>
) {
  const { isbn } = req.query as { isbn: string };
  const book = await Book.selectById(isbn);
  if (book === null) return res.status(404).json({ error: message.bookNF });
  const result: BookInfoResponse = {
    title: book.title,
    author: book.authors.join(AUTHOR_SEPARATOR),
    available: NaN, //? The usage of the field should be changed since the borrow is copy-based
  };
  const { userId } = verifyToken(req.cookies.token);
  if (userId !== undefined) {
    const transactionCount = await Transaction.count(
      "`user_id`=? AND `copy_book_id`=?",
      [userId, book.id]
    );
    result.borrowed = transactionCount > 0;
  }
  return res.status(200).json(result);
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
