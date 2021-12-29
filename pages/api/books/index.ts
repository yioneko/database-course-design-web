import { Logtail } from "@logtail/node";
import { Book, Copy } from "database-course-design-model";
import type { NextApiRequest, NextApiResponse } from "next";
import { AUTHOR_SEPARATOR } from "../../../common/constants";
import {
  BookAddRequest,
  BookAddResponse,
  BookListResponse,
  PaginationBaseRequest,
} from "../../../common/interface";
import message from "../../../common/message.json";

const logger = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN || "");

async function get(
  req: NextApiRequest,
  res: NextApiResponse<BookListResponse>
) {
  const { offset, pageLimit, filter } = req.query as Partial<
    PaginationBaseRequest & { filter: string }
  >;
  const conditions = filter
    ? "MATCH(`title`, `authors`) AGAINST (? IN BOOLEAN MODE)"
    : undefined;
  const parameters = filter ? [filter] : undefined;
  const books = await Book.select(conditions, parameters, {
    limit: pageLimit,
    offset,
  });

  const bookCount = await Book.count(conditions, parameters);
  console.log("books:\n", books);
  return res.status(200).json({
    books: books.map((book) => ({
      isbn: book.id,
      title: book.title,
      author: book.authors.join(AUTHOR_SEPARATOR),
      available: book.available,
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
    // FIXME: I don't know how to fix the available field...
    book = new Book(isbn, title, author.split(AUTHOR_SEPARATOR), 0);
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
  await logger.info("Request", { body: req.body, query: req.query as any });
  try {
    if (req.method === "GET") return get(req, res);
    if (req.method === "POST") return post(req, res);
    return res.status(405).json({ error: message.methodNotAllowed }); //! HTTP 405 Method Not Allowed
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 500 Internal Server Error
  }
}
