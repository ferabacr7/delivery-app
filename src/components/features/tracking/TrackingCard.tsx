import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { spacing } from "../../../constants/theme";
import {
  isDriverTrackingActive,
  startDriverLocationTracking,
  stopDriverLocationTracking,
} from "../../../services/driverLocationService";
import Card from "../../ui/Card";

import TrackingETA from "./TrackingETA";
import TrackingMap from "./TrackingMap";
import TrackingStatus from "./TrackingStatus";

type Props = {
  deliveryId?: string | null;

  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "expired"
    | "unknown";

  latitude?: number | null;
  longitude?: number | null;

  trackingTitle: string;
  waitingText: string;
  activeText: string;
  unavailableText: string;
  updatedText: string;

  eta: string;
  updatedAt: string;
};

export default function TrackingCard({
  deliveryId,

  status,
  latitude,
  longitude,

  trackingTitle,
  waitingText,
  activeText,
  unavailableText,
  updatedText,

  eta,
  updatedAt,
}: Props) {
  const [isTracking, setIsTracking] = useState(
    isDriverTrackingActive(),
  );

  const [isStarting, setIsStarting] = useState(false);

  async function handleStartTracking() {
    if (!deliveryId) {
      Alert.alert(
        "Tracking no disponible",
        "No se encontró un deliveryId válido.",
      );

      return;
    }

    if (isStarting || isTracking) {
      return;
    }

    setIsStarting(true);

    try {
      await startDriverLocationTracking(deliveryId);

      setIsTracking(true);

      Alert.alert(
        "Tracking iniciado",
        "El teléfono comenzará a enviar su ubicación automáticamente.",
      );
    } catch (error) {
      console.error(
        "TRACKING CARD START ERROR:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "No fue posible iniciar el tracking.";

      Alert.alert(
        "Error al iniciar tracking",
        message,
      );
    } finally {
      setIsStarting(false);
    }
  }

  function handleStopTracking() {
    stopDriverLocationTracking();

    setIsTracking(false);

    Alert.alert(
      "Tracking detenido",
      "El teléfono dejó de enviar ubicaciones.",
    );
  }

  useEffect(() => {
    return () => {
      stopDriverLocationTracking();
    };
  }, []);

  const canTestTracking =
    Boolean(deliveryId) &&
    status === "accepted";

  return (
    <Card style={styles.card}>
      <TrackingStatus
        status={status}
        title={trackingTitle}
        waitingText={waitingText}
        activeText={activeText}
        unavailableText={unavailableText}
        updatedText={updatedText}
      />

      <TrackingMap
        deliveryId={deliveryId}
        latitude={latitude}
        longitude={longitude}
      />

      <TrackingETA
        eta={eta}
        updatedAt={updatedAt}
      />

      {canTestTracking ? (
        <View style={styles.testSection}>
          <Text style={styles.testTitle}>
            Prueba temporal del GPS
          </Text>

          <Text style={styles.testDescription}>
            Inicia el seguimiento y mueve el iPhone
            para comprobar que Supabase recibe
            nuevas ubicaciones automáticamente.
          </Text>

          <View style={styles.actions}>
            <Pressable
              disabled={isStarting || isTracking}
              onPress={handleStartTracking}
              style={({ pressed }) => [
                styles.button,
                styles.startButton,
                (isStarting || isTracking) &&
                  styles.disabledButton,
                pressed &&
                  !isStarting &&
                  !isTracking &&
                  styles.pressedButton,
              ]}
            >
              <Text style={styles.buttonText}>
                {isStarting
                  ? "Iniciando..."
                  : isTracking
                    ? "Tracking activo"
                    : "Iniciar tracking"}
              </Text>
            </Pressable>

            <Pressable
              disabled={!isTracking}
              onPress={handleStopTracking}
              style={({ pressed }) => [
                styles.button,
                styles.stopButton,
                !isTracking &&
                  styles.disabledButton,
                pressed &&
                  isTracking &&
                  styles.pressedButton,
              ]}
            >
              <Text style={styles.buttonText}>
                Detener tracking
              </Text>
            </Pressable>
          </View>

          <Text style={styles.statusText}>
            Estado:{" "}
            {isTracking
              ? "enviando ubicación"
              : "detenido"}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },

  testSection: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: spacing.sm,
  },

  testTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  testDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  button: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },

  startButton: {
    backgroundColor: "#2DD4BF",
  },

  stopButton: {
    backgroundColor: "#EF4444",
  },

  disabledButton: {
    opacity: 0.45,
  },

  pressedButton: {
    opacity: 0.8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  statusText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: spacing.xs,
  },
});