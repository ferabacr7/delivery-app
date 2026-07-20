import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

  const [delivery, setDelivery] =
    useState<DeliveryRow | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trackingActive, setTrackingActive] = useState(false);

  async function loadDelivery() {
    if (!deliveryId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } =
        await getDeliveryById(deliveryId);

      if (error) {
        throw error;
      }

      setDelivery(data);
      setTrackingActive(
        isTrackingDelivery(deliveryId),
      );
    } catch (error) {
      console.error(
        "DELIVERY CONSOLE LOAD ERROR:",
        error,
      );

      Alert.alert(
        "Error",
        "No se pudo cargar la entrega.",
      );
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
      const { data, error } =
        await startDelivery(deliveryId);

      if (error) {
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

      Alert.alert(
        "Entrega iniciada",
        "La entrega ahora está en curso.",
      );
    } catch (error) {
      console.error(
        "DELIVERY CONSOLE START DELIVERY ERROR:",
        error,
      );

      Alert.alert(
        "Error",
        "No se pudo iniciar la entrega.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleStartTracking() {
    if (!deliveryId || isProcessing) {
      return;
    }

    if (
      delivery?.status !==
      DELIVERY_STATUS.IN_PROGRESS
    ) {
      Alert.alert(
        "Entrega no iniciada",
        "Primero debe iniciar la entrega.",
      );

      return;
    }

    setIsProcessing(true);

    try {
      await startDriverLocationTracking(
        deliveryId,
      );

      setTrackingActive(true);

      Alert.alert(
        "GPS iniciado",
        "La ubicación se está transmitiendo en tiempo real.",
      );
    } catch (error) {
      console.error(
        "DELIVERY CONSOLE START TRACKING ERROR:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "No se pudo iniciar el GPS.";

      Alert.alert("Error", message);
    } finally {
      setIsProcessing(false);
    }
  }

  function handleStopTracking() {
    stopDriverLocationTracking();
    setTrackingActive(false);

    Alert.alert(
      "GPS detenido",
      "La transmisión de ubicación fue detenida.",
    );
  }

  function handleCompleteDelivery() {
    if (!deliveryId || isProcessing) {
      return;
    }

    Alert.alert(
      "Completar entrega",
      "¿Confirma que el pedido fue entregado?",
      [
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

              const { data, error } =
                await completeDelivery(
                  deliveryId,
                );

              if (error) {
                throw error;
              }

              if (!data) {
                Alert.alert(
                  "No se pudo completar",
                  "La entrega ya no está en estado IN_PROGRESS.",
                );

                await loadDelivery();
                return;
              }

              setDelivery(data);

              Alert.alert(
                "Entrega completada",
                "El pedido fue marcado como entregado.",
              );
            } catch (error) {
              console.error(
                "DELIVERY CONSOLE COMPLETE ERROR:",
                error,
              );

              Alert.alert(
                "Error",
                "No se pudo completar la entrega.",
              );
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Cargando entrega...
        </Text>
      </SafeAreaView>
    );
  }

  if (!deliveryId) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons
          name="alert-circle-outline"
          size={56}
          color="#DC2626"
        />

        <Text style={styles.errorTitle}>
          Entrega no válida
        </Text>

        <Text style={styles.errorText}>
          No se recibió un deliveryId válido.
        </Text>
      </SafeAreaView>
    );
  }

  if (!delivery) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons
          name="cube-outline"
          size={56}
          color="#64748B"
        />

        <Text style={styles.errorTitle}>
          Entrega no encontrada
        </Text>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>
            Regresar
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isPending =
    delivery.status === DELIVERY_STATUS.PENDING;

  const isInProgress =
    delivery.status ===
    DELIVERY_STATUS.IN_PROGRESS;

  const isDelivered =
    delivery.status === DELIVERY_STATUS.DELIVERED;

  const activeTrackingDeliveryId =
    getActiveTrackingDeliveryId();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#0F172A"
            />
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Delivery Console
            </Text>

            <Text style={styles.subtitle}>
              Control interno de entrega
            </Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.cardLabel}>
                ENTREGA
              </Text>

              <Text style={styles.deliveryNumber}>
                #{delivery.id
                  .slice(-6)
                  .toUpperCase()}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                isInProgress &&
                  styles.statusBadgeInProgress,
                isDelivered &&
                  styles.statusBadgeDelivered,
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {delivery.status}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="finger-print-outline"
              size={20}
              color="#64748B"
            />

            <Text
              style={styles.infoText}
              numberOfLines={1}
            >
              {delivery.id}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="navigate-outline"
              size={20}
              color={
                trackingActive
                  ? "#16A34A"
                  : "#64748B"
              }
            />

            <Text style={styles.infoText}>
              GPS:{" "}
              {trackingActive
                ? "Transmitiendo"
                : "Detenido"}
            </Text>
          </View>

          {activeTrackingDeliveryId &&
            activeTrackingDeliveryId !==
              deliveryId && (
              <View style={styles.warningBox}>
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color="#B45309"
                />

                <Text style={styles.warningText}>
                  Este teléfono está transmitiendo
                  otra entrega.
                </Text>
              </View>
            )}
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>
            Controles de operación
          </Text>

          <Pressable
            style={[
              styles.actionButton,
              styles.startDeliveryButton,
              (!isPending || isProcessing) &&
                styles.disabledButton,
            ]}
            disabled={!isPending || isProcessing}
            onPress={handleStartDelivery}
          >
            <Ionicons
              name="play-circle-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.actionButtonText}>
              Iniciar entrega
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              styles.startGpsButton,
              (!isInProgress ||
                trackingActive ||
                isProcessing) &&
                styles.disabledButton,
            ]}
            disabled={
              !isInProgress ||
              trackingActive ||
              isProcessing
            }
            onPress={handleStartTracking}
          >
            <Ionicons
              name="navigate-circle-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.actionButtonText}>
              Iniciar GPS
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              styles.stopGpsButton,
              (!trackingActive || isProcessing) &&
                styles.disabledButton,
            ]}
            disabled={
              !trackingActive || isProcessing
            }
            onPress={handleStopTracking}
          >
            <Ionicons
              name="stop-circle-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.actionButtonText}>
              Detener GPS
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              styles.completeButton,
              (!isInProgress || isProcessing) &&
                styles.disabledButton,
            ]}
            disabled={
              !isInProgress || isProcessing
            }
            onPress={handleCompleteDelivery}
          >
            <Ionicons
              name="checkmark-done-circle-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.actionButtonText}>
              Marcar como entregado
            </Text>
          </Pressable>

          {isProcessing && (
            <ActivityIndicator
              style={styles.processingIndicator}
            />
          )}
        </View>

        <View style={styles.architectureNote}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#0F766E"
          />

          <Text style={styles.architectureNoteText}>
            Esta pantalla es interna. El cliente
            solamente recibe el tracking en tiempo
            real y no puede controlar el GPS.
          </Text>
        </View>
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
  architectureNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#CCFBF1",
  },
  architectureNoteText: {
    flex: 1,
    marginLeft: 10,
    color: "#115E59",
    fontSize: 14,
    lineHeight: 20,
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
});