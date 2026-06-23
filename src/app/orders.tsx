import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { getMyOrders } from "../services/orderService";
import { colors } from "../styles/theme";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const { data, error } = await getMyOrders();

      if (error) {
        console.error(error);
        return;
      }

      setOrders(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getStatusLabel(status: string) {
    if (status === "accepted") return t("orders.accepted");
    if (status === "rejected") return t("orders.rejected");
    if (status === "pending") return t("orders.pending");

    return status;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("orders.title")}</Text>

      {orders.length === 0 ? (
        <Text style={styles.emptyText}>{t("orders.empty")}</Text>
      ) : (
        orders.map((order) => (
          <Pressable
            key={order.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/order-detail",
                params: { orderId: order.id },
              })
            }
          >
            <View>
              <Text style={styles.orderId}>
                {t("orders.order")} #{order.id.slice(0, 8)}
              </Text>

              <Text style={styles.description}>{order.description}</Text>

              <Text style={styles.time}>
                {new Date(order.created_at).toLocaleString()}
              </Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.status}>{getStatusLabel(order.status)}</Text>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.dark,
    marginBottom: 28,
  },

  emptyText: {
    color: colors.muted,
    fontSize: 16,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
  },

  orderId: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },

  description: {
    marginTop: 8,
    color: colors.dark,
    fontWeight: "700",
  },

  time: {
    marginTop: 6,
    color: colors.muted,
  },

  right: {
    alignItems: "flex-end",
  },

  status: {
    backgroundColor: colors.softTeal,
    color: colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    fontWeight: "800",
    fontSize: 12,
  },
});
