import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { getAdminOrderById } from "../../services/adminService";
import { getDeliveryByOrderId } from "../../services/deliveryService";
import { createQuoteForOrder } from "../../services/quoteService";

export default function AdminOrderDetailScreen() {
  const params = useLocalSearchParams();

  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  const [order, setOrder] = useState<any>(null);

  const [deliveryId, setDeliveryId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [subtotal, setSubtotal] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [notes, setNotes] = useState("");

  const subtotalNumber = Number(subtotal) || 0;
  const deliveryFeeNumber = Number(deliveryFee) || 0;
  const total = subtotalNumber + deliveryFeeNumber;

  function handleBackToAdminOrders() {
    router.push("/admin/orders" as never);
  }

  function handleOpenDeliveryConsole() {
    if (!deliveryId) {
      Alert.alert(
        "Entrega no disponible",
        "Este pedido todavía no tiene una entrega creada.",
      );

      return;
    }

    router.push(`/internal/delivery-console/${deliveryId}` as never);
  }

  async function loadOrder() {
    if (!orderId) {
      Alert.alert("Error", "No llegó el ID del pedido.");
      setLoading(false);
      return;
    }

    const { data, error } = await getAdminOrderById(String(orderId));

    if (error) {
      console.log("ADMIN ORDER DETAIL ERROR:", error);
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }

    setOrder(data);

    const { data: deliveryData, error: deliveryError } =
      await getDeliveryByOrderId(String(orderId));

    if (deliveryError) {
      console.error("ADMIN DELIVERY LOAD ERROR:", deliveryError);

      setDeliveryId(null);
    } else {
      setDeliveryId(deliveryData?.id ?? null);
    }

    setLoading(false);
  }

  async function handleCreateQuote() {
    if (!orderId) {
      Alert.alert("Error", "No llegó el ID del pedido.");
      return;
    }

    if (!subtotal || !deliveryFee) {
      Alert.alert("Campos requeridos", "Ingrese subtotal y costo de entrega.");
      return;
    }

    setSaving(true);

    const { data, error } = await createQuoteForOrder({
      orderId: String(orderId),
      subtotal: subtotalNumber,
      deliveryFee: deliveryFeeNumber,
      notes,
    });

    setSaving(false);

    if (error) {
      console.log("CREATE QUOTE ERROR:", error);
      Alert.alert("Error", error.message);
      return;
    }

    if (data) {
      Alert.alert("Cotización creada", "El pedido fue actualizado a QUOTED.");
      setSubtotal("");
      setDeliveryFee("");
      setNotes("");
      setLoading(true);
      await loadOrder();
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text>Loading order detail...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, padding: 24, paddingTop: 80 }}>
        <Pressable
          onPress={handleBackToAdminOrders}
          style={{
            alignSelf: "flex-start",
            backgroundColor: "#E0F2F1",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 12,
            marginBottom: 24,
          }}
        >
          <Text style={{ color: "#0F766E", fontWeight: "900" }}>
            ← Back to Admin Orders
          </Text>
        </Pressable>

        <Text style={{ fontSize: 24, fontWeight: "800" }}>
          No se encontró el pedido.
        </Text>
        <Text style={{ marginTop: 12 }}>
          Order ID recibido: {String(orderId)}
        </Text>
      </View>
    );
  }

  const existingQuote = order.quotes?.[0];

  return (
    <ScrollView style={{ flex: 1, padding: 24, paddingTop: 80 }}>
      <Pressable
        onPress={handleBackToAdminOrders}
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#E0F2F1",
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <Text style={{ color: "#0F766E", fontWeight: "900" }}>
          ← Back to Admin Orders
        </Text>
      </Pressable>

      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 20 }}>
        Order Detail
      </Text>

      {deliveryId ? (
        <Pressable
          onPress={handleOpenDeliveryConsole}
          style={{
            minHeight: 56,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 18,
            borderRadius: 16,
            backgroundColor: "#2DD4BF",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            Abrir Delivery Console
          </Text>
        </Pressable>
      ) : (
        <View
          style={{
            padding: 16,
            borderRadius: 14,
            backgroundColor: "#FEF3C7",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#92400E",
              fontWeight: "700",
            }}
          >
            Este pedido todavía no tiene una entrega creada.
          </Text>
        </View>
      )}

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Pedido</Text>
        <Text style={{ marginTop: 8 }}>ID: {order.id}</Text>
        <Text>Descripción: {order.description}</Text>
        <Text>Estado: {order.status}</Text>
        <Text>Fecha: {order.created_at}</Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Cliente</Text>
        <Text style={{ marginTop: 8 }}>
          Nombre: {order.profiles?.full_name ?? "Sin nombre"}
        </Text>
        <Text>Teléfono: {order.profiles?.phone ?? "Sin teléfono"}</Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Dirección</Text>
        <Text style={{ marginTop: 8 }}>
          Label: {order.addresses?.label ?? "Sin label"}
        </Text>
        <Text>
          Dirección: {order.addresses?.address_line ?? "Sin dirección"}
        </Text>
        <Text>
          Referencia: {order.addresses?.reference ?? "Sin referencia"}
        </Text>
      </View>

      {existingQuote ? (
        <View
          style={{
            padding: 16,
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 12,
            marginBottom: 40,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800" }}>
            Cotización Existente
          </Text>
          <Text style={{ marginTop: 8 }}>
            Subtotal: ₡{existingQuote.subtotal}
          </Text>
          <Text>Entrega: ₡{existingQuote.delivery_fee}</Text>
          <Text>Total: ₡{existingQuote.total}</Text>
          <Text>Estado: {existingQuote.status}</Text>
          <Text>Notas: {existingQuote.notes ?? "Sin notas"}</Text>
        </View>
      ) : (
        <View style={{ marginBottom: 40 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 12 }}>
            Crear Cotización
          </Text>

          <Text>Subtotal</Text>
          <TextInput
            value={subtotal}
            onChangeText={setSubtotal}
            keyboardType="numeric"
            placeholder="Ej: 8500"
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 10,
              padding: 12,
              marginTop: 6,
              marginBottom: 12,
            }}
          />

          <Text>Costo de Entrega</Text>
          <TextInput
            value={deliveryFee}
            onChangeText={setDeliveryFee}
            keyboardType="numeric"
            placeholder="Ej: 2000"
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 10,
              padding: 12,
              marginTop: 6,
              marginBottom: 12,
            }}
          />

          <Text>Notas</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Ej: Incluye compra y entrega"
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 10,
              padding: 12,
              marginTop: 6,
              marginBottom: 16,
              minHeight: 80,
            }}
          />

          <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 16 }}>
            Total: ₡{total}
          </Text>

          <Button
            title={saving ? "Guardando..." : "Crear Cotización"}
            onPress={handleCreateQuote}
            disabled={saving}
          />
        </View>
      )}
    </ScrollView>
  );
}
