import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { getAllOrders } from "../../services/adminService";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadOrders() {
    const { data, error } = await getAllOrders();

    if (error) {
      console.log("ADMIN ORDERS ERROR:", error);
      setErrorMessage(error.message);
    }

    if (data) {
      setOrders(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text>Loading admin orders...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={{ flex: 1, padding: 24, paddingTop: 80 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>Admin Orders</Text>
        <Text style={{ marginTop: 20, color: "red" }}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 80 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 20 }}>
        Admin Orders
      </Text>

      {orders.length === 0 ? (
        <Text>No hay pedidos todavía.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontWeight: "800" }}>{item.description}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Cliente: {item.profiles?.full_name ?? "Sin nombre"}</Text>
              <Text>Teléfono: {item.profiles?.phone ?? "Sin teléfono"}</Text>
              <Text>
                Dirección: {item.addresses?.address_line ?? "Sin dirección"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
