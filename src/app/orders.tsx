import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
import { getMyOrders } from "../services/orderService";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, []),
  );

  async function loadOrders() {
    try {
      setLoading(true);

      const { data, error } = await getMyOrders();

      if (error) {
        console.error("Error loading orders:", error);
        return;
      }

      setOrders(data ?? []);
    } catch (error) {
      console.error("Unexpected error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusLabel(status: string) {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "accepted") {
      return t("orders.accepted");
    }

    if (normalizedStatus === "rejected") {
      return t("orders.rejected");
    }

    if (normalizedStatus === "pending") {
      return t("orders.pending");
    }

    return status;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand} />

          <Text style={styles.loadingText}>
            {t("common.loading")}
          </Text>
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
              <Text style={styles.emptyText}>
                {t("orders.empty")}
              </Text>

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
            orders.map((order) => (
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
                    {t("orders.order")} #
                    {order.id.slice(-6).toUpperCase()}
                  </Text>

                  <Text style={styles.status}>
                    {getStatusLabel(order.status)}
                  </Text>
                </View>

                <Text
                  style={styles.description}
                  numberOfLines={3}
                >
                  {order.description}
                </Text>

                <Text style={styles.time}>
                  {new Date(order.created_at).toLocaleString()}
                </Text>
              </Pressable>
            ))
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
    backgroundColor: colors.background,
    position: "relative",
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
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },

  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },

  emptyButton: {
    minHeight: 52,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyButtonText: {
    ...typography.button,
    color: colors.textInverse,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
    fontWeight: "600",
  },

  time: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.textMuted,
  },

  status: {
    backgroundColor: colors.brandSoft,
    color: colors.brandDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    fontWeight: "700",
    fontSize: 12,
    maxWidth: 120,
    textAlign: "center",
    overflow: "hidden",
  },
});