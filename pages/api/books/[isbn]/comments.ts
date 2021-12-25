import type { NextApiRequest, NextApiResponse } from "next";
import {
  PaginationBaseRequest,
  CommentListResponse,
  CommentAddRequest,
  CommentAddResponse,
} from "../../../../common/interface";
import { User, Book, Comment } from "database-course-design-model";
import { AUTHOR_SEPARATOR } from "../../../../common/constants";
import message from "../../../../common/message.json";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<CommentListResponse>
) {
  const { offset, pageLimit } = req.query as Partial<PaginationBaseRequest>;
  const { isbn } = req.query as { isbn: string };
  const book = await Book.selectById(isbn);
  if (book === null) return res.status(404).json({ error: message.bookNF });
  const comments = await Comment.select("`book_id`=?", [book.id], {
    limit: pageLimit,
    offset,
  });
  const commentCount = await Comment.count("`book_id`=?", [book.id]);
  return res.status(200).json({
    comments: comments.map((comment) => ({
      comment: comment.content,
      username: comment.user.id,
      date: comment.createdTime.toString(),
    })),
    total: commentCount,
  });
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<CommentAddResponse>
) {
  //! comment adding is implemented
  const { isbn } = req.query as { isbn: string }; //? ISBN could be extracted from URL, so ISBN in the payload is redundant
  const { userId, comment: content, date } = req.body as CommentAddRequest;
  const user = await User.selectById(String(userId)); //? Someone must have forget to fix this userId as string 😂
  if (user === null) return res.status(404).json({ error: message.userNF });
  const book = await Book.selectById(isbn);
  if (book === null) return res.status(404).json({ error: message.bookNF });
  const comment = new Comment(user, book, content, new Date(date));
  await comment.insert();
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
    return res.status(500).json({ error: (err as Error).message }); //! HTTP 400 Bad Request -> HTTP 500 Internal Server Error
  }
}
