import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getActiveTrackingDeliveryId,
  isTrackingDelivery,
  startDriverLocationTracking,
  stopDriverLocationTracking,
} from "../../../services/driverLocationService";

import {
  completeDelivery,
  DELIVERY_STATUS,
  type DeliveryRow,
  getDeliveryById,
  startDelivery,
  startDeliveryRoute,
} from "../../../services/deliveryService";

export default function DeliveryConsoleScreen() {
  const params = useLocalSearchParams<{
    deliveryId?: string | string[];
  }>();

  const deliveryId = useMemo(() => {
    if (Array.isArray(params.deliveryId)) {
      return params.deliveryId[0]?.trim() ?? "";
    }

    return params.deliveryId?.trim() ?? "";
  }, [params.deliveryId]);

  const [delivery, setDelivery] = useState<DeliveryRow | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trackingActive, setTrackingActive] = useState(false);

  async function loadDelivery() {
    if (!deliveryId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await getDeliveryById(deliveryId);

      if (error) {
        throw error;
      }

      setDelivery(data);
      setTrackingActive(isTrackingDelivery(deliveryId));
    } catch (error) {
      console.error("DELIVERY CONSOLE LOAD ERROR:", error);

      Alert.alert("Error", "No se pudo cargar la entrega.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDelivery();
  }, [deliveryId]);

  async function handleStartDelivery() {
    if (!deliveryId || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await startDelivery(deliveryId);

      if (error) {
        if (
          error instanceof Error &&
          error.message === "El cliente todavía no ha aceptado la cotización."
        ) {
          Alert.alert(
            "Entrega pendiente",
            "Esta orden no se puede iniciar hasta que el cliente acepte la cotización.",
          );

          return;
        }

        throw error;
      }

      if (!data) {
        Alert.alert(
          "No se pudo iniciar",
          "La entrega ya no está en estado PENDING.",
        );

        await loadDelivery();
        return;
      }

      setDelivery(data);

      Alert.alert("Entrega iniciada", "La entrega ahora está en curso.");
    } catch (error) {
      console.error("DELIVERY CONSOLE START DELIVERY ERROR:", error);

      Alert.alert("Error", "No se pudo iniciar la entrega.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleStartRoute() {
    if (!deliveryId || isProcessing) {
      return;
    }

    if (delivery?.status !== DELIVERY_STATUS.IN_PROGRESS) {
      Alert.alert("Entrega no iniciada", "Primero debe iniciar la entrega.");

      return;
    }

    setIsProcessing(true);

    let trackingStarted = false;

    try {
      await startDriverLocationTracking(deliveryId);

      trackingStarted = true;
      setTrackingActive(true);

      const { data, error } = await startDeliveryRoute(deliveryId);

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          "La entrega ya no está disponible para iniciar el recorrido.",
        );
      }

      setDelivery(data);

      await loadDelivery();

      Alert.alert("Recorrido iniciado", "El pedido ahora está en camino.");
    } catch (error) {
      if (trackingStarted) {
        stopDriverLocationTracking();
        setTrackingActive(false);
      }

      console.error("DELIVERY CONSOLE START ROUTE ERROR:", error);

      const message =
        error instanceof Error
          ? error.message
          : "No se pudo iniciar el recorrido.";

      Alert.alert("No se pudo iniciar el recorrido", message);

      await loadDelivery();
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleStopTracking() {
    stopDriverLocationTracking();
    setTrackingActive(false);

    await loadDelivery();

    Alert.alert("GPS detenido", "La transmisión de ubicación fue detenida.");
  }

  function handleCompleteDelivery() {
    if (!deliveryId || isProcessing) {
      return;
    }

    if (delivery?.status !== DELIVERY_STATUS.ON_ROUTE) {
      Alert.alert(
        "Recorrido no iniciado",
        "Debe iniciar el recorrido antes de completar la entrega.",
      );

      return;
    }

    Alert.alert("Completar entrega", "¿Confirma que el pedido fue entregado?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        onPress: async () => {
          setIsProcessing(true);

          try {
            stopDriverLocationTracking();
            setTrackingActive(false);

            const { data, error } = await completeDelivery(deliveryId);

            if (error) {
              throw error;
            }

            if (!data) {
              Alert.alert(
                "No se pudo completar",
                "La entrega ya no está en estado ON_ROUTE.",
              );

              await loadDelivery();
              return;
            }

            setDelivery(data);

            Alert.alert(
              "Entrega completada",
              "El pedido fue marcado como entregado.",
              [
                {
                  text: "Aceptar",
                  onPress: () => {
                    router.back();
                  },
                },
              ],
            );
          } catch (error) {
            console.error("DELIVERY CONSOLE COMPLETE ERROR:", error);

            const message =
              error instanceof Error
                ? error.message
                : "No se pudo completar la entrega.";

            Alert.alert("Error", message);
          } finally {
            setIsProcessing(false);
          }
        },
      },
    ]);
  }

  async function openGoogleMaps() {
    const latitude = delivery?.order?.address?.latitude;

    const longitude = delivery?.order?.address?.longitude;

    if (latitude == null || longitude == null) {
      Alert.alert(
        "Ubicación no disponible",
        "Esta dirección no tiene coordenadas guardadas.",
      );

      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("GOOGLE MAPS OPEN ERROR:", error);

      Alert.alert("No se pudo abrir Google Maps", "Inténtalo nuevamente.");
    }
  }

  async function openWaze() {
    const latitude = delivery?.order?.address?.latitude;

    const longitude = delivery?.order?.address?.longitude;

    if (latitude == null || longitude == null) {
      Alert.alert(
        "Ubicación no disponible",
        "Esta dirección no tiene coordenadas guardadas.",
      );

      return;
    }

    const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("WAZE OPEN ERROR:", error);

      Alert.alert(
        "No se pudo abrir Waze",
        "Verifica que Waze esté disponible en el dispositivo.",
      );
    }
  }

  function handleOpenNavigation() {
    const latitude = delivery?.order?.address?.latitude;

    const longitude = delivery?.order?.address?.longitude;

    if (latitude == null || longitude == null) {
      Alert.alert(
        "Ubicación no disponible",
        "Esta dirección no tiene coordenadas guardadas.",
      );

      return;
    }

    Alert.alert(
      "Abrir navegación",
      "Selecciona la aplicación que deseas usar.",
      [
        {
          text: "Google Maps",
          onPress: () => {
            void openGoogleMaps();
          },
        },
        {
          text: "Waze",
          onPress: () => {
            void openWaze();
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Cargando entrega...</Text>
      </SafeAreaView>
    );
  }

  if (!deliveryId) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={56} color="#DC2626" />

        <Text style={styles.errorTitle}>Entrega no válida</Text>

        <Text style={styles.errorText}>
          No se recibió un deliveryId válido.
        </Text>
      </SafeAreaView>
    );
  }

  if (!delivery) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="cube-outline" size={56} color="#64748B" />

        <Text style={styles.errorTitle}>Entrega no encontrada</Text>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Regresar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isPending = delivery.status === DELIVERY_STATUS.PENDING;

  const isInProgress = delivery.status === DELIVERY_STATUS.IN_PROGRESS;

  const isOnRoute = delivery.status === DELIVERY_STATUS.ON_ROUTE;

  const isDelivered = delivery.status === DELIVERY_STATUS.DELIVERED;

  const activeTrackingDeliveryId = getActiveTrackingDeliveryId();

  const customerName =
    delivery.order?.customer?.full_name?.trim() || "Cliente sin nombre";

  const customerPhone =
    delivery.order?.customer?.phone?.trim() || "Teléfono no disponible";

  const deliveryAddress =
    delivery.order?.address?.address_line?.trim() || "Dirección no disponible";

  const orderDescription =
    delivery.order?.description?.trim() || "No se agregó una descripción.";

  const serviceType = delivery.order?.service_type?.trim().toUpperCase() || "";

  const pickupLocation = delivery.order?.pickup_location?.trim() || "";

  const courierWeight = delivery.order?.courier_weight?.trim() || "";

  const paymentMethod = delivery.order?.payment_method?.trim() || "";

  const addressReference = delivery.order?.address?.reference?.trim() || "";

  const boomerangTotal = delivery.order?.quote?.total ?? null;

  const boomerangCurrency = delivery.order?.quote?.currency ?? null;

  const formattedBoomerangTotal =
    boomerangTotal !== null
      ? boomerangCurrency === "CRC"
        ? `₡${boomerangTotal.toLocaleString("es-CR")}`
        : boomerangCurrency === "USD"
          ? `$${boomerangTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : `${boomerangTotal.toLocaleString()} ${
              boomerangCurrency ?? ""
            }`.trim()
      : null;

  const foodOrderPaid = delivery.order?.food_order_paid ?? null;

  const courierOrderPaid = delivery.order?.courier_order_paid ?? null;

  const pickupLabel =
    serviceType === "SUPERMARKET" || serviceType === "PHARMACY"
      ? "Lugar de preferencia"
      : "Lugar de recogida";

  const serviceLabel =
    serviceType === "SUPERMARKET"
      ? "Supermercado"
      : serviceType === "PHARMACY"
        ? "Farmacia"
        : serviceType === "FOOD_PICKUP"
          ? "Restaurante"
          : serviceType === "GENERAL_MESSAGING"
            ? "Mensajería"
            : serviceType || "No disponible";

  const paymentStatus =
    serviceType === "FOOD_PICKUP"
      ? foodOrderPaid === true
        ? "Pago realizado en el comercio"
        : foodOrderPaid === false
          ? "Pago pendiente en el comercio"
          : null
      : serviceType === "GENERAL_MESSAGING"
        ? courierOrderPaid === true
          ? "Pago realizado en el comercio"
          : courierOrderPaid === false
            ? "Pago pendiente en el comercio"
            : null
        : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Entrega</Text>

            <Text style={styles.subtitle}>Gestión del recorrido</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.cardLabel}>PEDIDO</Text>

              <Text style={styles.deliveryNumber}>
                #{delivery.order_id.slice(-6).toUpperCase()}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                isInProgress && styles.statusBadgeInProgress,
                isOnRoute && styles.statusBadgeOnRoute,
                isDelivered && styles.statusBadgeDelivered,
              ]}
            >
              <Text style={styles.statusBadgeText}>{delivery.status}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="navigate-outline"
              size={20}
              color={trackingActive ? "#16A34A" : "#64748B"}
            />

            <Text style={styles.infoText}>
              GPS: {trackingActive ? "Transmitiendo" : "Detenido"}
            </Text>
          </View>

          {activeTrackingDeliveryId &&
          activeTrackingDeliveryId !== deliveryId ? (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color="#B45309" />

              <Text style={styles.warningText}>
                Este teléfono está transmitiendo otra entrega.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.customerCard}>
          <Text style={styles.sectionTitle}>Información de la entrega</Text>

          <View style={styles.customerInfoRow}>
            <View style={styles.customerIcon}>
              <Ionicons name="person-outline" size={20} color="#0F766E" />
            </View>

            <View style={styles.customerInfoContent}>
              <Text style={styles.customerInfoLabel}>Cliente</Text>

              <Text style={styles.customerInfoValue}>{customerName}</Text>
            </View>
          </View>

          <View style={styles.customerInfoRow}>
            <View style={styles.customerIcon}>
              <Ionicons name="call-outline" size={20} color="#0F766E" />
            </View>

            <View style={styles.customerInfoContent}>
              <Text style={styles.customerInfoLabel}>Teléfono</Text>

              <Text style={styles.customerInfoValue}>{customerPhone}</Text>
            </View>
          </View>

          <View style={styles.customerInfoRow}>
            <View style={styles.customerIcon}>
              <Ionicons name="cube-outline" size={20} color="#0F766E" />
            </View>

            <View style={styles.customerInfoContent}>
              <Text style={styles.customerInfoLabel}>Servicio</Text>

              <Text style={styles.customerInfoValue}>{serviceLabel}</Text>
            </View>
          </View>

          {pickupLocation ? (
            <View style={styles.customerInfoRow}>
              <View style={styles.customerIcon}>
                <Ionicons name="storefront-outline" size={20} color="#0F766E" />
              </View>

              <View style={styles.customerInfoContent}>
                <Text style={styles.customerInfoLabel}>{pickupLabel}</Text>

                <Text style={styles.customerInfoValue}>{pickupLocation}</Text>
              </View>
            </View>
          ) : null}

          {paymentMethod ? (
            <View style={styles.customerInfoRow}>
              <View style={styles.customerIcon}>
                <Ionicons name="wallet-outline" size={20} color="#0F766E" />
              </View>

              <View style={styles.customerInfoContent}>
                <Text style={styles.customerInfoLabel}>Método de pago</Text>

                <Text style={styles.customerInfoValue}>
                  {paymentMethod === "CASH" ? "Efectivo" : paymentMethod}
                </Text>
              </View>
            </View>
          ) : null}

          {formattedBoomerangTotal ? (
            <View style={styles.customerInfoRow}>
              <View style={styles.customerIcon}>
                <Ionicons name="cash-outline" size={20} color="#0F766E" />
              </View>

              <View style={styles.customerInfoContent}>
                <Text style={styles.customerInfoLabel}>
                  Total a cobrar por Boomerang
                </Text>

                <Text style={styles.customerInfoValue}>
                  {formattedBoomerangTotal}
                </Text>
              </View>
            </View>
          ) : null}

          {paymentStatus ? (
            <View style={styles.customerInfoRow}>
              <View style={styles.customerIcon}>
                <Ionicons name="card-outline" size={20} color="#0F766E" />
              </View>

              <View style={styles.customerInfoContent}>
                <Text style={styles.customerInfoLabel}>Estado de pago</Text>

                <Text style={styles.customerInfoValue}>{paymentStatus}</Text>
              </View>
            </View>
          ) : null}

          {serviceType === "GENERAL_MESSAGING" && courierWeight ? (
            <View style={styles.customerInfoRow}>
              <View style={styles.customerIcon}>
                <Ionicons name="barbell-outline" size={20} color="#0F766E" />
              </View>

              <View style={styles.customerInfoContent}>
                <Text style={styles.customerInfoLabel}>Peso</Text>

                <Text style={styles.customerInfoValue}>
                  {courierWeight.charAt(0).toUpperCase() +
                    courierWeight.slice(1).toLowerCase()}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.descriptionBox}>
            <View style={styles.descriptionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#0F766E"
              />

              <Text style={styles.descriptionLabel}>Descripción</Text>
            </View>

            <Text style={styles.descriptionText}>{orderDescription}</Text>
          </View>

          <View style={styles.deliveryAddressBox}>
            <View style={styles.descriptionHeader}>
              <Ionicons name="location-outline" size={20} color="#0F766E" />

              <Text style={styles.descriptionLabel}>Dirección de entrega</Text>
            </View>

            <Text style={styles.descriptionText}>{deliveryAddress}</Text>

            {addressReference ? (
              <>
                <Text style={styles.addressReferenceLabel}>Referencia</Text>

                <Text style={styles.addressReferenceText}>
                  {addressReference}
                </Text>
              </>
            ) : null}

            <Pressable
              style={styles.navigationButton}
              onPress={handleOpenNavigation}
              accessibilityRole="button"
              accessibilityLabel="Abrir navegación"
            >
              <Ionicons name="navigate-outline" size={20} color="#FFFFFF" />

              <Text style={styles.navigationButtonText}>Abrir navegación</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Controles de operación</Text>

          <Pressable
            style={[
              styles.actionButton,
              styles.startDeliveryButton,
              (!isPending || isProcessing) && styles.disabledButton,
            ]}
            disabled={!isPending || isProcessing}
            onPress={handleStartDelivery}
          >
            <Ionicons name="play-circle-outline" size={24} color="#FFFFFF" />

            <Text style={styles.actionButtonText}>Iniciar entrega</Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              styles.startGpsButton,
              (!isInProgress || trackingActive || isProcessing) &&
                styles.disabledButton,
            ]}
            disabled={!isInProgress || trackingActive || isProcessing}
            onPress={handleStartRoute}
          >
            <Ionicons
              name="navigate-circle-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.actionButtonText}>Iniciar recorrido</Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              styles.stopGpsButton,
              (!trackingActive || isProcessing) && styles.disabledButton,
            ]}
            disabled={!trackingActive || isProcessing}
            onPress={handleStopTracking}
          >
            <Ionicons name="stop-circle-outline" size={24} color="#FFFFFF" />

            <Text style={styles.actionButtonText}>Detener GPS</Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              styles.completeButton,
              (!isOnRoute || isProcessing) && styles.disabledButton,
            ]}
            disabled={!isOnRoute || isProcessing}
            onPress={handleCompleteDelivery}
          >
            <Ionicons
              name="checkmark-done-circle-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.actionButtonText}>Marcar como entregado</Text>
          </Pressable>

          {isProcessing ? (
            <ActivityIndicator style={styles.processingIndicator} />
          ) : null}
        </View>

        <Pressable
          style={styles.supportButton}
          onPress={() =>
            Alert.alert(
              "Contactar soporte",
              `Solicita ayuda con el pedido #${delivery.order_id
                .slice(-6)
                .toUpperCase()}.`,
            )
          }
        >
          <Ionicons name="headset-outline" size={22} color="#0F766E" />

          <Text style={styles.supportButtonText}>Contactar soporte</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    color: "#475569",
    fontSize: 15,
  },

  errorTitle: {
    marginTop: 16,
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "700",
  },

  errorText: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 15,
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  headerTextContainer: {
    marginLeft: 14,
  },

  title: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 2,
    color: "#64748B",
    fontSize: 14,
  },

  statusCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statusHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  cardLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },

  deliveryNumber: {
    marginTop: 4,
    color: "#0F172A",
    fontSize: 25,
    fontWeight: "800",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
  },

  statusBadgeInProgress: {
    backgroundColor: "#DBEAFE",
  },

  statusBadgeOnRoute: {
    backgroundColor: "#EDE9FE",
  },

  statusBadgeDelivered: {
    backgroundColor: "#DCFCE7",
  },

  statusBadgeText: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "700",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    color: "#475569",
    fontSize: 14,
  },

  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FEF3C7",
  },

  warningText: {
    flex: 1,
    marginLeft: 10,
    color: "#92400E",
    fontSize: 13,
  },

  customerCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  customerInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
  },

  customerIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#CCFBF1",
  },

  customerInfoContent: {
    flex: 1,
    marginLeft: 12,
  },

  customerInfoLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
  },

  customerInfoValue: {
    marginTop: 3,
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },

  descriptionBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  descriptionLabel: {
    marginLeft: 8,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
  },

  descriptionText: {
    marginTop: 9,
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
  },

  deliveryAddressBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  addressReferenceLabel: {
    marginTop: 14,
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
  },

  addressReferenceText: {
    marginTop: 4,
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 20,
  },

  navigationButton: {
    minHeight: 48,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  navigationButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  actionsCard: {
    marginTop: 18,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sectionTitle: {
    marginBottom: 16,
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
  },

  actionButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    borderRadius: 16,
  },

  startDeliveryButton: {
    backgroundColor: "#16A34A",
  },

  startGpsButton: {
    backgroundColor: "#2563EB",
  },

  stopGpsButton: {
    backgroundColor: "#F59E0B",
  },

  completeButton: {
    backgroundColor: "#7C3AED",
  },

  disabledButton: {
    opacity: 0.4,
  },

  actionButtonText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  processingIndicator: {
    marginTop: 18,
  },

  secondaryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "#2DD4BF",
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  supportButton: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#CCFBF1",
    borderWidth: 1,
    borderColor: "#99F6E4",
  },

  supportButtonText: {
    marginLeft: 10,
    color: "#0F766E",
    fontSize: 16,
    fontWeight: "800",
  },
});
