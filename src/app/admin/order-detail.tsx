import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { getAdminOrderById } from "../../services/adminService";
import { createQuoteForOrder } from "../../services/quoteService";

export default function AdminOrderDetailScreen() {
  const params = useLocalSearchParams();

  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [subtotal, setSubtotal] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [notes, setNotes] = useState("");

  const subtotalNumber = Number(subtotal) || 0;
  const deliveryFeeNumber = Number(deliveryFee) || 0;
  const total = subtotalNumber + deliveryFeeNumber;

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
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 20 }}>
        Order Detail
      </Text>

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
