import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { transactionsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/transactions", async (req, res) => {
  try {
    const transactions = await db.select().from(transactionsTable).orderBy(transactionsTable.id);
    res.json(transactions.map(t => ({
      id: t.id,
      hash: t.hash,
      chainName: t.chainName,
      status: t.status,
      action: t.action,
      token: t.token,
      from: t.from,
      fromInfo: t.fromInfo,
      to: t.to,
      toInfo: t.toInfo,
      createdAt: t.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get transactions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
