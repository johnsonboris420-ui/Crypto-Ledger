import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { minedBlocksTable, miningWalletTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

function generateHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function computePower(blocksMined: number): number {
  if (blocksMined === 0) return 8;
  return Math.min(8 + Math.log(blocksMined + 1) * 2.5, 20);
}

function computeMaxIter(blocksMined: number): number {
  if (blocksMined === 0) return 50;
  return Math.min(Math.floor(50 + Math.log(blocksMined + 1) * 15), 150);
}

async function ensureWallet() {
  const wallets = await db.select().from(miningWalletTable).limit(1);
  if (wallets.length === 0) {
    const [wallet] = await db
      .insert(miningWalletTable)
      .values({ totalBtc: "0", totalGas: "0", blocksMined: 0 })
      .returning();
    return wallet;
  }
  return wallets[0];
}

router.post("/mining/mine", async (req, res) => {
  try {
    const wallet = await ensureWallet();

    const blocksMined = wallet.blocksMined;
    const blockNum = blocksMined + 1;

    const btcReward = (Math.random() * 0.0005 + 0.0001).toFixed(8);
    const gasFee = (Math.random() * 0.00005 + 0.00001).toFixed(8);

    const power = computePower(blocksMined);
    const wSlice = (Math.sin(blockNum * 0.37) * 0.8).toFixed(6);
    const hash = generateHash();

    const newTotalBtc = (parseFloat(wallet.totalBtc) + parseFloat(btcReward)).toFixed(8);
    const newTotalGas = (parseFloat(wallet.totalGas) + parseFloat(gasFee)).toFixed(8);

    const { block, updatedWallet } = await db.transaction(async (tx) => {
      const [block] = await tx
        .insert(minedBlocksTable)
        .values({
          blockNum,
          hash,
          btcReward,
          gasFee,
          powerSnapshot: power,
          wSliceSnapshot: parseFloat(wSlice),
        })
        .returning();

      const [updatedWallet] = await tx
        .update(miningWalletTable)
        .set({
          totalBtc: newTotalBtc,
          totalGas: newTotalGas,
          blocksMined: blockNum,
          lastMinedAt: new Date(),
        })
        .where(eq(miningWalletTable.id, wallet.id))
        .returning();

      return { block, updatedWallet };
    });

    res.json({
      block: {
        id: block.id,
        blockNum: block.blockNum,
        hash: block.hash,
        btcReward: parseFloat(block.btcReward),
        gasFee: parseFloat(block.gasFee),
        powerSnapshot: block.powerSnapshot,
        wSliceSnapshot: block.wSliceSnapshot,
        minedAt: block.minedAt,
      },
      wallet: {
        totalBtc: parseFloat(updatedWallet.totalBtc),
        totalGas: parseFloat(updatedWallet.totalGas),
        blocksMined: updatedWallet.blocksMined,
        lastMinedAt: updatedWallet.lastMinedAt,
      },
      fractal: {
        power: computePower(updatedWallet.blocksMined),
        maxIter: computeMaxIter(updatedWallet.blocksMined),
        wSlice: parseFloat(wSlice),
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to mine block");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/mining/wallet", async (req, res) => {
  try {
    const wallet = await ensureWallet();
    res.json({
      totalBtc: parseFloat(wallet.totalBtc),
      totalGas: parseFloat(wallet.totalGas),
      blocksMined: wallet.blocksMined,
      lastMinedAt: wallet.lastMinedAt,
      fractal: {
        power: computePower(wallet.blocksMined),
        maxIter: computeMaxIter(wallet.blocksMined),
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get mining wallet");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/mining/blocks", async (req, res) => {
  try {
    const blocks = await db
      .select()
      .from(minedBlocksTable)
      .orderBy(desc(minedBlocksTable.minedAt))
      .limit(50);

    res.json(
      blocks.map((b) => ({
        id: b.id,
        blockNum: b.blockNum,
        hash: b.hash,
        btcReward: parseFloat(b.btcReward),
        gasFee: parseFloat(b.gasFee),
        powerSnapshot: b.powerSnapshot,
        wSliceSnapshot: b.wSliceSnapshot,
        minedAt: b.minedAt,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get mined blocks");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
