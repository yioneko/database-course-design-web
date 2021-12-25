import type { NextApiRequest, NextApiResponse } from "next";
import { BookCopiesResponse } from "../../../../common/interface";
import { Book, Copy } from "database-course-design-model";
import message from "../../../../common/message.json";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<BookCopiesResponse>
) {
  const { isbn } = req.query as { isbn: string };
  const book = await Book.selectById(isbn);
  if (book === null) return res.status(404).json({ error: message.bookNF });
  const copies = await Copy.select("`book_id`=?", [book.id]);
  return res.status(200).json({
    copies: copies.map((copy) => copy.id),
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
