import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";

import QuoteScreen from "../screens/QuoteScreen";
import { buildQuoteViewModel } from "../presentation/quotePresentation";

import { useTranslation } from "../i18n/useTranslation";
import { getOrderById } from "../services/orderService";
import {
  acceptQuote,
  getOrderQuote,
  rejectQuote,
} from "../services/quoteService";

import { colors, radius, spacing, typography } from "../constants/theme";

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

      const { error } = await acceptQuote(quote.id);

      if (error) {
        Alert.alert("Error", "No se pudo aceptar la cotización.");
        console.error("ERROR ACCEPT:", error);
        return;
      }

      Alert.alert(
        "Cotización aceptada",
        "Tu pedido fue aceptado correctamente.",
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
        Alert.alert("Error", "No se pudo rechazar la cotización.");
        console.error(error);
        return;
      }

      Alert.alert("Cotización rechazada", "Rechazaste esta cotización.");

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
        <Text style={styles.emptyText}>{t("orderDetail.notFound")}</Text>
      </View>
    );
  }

  const canDecideQuote = String(quote?.status).toUpperCase() === "PENDING";

  if (quote) {
    const quoteViewModel = buildQuoteViewModel({
      order,
      quote,
      language: "es",
    });

    const normalizedQuoteViewModel = {
      ...quoteViewModel,
      actions: {
        ...quoteViewModel.actions,
        canRespond: canDecideQuote,
      },
    };

    return (
      <QuoteScreen
        quote={normalizedQuoteViewModel}
        onAccept={handleAcceptQuote}
        onReject={handleRejectQuote}
        isSubmitting={actionLoading}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.waitingBox}>
        <Ionicons name="time-outline" size={38} color={colors.primary} />

        <Text style={styles.waitingTitle}>{t("orderDetail.waitingTitle")}</Text>

        <Text style={styles.waitingText}>{t("orderDetail.waitingQuote")}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>{t("orderDetail.backHome")}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },

  waitingBox: {
    alignItems: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceSoft,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },

  waitingTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: spacing.md,
    textAlign: "center",
  },

  waitingText: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: "center",
  },

  button: {
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    ...typography.button,
    color: colors.textInverse,
  },
});
