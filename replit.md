# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Crypto Blockchain Dashboard web application showing wallet portfolio, transaction history, and token transfers.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, React Query, framer-motion

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── crypto-dashboard/   # React frontend (Crypto Blockchain Dashboard)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   └── src/
│       └── seed-crypto.ts  # Seeds DB with crypto wallet/transaction data
```

## Features

- **Portfolio Overview**: Total wallet value ($2,244.83), 24h changes, 7 crypto holdings (VINU, USDT, DOGE, CAKE, BTT, BUSD, ADA) on BNB Smart Chain
- **Transaction History**: Ethereum transactions from CSV exports (Transfers, Swaps, Multicalls, Bridge ops)
- **Token Transfers**: Detailed VINU token transfer history with amounts, USD values, sender/recipient nametags

## Database Schema

- `transactions` - Blockchain transaction records (hash, chain, action type, from/to addresses)
- `token_transfers` - ERC-20 token transfer records (block, method, amounts, USD values)
- `holdings` - Wallet portfolio holdings (symbol, amount, price, 24h change, chain)

## API Endpoints

- `GET /api/healthz` - Health check
- `GET /api/portfolio` - Portfolio summary with holdings
- `GET /api/transactions` - Transaction list
- `GET /api/token-transfers` - Token transfer history

## Seeding

Run `pnpm --filter @workspace/scripts run seed-crypto` to populate the database with the sample data.
