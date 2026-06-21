import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { orders } from "../data/orders";
import { colors } from "../styles/theme";

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Pedidos</Text>

      {orders.map((order) => (
        <Pressable
          key={order.id}
          style={styles.card}
          onPress={() => router.push("/order-detail")}
        >
          <View>
            <Text style={styles.orderId}>Pedido #{order.id}</Text>
            <Text style={styles.description}>{order.description}</Text>
            <Text style={styles.time}>{order.time}</Text>
          </View>

          <View style={styles.right}>
            <Text style={styles.status}>{order.status}</Text>
            <Text style={styles.total}>{order.total}</Text>
          </View>
        </Pressable>
      ))}
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
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.dark,
    marginBottom: 28,
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
  orderId: { fontSize: 18, fontWeight: "900", color: colors.primary },
  description: { marginTop: 8, color: colors.dark, fontWeight: "700" },
  time: { marginTop: 6, color: colors.muted },
  right: { alignItems: "flex-end" },
  status: {
    backgroundColor: colors.softTeal,
    color: colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    fontWeight: "800",
    fontSize: 12,
  },
  total: { marginTop: 18, fontWeight: "900", color: colors.dark },
});
