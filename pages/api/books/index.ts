import type { NextApiRequest, NextApiResponse } from "next";
import {
  PaginationBaseRequest,
  BookListResponse,
  BookAddRequest,
  BookAddResponse,
} from "../../../common/interface";
import { Book, Copy } from "database-course-design-model";
import { AUTHOR_SEPARATOR } from "../../../common/constants";
import message from "../../../common/message.json";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<BookListResponse>
) {
  const { offset, pageLimit, filter } = req.query as Partial<
    PaginationBaseRequest & { filter: string }
  >;
  const books = await Book.select(
    "MATCH(`title`, `authors`) AGAINST (?)",
    [filter],
    {
      limit: pageLimit,
      offset,
    }
  );
  const bookCount = await Book.count(filter);
  return res.status(200).json({
    books: books.map((book) => ({
      isbn: book.id,
      title: book.title,
      author: book.authors.join(AUTHOR_SEPARATOR),
      available: NaN, //? The usage of the field should be changed since the borrow is copy-based
    })),
    total: bookCount,
  });
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<BookAddResponse>
) {
  const { isbn, title, author } = req.body as BookAddRequest;
  let book = await Book.selectById(isbn);
  if (book === null) {
    if (title === undefined || author === undefined)
      return res.status(400).json({ error: message.requireTitleAndAuthor });
    book = new Book(isbn, title, author.split(AUTHOR_SEPARATOR));
    await book.insert();
  }
  const copy = new Copy(book);
  await copy.insert();
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
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 500 Internal Server Error
  }
}
