# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Crypto Blockchain Dashboard web application showing wallet portfolio, transaction history, and token transfers. Includes a simulated BTC + ETH fractal mining engine and a mobile Expo companion app.

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
- **Mobile**: Expo (React Native), expo-clipboard, react-native-svg

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   ├── crypto-dashboard/   # React frontend (Crypto Blockchain Dashboard)
│   ├── mobile/             # Expo mobile app (Mining companion)
│   └── mockup-sandbox/     # Component preview server
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

- **Portfolio Overview**: Total wallet value, 24h changes, 7+ crypto holdings (VINU, USDT, DOGE, CAKE, BTT, BUSD, ADA) on BNB Smart Chain, plus mined BTC and ETH
- **Transaction History**: Ethereum transactions from CSV exports (Transfers, Swaps, Multicalls, Bridge ops) plus mining transactions
- **Token Transfers**: Detailed VINU token transfer history with amounts, USD values, sender/recipient nametags
- **Mining Engine**: Simulated BTC + ETH fractal mining with auto-mine (ON by default), 4D Mandelbulb visualization, ETH used as gas fees
- **BNB Destination Wallets**: Account 1 (0x572e...a104) and Account 2 (0x69c8...ab45) with QR placeholders and copy buttons
- **Mobile App**: Expo companion with mining screen (fractal viz, balances, BNB wallets, block feed) and wallet tab

## Database Schema

- `transactions` - Blockchain transaction records (hash, chain, action type, from/to addresses)
- `token_transfers` - ERC-20 token transfer records (block, method, amounts, USD values)
- `holdings` - Wallet portfolio holdings (symbol, amount, price, 24h change, chain)
- `mined_blocks` - Mined block records (blockNum, hash, btcReward, ethReward, gasFee, power/wSlice snapshots)
- `mining_wallet` - Singleton mining wallet (totalBtc, totalEth, totalGas, blocksMined, destinationWallet1/2)

## API Endpoints

- `GET /api/healthz` - Health check
- `GET /api/portfolio` - Portfolio summary with holdings
- `GET /api/transactions` - Transaction list
- `GET /api/token-transfers` - Token transfer history
- `POST /api/mining/mine` - Mine a block (returns BTC reward, ETH reward, gas fee)
- `GET /api/mining/wallet` - Mining wallet balances (BTC, ETH, gas spent, destination wallets)
- `GET /api/mining/blocks` - Recent mined blocks (last 50)
- `GET /api/mining/holding` - Mined BTC + ETH as portfolio holdings array
- `GET /api/mining/transactions` - Mined blocks as transaction records

## Seeding

Run `pnpm --filter @workspace/scripts run seed-crypto` to populate the database with the sample data.
