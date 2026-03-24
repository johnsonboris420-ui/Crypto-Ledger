import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tokenTransfersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/token-transfers", async (req, res) => {
  try {
    const transfers = await db.select().from(tokenTransfersTable).orderBy(tokenTransfersTable.id);
    res.json(transfers.map(t => ({
      id: t.id,
      hash: t.hash,
      status: t.status,
      method: t.method,
      blockNo: t.blockNo,
      dateTime: t.dateTime,
      from: t.from,
      fromNametag: t.fromNametag,
      to: t.to,
      toNametag: t.toNametag,
      amount: t.amount,
      valueUsd: t.valueUsd,
      token: t.token,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get token transfers");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
