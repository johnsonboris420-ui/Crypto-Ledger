import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { shortenAddress } from "@/lib/utils";
import { useGetTransactions } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink, Filter, Download, Pickaxe } from "lucide-react";
import { motion } from "framer-motion";

function getApiUrl(path: string) {
  return `/api${path}`;
}

const ETHERSCAN_BASE = "https://etherscan.io";
const BSCSCAN_BASE = "https://bscscan.com";

interface DisplayTransaction {
  id: number;
  hash: string;
  chainName: string;
  status: string;
  action: string;
  token: string;
  from: string;
  fromInfo: string;
  to: string;
  toInfo: string;
  amount: string;
  fee: string;
  block: string;
  createdAt: string;
  ethReward?: string;
}

const MOCK_TRANSACTIONS: DisplayTransaction[] = [
  { id: 0, hash: "0x74b7ec12eacae343912fd4e000281c982aa21869f07ef042921785a3f7cfc7fa", chainName: "ETH", status: "Success", action: "Receive", token: "ETH", from: "0x2b3FeD49f0285bBd5BC6AB86b94355305DbB", fromInfo: "Revolut 4 (ERC-4337)", to: "0xAB91784C3c94b3c5d51C8bC6AB86b94CB5FDA3f1", toInfo: "My Wallet", amount: "+0.00050449 ETH", fee: "0.000100828724 ETH ($0.22)", block: "24720155", createdAt: "2026-03-23T12:15:23Z" },
  { id: 1, hash: "0x8fa9b3847291a84f3c837402a", chainName: "BSC", status: "Success", action: "Transfer", token: "USDT", from: "0xAB91784C3c94b3c5d51C8bC6AB86b94CB5FDA3f1", fromInfo: "My Wallet", to: "0x123abc...", toInfo: "Binance Hot Wallet", amount: "-1000 USDT", fee: "", block: "38472910", createdAt: "2024-05-15T14:22:10Z" },
  { id: 2, hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3", chainName: "BSC", status: "Success", action: "Swap", token: "VINU → USDT", from: "0xAB91784C3c94b3c5d51C8bC6AB86b94CB5FDA3f1", fromInfo: "My Wallet", to: "0x987def...", toInfo: "PancakeSwap Router", amount: "", fee: "", block: "38472850", createdAt: "2024-05-14T09:12:45Z" },
  { id: 3, hash: "0x9z8y7x6w5v4u3t2s1r0q", chainName: "BSC", status: "Failed", action: "Multicall", token: "-", from: "0xAB91784C3c94b3c5d51C8bC6AB86b94CB5FDA3f1", fromInfo: "My Wallet", to: "0x567ghi...", toInfo: "Smart Contract", amount: "", fee: "", block: "38461020", createdAt: "2024-05-13T18:45:00Z" },
  { id: 4, hash: "0x4k5l6m7n8o9p0q1r2s3t", chainName: "BSC", status: "Success", action: "Transfer", token: "DOGE", from: "0x111aaa...", fromInfo: "KuCoin", to: "0xAB91784C3c94b3c5d51C8bC6AB86b94CB5FDA3f1", toInfo: "My Wallet", amount: "+150.5 DOGE", fee: "", block: "38450000", createdAt: "2024-05-12T11:30:22Z" },
  { id: 5, hash: "0x8a9b0c1d2e3f4g5h6i7j", chainName: "BSC", status: "Success", action: "Approve", token: "CAKE", from: "0xAB91784C3c94b3c5d51C8bC6AB86b94CB5FDA3f1", fromInfo: "My Wallet", to: "0x987def...", toInfo: "PancakeSwap Router", amount: "", fee: "", block: "38110050", createdAt: "2024-05-10T16:05:11Z" },
];

function toDisplayTx(txn: Record<string, unknown>): DisplayTransaction {
  return {
    id: Number(txn.id ?? 0),
    hash: String(txn.hash ?? ""),
    chainName: String(txn.chainName ?? "BSC"),
    status: String(txn.status ?? ""),
    action: String(txn.action ?? ""),
    token: String(txn.token ?? ""),
    from: String(txn.from ?? ""),
    fromInfo: String(txn.fromInfo ?? ""),
    to: String(txn.to ?? ""),
    toInfo: String(txn.toInfo ?? ""),
    amount: String(txn.amount ?? ""),
    fee: String(txn.fee ?? ""),
    block: String(txn.block ?? ""),
    createdAt: String(txn.createdAt ?? ""),
    ethReward: txn.ethReward ? String(txn.ethReward) : undefined,
  };
}

export default function TransactionsPage() {
  const { data: apiTxns, isLoading } = useGetTransactions({
    query: { retry: false, staleTime: 60000 }
  });

  const { data: miningTxns } = useQuery<DisplayTransaction[]>({
    queryKey: ["mining-transactions"],
    queryFn: async () => {
      const res = await fetch(getApiUrl("/mining/transactions"));
      if (!res.ok) throw new Error("Failed to fetch mining transactions");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const baseTxns: DisplayTransaction[] = apiTxns && apiTxns.length > 0
    ? apiTxns.map((t) => toDisplayTx(t as unknown as Record<string, unknown>))
    : MOCK_TRANSACTIONS;
  const transactions: DisplayTransaction[] = [
    ...(miningTxns ?? []),
    ...baseTxns,
  ];

  const getActionBadge = (action: string) => {
    switch(action.toLowerCase()) {
      case 'transfer': return <Badge variant="info">{action}</Badge>;
      case 'swap': return <Badge variant="warning">{action}</Badge>;
      case 'multicall': return <Badge variant="default">{action}</Badge>;
      case 'approve': return <Badge variant="outline">{action}</Badge>;
      case 'mine': return (
        <Badge variant="success" className="flex items-center gap-1">
          <Pickaxe className="w-3 h-3" />
          {action}
        </Badge>
      );
      default: return <Badge variant="outline">{action}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status.toLowerCase() === 'success') return <Badge variant="success">Success</Badge>;
    if (status.toLowerCase() === 'failed') return <Badge variant="danger">Failed</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

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
            <h1 className="text-3xl font-display font-bold text-foreground">Transaction History</h1>
            <p className="text-muted-foreground mt-1">Review your recent blockchain activities</p>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-black/10">
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Hash</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Chain</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Method</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Date</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">From</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Amount</th>
                    <th className="py-4 px-6 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {transactions.map((txn, i) => {
                    const explorerBase = txn.chainName === "ETH" ? ETHERSCAN_BASE : BSCSCAN_BASE;
                    const explorerUrl = `${explorerBase}/tx/${txn.hash}`;
                    const isRealHash = txn.hash.length === 66;
                    const isMine = txn.action === "Mine";
                    const isReceive = txn.action === "Receive" || txn.toInfo === "My Wallet" || isMine;
                    return (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.5) }}
                      key={txn.id} 
                      className={`hover:bg-white/[0.02] transition-colors ${isMine ? "border-l-2 border-orange-500/40" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-primary font-mono text-sm">{shortenAddress(txn.hash)}</span>
                          {isRealHash ? (
                            <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1" title="View on Explorer">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1 opacity-40" disabled>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {txn.block && <p className="text-[10px] text-muted-foreground mt-0.5">Block #{txn.block}</p>}
                      </td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant={
                            txn.chainName === "ETH" ? "info" 
                            : txn.chainName === "BTC" ? "warning" 
                            : "warning"
                          } 
                          className="text-[10px]"
                        >
                          {txn.chainName || "BSC"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        {getActionBadge(txn.action)}
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-foreground">{format(new Date(txn.createdAt), "MMM d, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(txn.createdAt), "HH:mm:ss")}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-foreground">{shortenAddress(txn.from)}</span>
                          </div>
                          {txn.fromInfo && <p className="text-[10px] text-muted-foreground">{txn.fromInfo}</p>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {txn.amount ? (
                          <span className={`font-mono text-sm font-semibold ${isReceive ? "text-green-400" : "text-red-400"}`}>
                            {txn.amount}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                        {txn.fee && <p className="text-[10px] text-muted-foreground mt-0.5">Fee: {txn.fee}</p>}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(txn.status)}
                      </td>
                    </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
}
