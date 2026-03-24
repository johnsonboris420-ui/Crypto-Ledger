import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { holdingsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/portfolio", async (req, res) => {
  try {
    const holdings = await db.select().from(holdingsTable).orderBy(holdingsTable.id);
    
    const holdingsMapped = holdings.map(h => ({
      symbol: h.symbol,
      name: h.name,
      amount: parseFloat(h.amount),
      valueUsd: parseFloat(h.valueUsd),
      priceUsd: parseFloat(h.priceUsd),
      change24hPercent: parseFloat(h.change24hPercent),
      chain: h.chain,
    }));

    const totalValueUsd = holdingsMapped.reduce((sum, h) => sum + h.valueUsd, 0);

    res.json({
      totalValueUsd,
      change24h: 4.43,
      change24hPercent: 0.20,
      holdings: holdingsMapped,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get portfolio");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
