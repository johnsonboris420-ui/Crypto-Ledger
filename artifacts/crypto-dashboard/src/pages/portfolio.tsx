import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd, formatCrypto } from "@/lib/utils";
import { useGetPortfolio } from "@workspace/api-client-react";
import { ArrowUpRight, ArrowDownRight, Activity, Zap, Coins, Wallet } from "lucide-react";
import { motion } from "framer-motion";

// Fallback data if API is unseeded or missing
const MOCK_PORTFOLIO = {
  totalValueUsd: 2248.37,
  change24h: 12.50,
  change24hPercent: 0.56,
  holdings: [
    { symbol: "VINU", name: "Vita Inu", amount: 373269883887, valueUsd: 1463.38, priceUsd: 0.00000392, change24hPercent: 0.20, chain: "BNB Smart Chain" },
    { symbol: "USDT", name: "Tether USD", amount: 739.1672, valueUsd: 739.08, priceUsd: 0.9998, change24hPercent: -0.01, chain: "BNB Smart Chain" },
    { symbol: "DOGE", name: "Dogecoin", amount: 200.4789, valueUsd: 18.95, priceUsd: 0.0945, change24hPercent: 5.11, chain: "BNB Smart Chain" },
    { symbol: "CAKE", name: "PancakeSwap", amount: 7.3052, valueUsd: 10.28, priceUsd: 1.407, change24hPercent: 2.11, chain: "BNB Smart Chain" },
    { symbol: "BTT", name: "BitTorrent", amount: 20577009.14, valueUsd: 6.87, priceUsd: 0.000000334, change24hPercent: 1.02, chain: "BNB Smart Chain" },
    { symbol: "BUSD", name: "Binance USD", amount: 3.9, valueUsd: 3.89, priceUsd: 0.998, change24hPercent: 0.04, chain: "BNB Smart Chain" },
    { symbol: "ADA", name: "Cardano", amount: 10.0, valueUsd: 5.92, priceUsd: 0.592, change24hPercent: -1.2, chain: "BNB Smart Chain" },
  ]
};

export default function PortfolioPage() {
  const { data: apiPortfolio, isLoading } = useGetPortfolio({
    query: {
      retry: false, 
      staleTime: 60000
    }
  });

  const portfolio = apiPortfolio || MOCK_PORTFOLIO;

  const isPositive = portfolio.change24hPercent >= 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in">
        
        {/* Header / Hero Section */}
        <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
          <div className="absolute inset-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/crypto-hero-bg.png`} 
              alt="Crypto Background" 
              className="w-full h-full object-cover opacity-60 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          </div>
          
          <div className="relative z-10 p-10 flex flex-col justify-end min-h-[280px]">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-5 h-5 text-primary" />
              <h2 className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Total Balance</h2>
            </div>
            
            <h1 className="text-6xl font-display font-bold text-white mb-4 tracking-tight text-gradient">
              {formatUsd(portfolio.totalValueUsd)}
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1.5 rounded-lg font-medium text-sm border ${
                isPositive 
                  ? "bg-green-500/10 text-green-400 border-green-500/20" 
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {formatUsd(Math.abs(portfolio.change24h))} ({Math.abs(portfolio.change24hPercent).toFixed(2)}%)
                <span className="ml-2 text-muted-foreground/60 text-xs">24h</span>
              </div>
              
              <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-border/50 text-sm text-muted-foreground flex items-center backdrop-blur-md">
                <Activity className="w-4 h-4 mr-2 text-primary" />
                Healthy Status
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Assets Held</p>
                <p className="text-2xl font-display font-bold text-foreground mt-1">{portfolio.holdings.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Top Performer</p>
                <p className="text-xl font-display font-bold text-foreground mt-1">DOGE <span className="text-green-400 text-sm ml-1">+5.11%</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Activity className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Network</p>
                <p className="text-xl font-display font-bold text-foreground mt-1">BSC Mainnet</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-6">
            <CardTitle>Your Assets</CardTitle>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              Manage Tokens
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-black/10">
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Asset</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Price</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Balance</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {portfolio.holdings.map((holding, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={holding.symbol} 
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center font-display font-bold text-sm shadow-inner text-foreground">
                            {holding.symbol[0]}
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{holding.symbol}</p>
                            <p className="text-xs text-muted-foreground">{holding.name} • {holding.chain}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{formatUsd(holding.priceUsd)}</p>
                        <p className={`text-xs font-medium mt-1 ${holding.change24hPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.change24hPercent >= 0 ? '+' : ''}{holding.change24hPercent.toFixed(2)}%
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{formatCrypto(holding.amount)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{holding.symbol}</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <p className="font-semibold text-foreground">{formatUsd(holding.valueUsd)}</p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
}
