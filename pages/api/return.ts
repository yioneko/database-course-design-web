import type { NextApiRequest, NextApiResponse } from "next";
import { BookReturnRequest, BookReturnResponse } from "../../common/interface";
import { Copy, User, Transaction } from "database-course-design-model";
import message from "../../common/message.json";

async function post(
  req: NextApiRequest,
  res: NextApiResponse<BookReturnResponse>
) {
  const { copyId } = req.body as BookReturnRequest;
  const copy = await Copy.selectById(copyId);
  if (copy === null) return res.status(404).json({ error: message.copyNF });
  const transactions = await Transaction.select(
    "`copy_id`=? AND `returnDate` IS NULL",
    [copy.id]
  );
  if (transactions.length === 0)
    return res.status(404).json({ error: message.bookNotBorrowed });
  const transaction = transactions[0];
  transaction.returnDate = new Date();
  await transaction.update();
  return res.status(204).end(); //! HTTP 200 OK -> HTTP 204 No Content
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
