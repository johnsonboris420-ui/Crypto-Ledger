import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUsd, formatCrypto, shortenAddress } from "@/lib/utils";
import { useGetTokenTransfers } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Search, ArrowRight, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_TRANSFERS = [
  { id: 1, hash: "0x123abc...", status: "Success", method: "Transfer", blockNo: 38472910, dateTime: "2024-05-15T14:22:10Z", from: "0x572e...", fromNametag: "My Wallet", to: "0x987d...", toNametag: "Binance Hot", amount: "1000", valueUsd: "999.80", token: "USDT" },
  { id: 2, hash: "0x456def...", status: "Success", method: "Transfer", blockNo: 38472850, dateTime: "2024-05-15T12:10:05Z", from: "0xaaa1...", fromNametag: "PancakeSwap", to: "0x572e...", toNametag: "My Wallet", amount: "50000000", valueUsd: "196.00", token: "VINU" },
  { id: 3, hash: "0x789ghi...", status: "Success", method: "Transfer", blockNo: 38461020, dateTime: "2024-05-14T09:12:45Z", from: "0x572e...", fromNametag: "My Wallet", to: "0xbbb2...", toNametag: "KuCoin", amount: "150.5", valueUsd: "14.22", token: "DOGE" },
  { id: 4, hash: "0x012jkl...", status: "Success", method: "Transfer", blockNo: 38450000, dateTime: "2024-05-13T18:45:00Z", from: "0xccc3...", fromNametag: "Airdrop Contract", to: "0x572e...", toNametag: "My Wallet", amount: "10000", valueUsd: "3.34", token: "BTT" },
];

export default function TokenTransfersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: apiTransfers, isLoading } = useGetTokenTransfers({
    query: { retry: false, staleTime: 60000 }
  });

  const allTransfers = apiTransfers && apiTransfers.length > 0 ? apiTransfers : MOCK_TRANSFERS;
  
  const filteredTransfers = allTransfers.filter(t => 
    t.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="max-w-6xl mx-auto space-y-6 animate-in">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Token Transfers</h1>
            <p className="text-muted-foreground mt-1">Detailed history of all ERC-20 token movements</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tokens or hashes..." 
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-black/10">
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Txn Hash</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Age</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Transfer Path</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Amount</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase text-right">Token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredTransfers.length > 0 ? filteredTransfers.map((transfer, i) => {
                    const isOut = transfer.fromNametag === "My Wallet" || transfer.from.startsWith("0x572e");
                    
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={transfer.id} 
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-6">
                          <span className="text-primary font-mono text-sm">{shortenAddress(transfer.hash)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-foreground">{format(new Date(transfer.dateTime), "MMM d")}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(transfer.dateTime), "HH:mm")}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{transfer.fromNametag || shortenAddress(transfer.from)}</span>
                              <span className="text-xs text-muted-foreground font-mono">{shortenAddress(transfer.from)}</span>
                            </div>
                            <div className={`p-1.5 rounded-full ${isOut ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{transfer.toNametag || shortenAddress(transfer.to)}</span>
                              <span className="text-xs text-muted-foreground font-mono">{shortenAddress(transfer.to)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className={`font-semibold text-sm ${isOut ? 'text-foreground' : 'text-green-400'}`}>
                            {isOut ? '-' : '+'}{formatCrypto(transfer.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatUsd(transfer.valueUsd)}</p>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Badge variant="outline" className="bg-card shadow-sm border-border/50">
                            {transfer.token}
                          </Badge>
                        </td>
                      </motion.tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                          <ArrowRightLeft className="w-12 h-12 text-muted-foreground/30 mb-3" />
                          <p>No token transfers found matching your search.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
}
