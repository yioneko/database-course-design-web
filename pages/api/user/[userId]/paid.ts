import { NextApiRequest, NextApiResponse } from "next";
import { FinePaidCheckResponse } from "../../../../common/interface";
import { User, Transaction } from "database-course-design-model";
import message from "../../../../common/message.json";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<FinePaidCheckResponse>
) {
  const { userId } = req.query as { userId: string };
  const user = await User.selectById(userId);
  if (user === null) return res.status(404).json({ error: message.userNF });
  const transactions = await Transaction.select("user_id=?", [user.id]);
  // assume all paid, update fine of all transactions
  await Promise.all(
    transactions.map(async (transaction) => {
      if (transaction.fine > 0) {
        transaction.isFinePaid = true;
        await transaction.update();
      }
    })
  );
  return res.status(200).json({ isPaid: true });
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
