import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  Platform,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import Colors from "@/constants/colors";
import { FractalCanvas } from "@/components/FractalCanvas";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;
const colors = Colors.light;

interface MiningBlock {
  id: number;
  blockNum: number;
  hash: string;
  btcReward: number;
  ethReward: number;
  gasFee: number;
  powerSnapshot: number;
  wSliceSnapshot: number;
  minedAt: string;
}

interface MiningWallet {
  totalBtc: number;
  totalEth: number;
  totalGas: number;
  blocksMined: number;
  lastMinedAt: string | null;
  destinationWallet1?: string;
  destinationWallet2?: string;
}

interface MineResult {
  block: MiningBlock;
  wallet: MiningWallet;
  fractal: { power: number; maxIter: number; wSlice: number };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function CopyableAddress({ label, address }: { label: string; address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (Platform.OS === "web") {
        try {
          await navigator.clipboard.writeText(address);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
      }
    }
  };

  return (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressLabel}>{label}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
          <Feather
            name={copied ? "check" : "copy"}
            size={14}
            color={copied ? colors.success : colors.textSecondary}
          />
          <Text style={[styles.copyBtnText, { color: copied ? colors.success : colors.textSecondary }]}>
            {copied ? "Copied" : "Copy"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.addressText} selectable>{address}</Text>
    </View>
  );
}

export default function MiningScreen() {
  const [autoMine, setAutoMine] = useState(true);
  const [recentBlocks, setRecentBlocks] = useState<MiningBlock[]>([]);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const queryClient = useQueryClient();

  const { data: wallet } = useQuery<MiningWallet>({
    queryKey: ["mining-wallet"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/mining/wallet`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const { data: blocks } = useQuery<MiningBlock[]>({
    queryKey: ["mining-blocks"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/mining/blocks`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (blocks) setRecentBlocks(blocks.slice(0, 20));
  }, [blocks]);

  const mineMutation = useMutation<MineResult>({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/api/mining/mine`, { method: "POST" });
      if (!res.ok) throw new Error("Mining failed");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mining-wallet"] });
      setRecentBlocks((prev) => [data.block, ...prev].slice(0, 20));

      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start();
    },
  });

  useEffect(() => {
    if (!autoMine) return;
    const interval = setInterval(() => {
      if (!mineMutation.isPending) {
        mineMutation.mutate();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [autoMine, mineMutation.isPending]);

  const blocksMined = wallet?.blocksMined ?? 0;
  const destWallet1 = wallet?.destinationWallet1 ?? "Loading...";
  const destWallet2 = wallet?.destinationWallet2 ?? "Loading...";
  const flashBg = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(249,115,22,0)", "rgba(249,115,22,0.15)"],
  });

  const renderBlock = useCallback(
    ({ item }: { item: MiningBlock }) => (
      <View style={styles.blockRow}>
        <View style={styles.blockLeft}>
          <Text style={styles.blockNum}>#{item.blockNum}</Text>
          <Text style={styles.blockHash}>{item.hash.slice(0, 14)}...</Text>
        </View>
        <View style={styles.blockRight}>
          <Text style={styles.blockReward}>+{item.btcReward.toFixed(8)} BTC</Text>
          <Text style={styles.blockEthReward}>+{(item.ethReward ?? 0).toFixed(6)} ETH</Text>
          <Text style={styles.blockTime}>-{item.gasFee.toFixed(6)} gas | {timeAgo(item.minedAt)}</Text>
        </View>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Animated.View style={[styles.inner, { backgroundColor: flashBg }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Fractal Mining</Text>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: autoMine ? colors.success : colors.textSecondary },
                ]}
              />
              <Text style={styles.statusText}>
                {autoMine ? "Mining Active" : "Paused"}
              </Text>
            </View>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceLabel}>BTC Balance</Text>
                <Text style={styles.balanceValue}>
                  {(wallet?.totalBtc ?? 0).toFixed(8)}
                </Text>
              </View>
              <View style={styles.balanceDivider} />
              <View>
                <Text style={styles.balanceLabel}>ETH Balance</Text>
                <Text style={[styles.balanceValue, { color: "#60a5fa" }]}>
                  {(wallet?.totalEth ?? 0).toFixed(6)}
                </Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Blocks</Text>
                <Text style={styles.statValue}>{blocksMined}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Gas Spent</Text>
                <Text style={[styles.statValue, { color: colors.purple }]}>
                  {(wallet?.totalGas ?? 0).toFixed(6)} ETH
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Status</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: autoMine ? colors.success : colors.textSecondary },
                  ]}
                >
                  {autoMine ? "Active" : "Idle"}
                </Text>
              </View>
            </View>
          </View>

          <FractalCanvas blocksMined={blocksMined} autoMine={autoMine} />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.mineButton,
                !!(mineMutation.isPending || autoMine) && styles.mineButtonDisabled,
              ]}
              onPress={() => mineMutation.mutate()}
              disabled={mineMutation.isPending || autoMine}
            >
              <Feather name="cpu" size={16} color="#fff" />
              <Text style={styles.mineButtonText}>
                {mineMutation.isPending ? "Mining..." : "Mine Block"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                autoMine ? styles.toggleStop : styles.toggleStart,
              ]}
              onPress={() => setAutoMine((v) => !v)}
            >
              <Feather
                name={autoMine ? "square" : "play"}
                size={16}
                color={autoMine ? colors.danger : colors.success}
              />
              <Text
                style={[
                  styles.toggleText,
                  { color: autoMine ? colors.danger : colors.success },
                ]}
              >
                {autoMine ? "Stop" : "Start"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.destSection}>
            <View style={styles.destHeader}>
              <Feather name="send" size={14} color={colors.accent} />
              <Text style={styles.sectionTitle}>BNB Destination Wallets</Text>
            </View>
            <CopyableAddress label="Account 1" address={destWallet1} />
            <CopyableAddress label="Account 2" address={destWallet2} />
          </View>

          <View style={styles.blockFeedHeader}>
            <Text style={styles.sectionTitle}>Recent Blocks</Text>
            <Text style={styles.blockCount}>{recentBlocks.length} blocks</Text>
          </View>

          {recentBlocks.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={32} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No blocks mined yet</Text>
            </View>
          ) : (
            <FlatList
              data={recentBlocks}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderBlock}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              style={styles.blockList}
            />
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    fontFamily: "Inter_700Bold",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  balanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Inter_500Medium",
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.orange,
    fontVariant: ["tabular-nums"],
    fontFamily: "Inter_700Bold",
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Inter_500Medium",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    fontFamily: "Inter_700Bold",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  mineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.orange,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  mineButtonDisabled: {
    opacity: 0.5,
  },
  mineButtonText: {
    color: "#fff",
    fontWeight: "700" as const,
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  toggleStop: {
    borderColor: colors.danger,
    backgroundColor: "rgba(239,68,68,0.1)",
  },
  toggleStart: {
    borderColor: colors.success,
    backgroundColor: "rgba(16,185,129,0.1)",
  },
  toggleText: {
    fontWeight: "700" as const,
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  blockFeedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Inter_700Bold",
  },
  blockCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  blockList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  blockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  blockLeft: {},
  blockNum: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.text,
    fontVariant: ["tabular-nums"],
    fontFamily: "Inter_700Bold",
  },
  blockHash: {
    fontSize: 11,
    color: colors.textSecondary,
    fontVariant: ["tabular-nums"],
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
  blockRight: {
    alignItems: "flex-end" as const,
  },
  blockReward: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.orange,
    fontVariant: ["tabular-nums"],
    fontFamily: "Inter_600SemiBold",
  },
  blockEthReward: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#60a5fa",
    fontVariant: ["tabular-nums"],
    fontFamily: "Inter_600SemiBold",
    marginTop: 1,
  },
  blockTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    fontFamily: "Inter_400Regular",
  },
  destSection: {
    marginBottom: 20,
  },
  destHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.accent,
    fontFamily: "Inter_700Bold",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontVariant: ["tabular-nums"],
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
});
