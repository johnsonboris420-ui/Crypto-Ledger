import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import Colors from "@/constants/colors";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;
const colors = Colors.light;

interface MiningWallet {
  totalBtc: number;
  totalEth: number;
  totalGas: number;
  blocksMined: number;
  lastMinedAt: string | null;
  destinationWallet1?: string;
  destinationWallet2?: string;
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
        <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
          <Feather
            name={copied ? "check" : "copy"}
            size={14}
            color={copied ? colors.success : colors.textSecondary}
          />
          <Text
            style={[
              styles.copyText,
              { color: copied ? colors.success : colors.textSecondary },
            ]}
          >
            {copied ? "Copied" : "Copy"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.addressText} selectable>{address}</Text>
    </View>
  );
}

export default function WalletScreen() {
  const { data: wallet } = useQuery<MiningWallet>({
    queryKey: ["mining-wallet"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/mining/wallet`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const destWallet1 = wallet?.destinationWallet1 ?? "Loading...";
  const destWallet2 = wallet?.destinationWallet2 ?? "Loading...";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Wallet</Text>

        <View style={styles.mainBalanceCard}>
          <View style={styles.mainBalanceIconRow}>
            <View style={styles.btcIcon}>
              <Feather name="dollar-sign" size={16} color={colors.orange} />
            </View>
            <Text style={styles.mainBalanceLabel}>Total BTC Mined</Text>
          </View>
          <Text style={styles.mainBalanceValue}>
            {(wallet?.totalBtc ?? 0).toFixed(8)}
          </Text>
          <Text style={styles.mainBalanceSub}>
            {"\u2248"} ${((wallet?.totalBtc ?? 0) * 65000).toFixed(2)} USD
          </Text>
        </View>

        <View style={styles.balanceGrid}>
          <View style={styles.balanceGridItem}>
            <Text style={styles.gridLabel}>ETH Balance</Text>
            <Text style={[styles.gridValue, { color: "#60a5fa" }]}>
              {(wallet?.totalEth ?? 0).toFixed(6)}
            </Text>
          </View>
          <View style={styles.balanceGridItem}>
            <Text style={styles.gridLabel}>Gas Spent (ETH)</Text>
            <Text style={[styles.gridValue, { color: colors.purple }]}>
              {(wallet?.totalGas ?? 0).toFixed(6)}
            </Text>
          </View>
          <View style={styles.balanceGridItem}>
            <Text style={styles.gridLabel}>Blocks Mined</Text>
            <Text style={styles.gridValue}>{wallet?.blocksMined ?? 0}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="send" size={16} color={colors.accent} />
            <Text style={styles.sectionTitle}>BNB Destination Wallets</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Mining rewards are sent to your BNB Chain addresses:
          </Text>

          <CopyableAddress label="Account 1" address={destWallet1} />
          <CopyableAddress label="Account 2" address={destWallet2} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>Mining Info</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Network</Text>
              <Text style={styles.infoValue}>BNB Smart Chain</Text>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mining Type</Text>
              <Text style={styles.infoValue}>Simulated PoW</Text>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Mined</Text>
              <Text style={styles.infoValue}>
                {wallet?.lastMinedAt
                  ? new Date(wallet.lastMinedAt).toLocaleTimeString()
                  : "Never"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 16,
    fontFamily: "Inter_700Bold",
  },
  mainBalanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  mainBalanceIconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  btcIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(249,115,22,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  mainBalanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  mainBalanceValue: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: colors.orange,
    fontVariant: ["tabular-nums"],
    marginBottom: 4,
    fontFamily: "Inter_700Bold",
  },
  mainBalanceSub: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  balanceGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  balanceGridItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: "Inter_500Medium",
  },
  gridValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
    fontVariant: ["tabular-nums"],
    fontFamily: "Inter_700Bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Inter_700Bold",
  },
  sectionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
    fontFamily: "Inter_400Regular",
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
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  copyText: {
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
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  infoSeparator: {
    height: 1,
    backgroundColor: colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.text,
    fontFamily: "Inter_600SemiBold",
  },
});
