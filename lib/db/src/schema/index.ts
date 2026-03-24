import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  chainName: text("chain_name").notNull(),
  status: text("status").notNull(),
  action: text("action").notNull(),
  token: text("token").notNull(),
  from: text("from").notNull(),
  fromInfo: text("from_info").notNull(),
  to: text("to").notNull(),
  toInfo: text("to_info").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tokenTransfersTable = pgTable("token_transfers", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  status: text("status").notNull(),
  method: text("method").notNull(),
  blockNo: integer("block_no").notNull(),
  dateTime: text("date_time").notNull(),
  from: text("from").notNull(),
  fromNametag: text("from_nametag").notNull().default(""),
  to: text("to").notNull(),
  toNametag: text("to_nametag").notNull().default(""),
  amount: text("amount").notNull(),
  valueUsd: text("value_usd").notNull(),
  token: text("token").notNull(),
});

export const holdingsTable = pgTable("holdings", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 30, scale: 10 }).notNull(),
  valueUsd: decimal("value_usd", { precision: 18, scale: 4 }).notNull(),
  priceUsd: decimal("price_usd", { precision: 18, scale: 8 }).notNull(),
  change24hPercent: decimal("change_24h_percent", { precision: 10, scale: 4 }).notNull(),
  chain: text("chain").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;

export const insertTokenTransferSchema = createInsertSchema(tokenTransfersTable).omit({ id: true });
export type InsertTokenTransfer = z.infer<typeof insertTokenTransferSchema>;
export type TokenTransfer = typeof tokenTransfersTable.$inferSelect;

export const insertHoldingSchema = createInsertSchema(holdingsTable).omit({ id: true });
export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Holding = typeof holdingsTable.$inferSelect;
