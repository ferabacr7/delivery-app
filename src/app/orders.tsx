import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import AppHeader from "../components/ui/AppHeader";
import BottomNavigation from "../components/ui/BottomNavigation";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../constants/theme";
import { useTranslation } from "../i18n/useTranslation";
import { supabase } from "../lib/supabase";
import { getMyOrders } from "../services/orderService";

type OrderStatus =
  | "VALIDATION"
  | "QUOTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "ON_ROUTE"
  | "DELIVERED"
  | "REJECTED"
  | "CANCELLED";

type OrderRecord = {
  id: string;
  description: string;
  status: OrderStatus | string;
  created_at: string;
};

type StatusStyle = {
  container: ViewStyle;
  text: TextStyle;
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  const loadOrders = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const { data, error } = await getMyOrders();

      if (error) {
        console.error("MY ORDERS LOAD ERROR:", error);
        return;
      }

      console.log(
        "MY ORDERS DATABASE STATUSES:",
        (data ?? []).map((order) => ({
          id: order.id,
          status: order.status,
        })),
      );

      setOrders((data ?? []) as OrderRecord[]);
    } catch (error) {
      console.error("MY ORDERS UNEXPECTED ERROR:", error);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  /*
   * Recarga los pedidos cada vez que la pantalla
   * vuelve a obtener el foco.
   */
  useFocusEffect(
    useCallback(() => {
      void loadOrders(true);
    }, [loadOrders]),
  );

  useEffect(() => {
    const channelName = `my-orders-status-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    const channel = supabase
      .channel(channelName)

      /*
       * Cambios comerciales de la orden:
       * VALIDATION, QUOTED, ACCEPTED, etc.
       */
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const newOrder = payload.new as {
            id?: string;
            status?: string;
          };

          const oldOrder = payload.old as {
            id?: string;
            status?: string;
          };

          console.log("MY ORDERS REALTIME ORDER:", {
            eventType: payload.eventType,
            orderId: newOrder.id ?? oldOrder.id,
            oldStatus: oldOrder.status,
            newStatus: newOrder.status,
          });

          void loadOrders(false);
        },
      )

      /*
       * Cambios operativos de la entrega:
       * PENDING, IN_PROGRESS, ON_ROUTE, DELIVERED.
       */
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deliveries",
        },
        (payload) => {
          const newDelivery = payload.new as {
            id?: string;
            order_id?: string;
            status?: string;
          };

          const oldDelivery = payload.old as {
            id?: string;
            order_id?: string;
            status?: string;
          };

          console.log("MY ORDERS REALTIME DELIVERY:", {
            eventType: payload.eventType,
            deliveryId: newDelivery.id ?? oldDelivery.id,
            orderId: newDelivery.order_id ?? oldDelivery.order_id,
            oldStatus: oldDelivery.status,
            newStatus: newDelivery.status,
          });

          void loadOrders(false);
        },
      )
      .subscribe((status) => {
        console.log("MY ORDERS REALTIME STATUS:", status);
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadOrders]);

  function normalizeStatus(status?: string): OrderStatus {
    const normalizedStatus = status?.trim().toUpperCase();

    switch (normalizedStatus) {
      case "VALIDATION":
      case "QUOTED":
      case "ACCEPTED":
      case "IN_PROGRESS":
      case "ON_ROUTE":
      case "DELIVERED":
      case "REJECTED":
      case "CANCELLED":
        return normalizedStatus;

      /*
       * Compatibilidad temporal con datos antiguos.
       */
      case "PENDING":
        return "VALIDATION";

      case "EN_ROUTE":
        return "ON_ROUTE";

      case "CANCELED":
        return "CANCELLED";

      default:
        return "VALIDATION";
    }
  }

  function getStatusLabel(status?: string) {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "VALIDATION":
        return t("orderStatus.validation");

      case "QUOTED":
        return t("orderStatus.quoted");

      case "ACCEPTED":
        return t("orderStatus.accepted");

      case "IN_PROGRESS":
        return t("orderStatus.inProgress");

      case "ON_ROUTE":
        return t("orderStatus.onRoute");

      case "DELIVERED":
        return t("orderStatus.delivered");

      case "REJECTED":
        return t("orderStatus.rejected");

      case "CANCELLED":
        return t("orderStatus.cancelled");

      default:
        return t("orderStatus.validation");
    }
  }

  function getStatusStyle(status?: string): StatusStyle {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "VALIDATION":
        return {
          container: styles.statusValidation,
          text: styles.statusValidationText,
        };

      case "QUOTED":
        return {
          container: styles.statusQuoted,
          text: styles.statusQuotedText,
        };

      case "ACCEPTED":
        return {
          container: styles.statusAccepted,
          text: styles.statusAcceptedText,
        };

      case "IN_PROGRESS":
        return {
          container: styles.statusInProgress,
          text: styles.statusInProgressText,
        };

      case "ON_ROUTE":
        return {
          container: styles.statusOnRoute,
          text: styles.statusOnRouteText,
        };

      case "DELIVERED":
        return {
          container: styles.statusDelivered,
          text: styles.statusDeliveredText,
        };

      case "REJECTED":
        return {
          container: styles.statusRejected,
          text: styles.statusRejectedText,
        };

      case "CANCELLED":
        return {
          container: styles.statusCancelled,
          text: styles.statusCancelledText,
        };

      default:
        return {
          container: styles.statusValidation,
          text: styles.statusValidationText,
        };
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand} />

          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>

        <BottomNavigation active="orders" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AppHeader
          title={t("orders.title")}
          showBackButton
          backLabel={t("common.back")}
          onBack={() => router.replace("/" as never)}
        />

        <View style={styles.content}>
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t("orders.empty")}</Text>

              <Pressable
                style={styles.emptyButton}
                onPress={() => router.push("/create-order" as never)}
              >
                <Text style={styles.emptyButtonText}>
                  {t("orders.firstOrder")}
                </Text>
              </Pressable>
            </View>
          ) : (
            orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);

              return (
                <Pressable
                  key={order.id}
                  style={styles.card}
                  onPress={() =>
                    router.push({
                      pathname: "/order-detail",
                      params: {
                        orderId: order.id,
                      },
                    } as never)
                  }
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.orderId}>
                      {t("orders.order")} #{order.id.slice(-6).toUpperCase()}
                    </Text>

                    <View style={[styles.statusBadge, statusStyle.container]}>
                      <Text
                        style={[styles.statusText, statusStyle.text]}
                        numberOfLines={1}
                      >
                        {getStatusLabel(order.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.description} numberOfLines={3}>
                    {order.description}
                  </Text>

                  <Text style={styles.time}>
                    {new Date(order.created_at).toLocaleString()}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      <BottomNavigation active="orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 140,
  },

  content: {
    flexGrow: 1,
    marginTop: -24,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
    backgroundColor: colors.background,
  },

  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textMuted,
  },

  emptyState: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },

  emptyText: {
    ...typography.body,
    marginBottom: spacing.md,
    color: colors.textMuted,
  },

  emptyButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
  },

  emptyButtonText: {
    ...typography.button,
    textAlign: "center",
    color: colors.textInverse,
  },

  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  orderId: {
    ...typography.body,
    flex: 1,
    fontWeight: "700",
    color: colors.text,
  },

  description: {
    ...typography.body,
    marginTop: spacing.sm,
    fontWeight: "600",
    color: colors.text,
  },

  time: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.textMuted,
  },

  statusBadge: {
    maxWidth: 135,
    minHeight: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },

  statusValidation: {
    backgroundColor: "#FEF3C7",
  },

  statusValidationText: {
    color: "#92400E",
  },

  statusQuoted: {
    backgroundColor: "#EDE9FE",
  },

  statusQuotedText: {
    color: "#6D28D9",
  },

  statusAccepted: {
    backgroundColor: "#DCFCE7",
  },

  statusAcceptedText: {
    color: "#166534",
  },

  statusInProgress: {
    backgroundColor: "#FFEDD5",
  },

  statusInProgressText: {
    color: "#C2410C",
  },

  statusOnRoute: {
    backgroundColor: "#DBEAFE",
  },

  statusOnRouteText: {
    color: "#1D4ED8",
  },

  statusDelivered: {
    backgroundColor: colors.brandSoft,
  },

  statusDeliveredText: {
    color: colors.brandDark,
  },

  statusRejected: {
    backgroundColor: "#FEE2E2",
  },

  statusRejectedText: {
    color: "#B91C1C",
  },

  statusCancelled: {
    backgroundColor: "#F3F4F6",
  },

  statusCancelledText: {
    color: "#4B5563",
  },
});
