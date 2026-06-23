import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { getOrderById } from "../services/orderService";
import {
  acceptQuote,
  getOrderQuote,
  rejectQuote,
} from "../services/quoteService";
import { colors } from "../styles/theme";

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [order, setOrder] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId]);

  function getOrderStatusLabel(status: string) {
    if (status === "accepted") return t("orderDetail.accepted");
    if (status === "rejected") return t("orderDetail.rejected");
    if (status === "pending") return t("orderDetail.pending");
    return status;
  }

  function getSubtitle(status: string) {
    if (status === "accepted") return t("orderDetail.acceptedMessage");
    if (status === "rejected") return t("orderDetail.rejectedMessage");
    return t("orderDetail.processingMessage");
  }

  async function loadOrderDetail() {
    try {
      setLoading(true);

      const { data: orderData, error: orderError } =
        await getOrderById(orderId);

      if (orderError) {
        console.error(orderError);
        return;
      }

      setOrder(orderData);

      const { data: quoteData, error: quoteError } =
        await getOrderQuote(orderId);

      if (quoteError) {
        console.log("Este pedido todavía no tiene cotización.");
        setQuote(null);
        return;
      }

      setQuote(quoteData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptQuote() {
    if (!quote) return;

    try {
      setActionLoading(true);

      const { data, error } = await acceptQuote(quote.id);

      console.log("RESULTADO ACCEPT:", { data, error });

      if (error) {
        Alert.alert(t("common.error"), JSON.stringify(error));
        console.error("ERROR ACCEPT:", error);
        return;
      }

      Alert.alert(
        t("orderDetail.quoteAcceptedTitle"),
        t("orderDetail.acceptedMessage"),
      );

      await loadOrderDetail();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRejectQuote() {
    if (!quote) return;

    try {
      setActionLoading(true);

      const { error } = await rejectQuote(quote.id);

      if (error) {
        Alert.alert(t("common.error"), t("orderDetail.rejectError"));
        console.error(error);
        return;
      }

      Alert.alert(
        t("orderDetail.quoteRejectedTitle"),
        t("orderDetail.rejectedMessage"),
      );

      await loadOrderDetail();
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t("orderDetail.notFound")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={colors.white} />
        </Pressable>

        <Text style={styles.title}>
          {t("orders.order")} #{order.id.slice(0, 8)}
        </Text>

        <Text style={styles.subtitle}>{getSubtitle(order.status)}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.label}>{t("orderDetail.currentStatus")}</Text>
        <Text style={styles.status}>{getOrderStatusLabel(order.status)}</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t("orderDetail.description")}</Text>
          <Text style={styles.cardValue}>{order.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t("orderDetail.createdAt")}</Text>
          <Text style={styles.cardValue}>
            {new Date(order.created_at).toLocaleString()}
          </Text>
        </View>

        {quote ? (
          <View style={styles.quoteBox}>
            <Text style={styles.quoteTitle}>
              {t("orderDetail.quoteReceived")}
            </Text>

            <Text style={styles.quoteAmount}>
              ₡{Number(quote.amount).toLocaleString()}
            </Text>

            <Text style={styles.quoteNotes}>{quote.notes}</Text>

            <Text style={styles.quoteStatus}>
              {t("orderDetail.quoteStatus")}: {quote.status}
            </Text>

            {quote.status === "pending" && (
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={handleRejectQuote}
                  disabled={actionLoading}
                >
                  <Text style={styles.rejectText}>
                    {t("orderDetail.reject")}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={handleAcceptQuote}
                  disabled={actionLoading}
                >
                  <Text style={styles.acceptText}>
                    {t("orderDetail.accept")}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.waitingBox}>
            <Ionicons name="time-outline" size={38} color={colors.primary} />
            <Text style={styles.waitingTitle}>
              {t("orderDetail.waitingTitle")}
            </Text>
            <Text style={styles.waitingText}>
              {t("orderDetail.waitingQuote")}
            </Text>
          </View>
        )}

        <Pressable style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>{t("orderDetail.backHome")}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  hero: {
    backgroundColor: colors.primary,
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 52,
  },

  title: {
    marginTop: 28,
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.white,
  },

  panel: {
    marginTop: -28,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },

  label: {
    color: colors.muted,
    fontWeight: "800",
  },

  status: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 30,
    fontWeight: "900",
    color: colors.dark,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
  },

  cardLabel: {
    color: colors.muted,
    fontWeight: "700",
  },

  cardValue: {
    marginTop: 6,
    color: colors.dark,
    fontSize: 16,
    fontWeight: "800",
  },

  quoteBox: {
    marginTop: 10,
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.softTeal,
    marginBottom: 16,
  },

  quoteTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryDark,
  },

  quoteAmount: {
    marginTop: 12,
    fontSize: 36,
    fontWeight: "900",
    color: colors.primary,
  },

  quoteNotes: {
    marginTop: 10,
    color: colors.dark,
    fontSize: 15,
    fontWeight: "600",
  },

  quoteStatus: {
    marginTop: 12,
    color: colors.muted,
    fontWeight: "800",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  rejectButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  acceptButton: {
    backgroundColor: colors.primary,
  },

  rejectText: {
    color: colors.dark,
    fontWeight: "900",
  },

  acceptText: {
    color: colors.white,
    fontWeight: "900",
  },

  waitingBox: {
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },

  waitingTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "900",
    color: colors.dark,
  },

  waitingText: {
    marginTop: 8,
    color: colors.muted,
    textAlign: "center",
  },

  button: {
    marginTop: 18,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
});
