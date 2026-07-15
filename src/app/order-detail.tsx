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

import { colors, radius, spacing, typography } from "../constants/theme";
import { useLanguage } from "../i18n/useLanguage";
import { useTranslation } from "../i18n/useTranslation";
import { buildQuoteViewModel } from "../presentation/quotePresentation";
import QuoteScreen from "../screens/QuoteScreen";
import { getDeliveryByOrderId } from "../services/deliveryService";
import { getOrderById } from "../services/orderService";
import {
  acceptQuote,
  getOrderQuote,
  rejectQuote,
} from "../services/quoteService";

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{
    orderId: string;
  }>();

  const [order, setOrder] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId]);

  async function loadOrderDetail() {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const {
        data: orderData,
        error: orderError,
      } = await getOrderById(orderId);

      if (orderError) {
        console.error("Error loading order:", orderError);

        setOrder(null);
        setQuote(null);
        setDeliveryId(null);

        return;
      }

      setOrder(orderData);

      const {
        data: quoteData,
        error: quoteError,
      } = await getOrderQuote(orderId);

      if (quoteError) {
        console.log(
          "This order does not have a quote yet:",
          quoteError,
        );

        setQuote(null);
      } else {
        setQuote(quoteData);
      }

      const {
        data: deliveryData,
        error: deliveryError,
      } = await getDeliveryByOrderId(orderId);

      if (deliveryError) {
        console.error(
          "Error loading delivery:",
          deliveryError,
        );

        setDeliveryId(null);
      } else {
        setDeliveryId(deliveryData?.id ?? null);
      }
    } catch (error) {
      console.error(
        "Unexpected error loading order detail:",
        error,
      );

      setOrder(null);
      setQuote(null);
      setDeliveryId(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptQuote() {
    if (!quote || actionLoading) {
      return;
    }

    try {
      setActionLoading(true);

      const { error } = await acceptQuote(quote.id);

      if (error) {
        console.error("Error accepting quote:", error);

        Alert.alert(
          t("common.error"),
          t("orderDetail.acceptError"),
        );

        return;
      }

      Alert.alert(
        t("orderDetail.quoteAcceptedTitle"),
        t("orderDetail.quoteAcceptedMessage"),
      );

      /*
       * Al aceptar la cotización se crea automáticamente
       * una fila en deliveries. Por eso recargamos el detalle
       * para obtener su id real.
       */
      await loadOrderDetail();
    } catch (error) {
      console.error(
        "Unexpected error accepting quote:",
        error,
      );

      Alert.alert(
        t("common.error"),
        t("orderDetail.acceptError"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRejectQuote() {
    if (!quote || actionLoading) {
      return;
    }

    try {
      setActionLoading(true);

      const { error } = await rejectQuote(quote.id);

      if (error) {
        console.error("Error rejecting quote:", error);

        Alert.alert(
          t("common.error"),
          t("orderDetail.rejectError"),
        );

        return;
      }

      Alert.alert(
        t("orderDetail.quoteRejectedTitle"),
        t("orderDetail.quoteRejectedMessage"),
      );

      await loadOrderDetail();
    } catch (error) {
      console.error(
        "Unexpected error rejecting quote:",
        error,
      );

      Alert.alert(
        t("common.error"),
        t("orderDetail.rejectError"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  function handleBackToOrders() {
    router.replace("/orders" as never);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.brand}
        />

        <Text style={styles.loadingText}>
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={42}
          color={colors.brand}
        />

        <Text style={styles.emptyText}>
          {t("orderDetail.notFound")}
        </Text>

        <Pressable
          style={styles.button}
          onPress={handleBackToOrders}
        >
          <Text style={styles.buttonText}>
            {t("orderDetail.backOrders")}
          </Text>
        </Pressable>
      </View>
    );
  }

  const canDecideQuote =
    String(quote?.status).toUpperCase() === "PENDING";

  if (quote) {
    const quoteViewModel = buildQuoteViewModel({
      order,
      quote,
      language,
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
        deliveryId={deliveryId}
        onAccept={handleAcceptQuote}
        onReject={handleRejectQuote}
        isSubmitting={actionLoading}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        style={styles.backButton}
        onPress={handleBackToOrders}
        hitSlop={10}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={colors.brand}
        />

        <Text style={styles.backButtonText}>
          {t("common.back")}
        </Text>
      </Pressable>

      <View style={styles.waitingBox}>
        <Ionicons
          name="time-outline"
          size={38}
          color={colors.brand}
        />

        <Text style={styles.waitingTitle}>
          {t("orderDetail.waitingTitle")}
        </Text>

        <Text style={styles.waitingText}>
          {t("orderDetail.waitingQuote")}
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={handleBackToOrders}
      >
        <Text style={styles.buttonText}>
          {t("orderDetail.backOrders")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.xxl,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },

  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textMuted,
  },

  emptyText: {
    ...typography.body,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    color: colors.textMuted,
    textAlign: "center",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },

  backButtonText: {
    ...typography.body,
    color: colors.brand,
    fontWeight: "800",
  },

  waitingBox: {
    alignItems: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceSoft,
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
    width: "100%",
    minHeight: 58,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    ...typography.button,
    color: colors.textInverse,
    textAlign: "center",
  },
});