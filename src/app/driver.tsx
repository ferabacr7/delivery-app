import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";
import { getMyProfile, signOut } from "../services/authService";
import { colors } from "../styles/theme";

type DriverProfile = {
  id: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
};

type AssignedDelivery = {
  id: string;
  status: string;
  driver_id: string | null;
};

export default function DriverScreen() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingDelivery, setLoadingDelivery] = useState(false);

  /*
   * Carga normal del perfil del driver.
   */
  useEffect(() => {
    void loadDriverProfile();
  }, []);

  async function loadDriverProfile() {
    try {
      setLoadingProfile(true);

      const { data, error } = await getMyProfile();

      console.log("DRIVER PROFILE DATA:", data);
      console.log("DRIVER PROFILE ERROR:", error);

      if (error || !data) {
        Alert.alert(
          "Error",
          error?.message ??
            "No se pudo cargar el perfil del repartidor.",
        );
        return;
      }

      if (data.role !== "driver") {
        router.replace("/" as never);
        return;
      }

      setProfile(data as DriverProfile);
    } catch (error) {
      console.error("DRIVER PROFILE ERROR:", error);

      Alert.alert(
        "Error",
        "Ocurrió un error al cargar el perfil.",
      );
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleViewAssignedDeliveries() {
    if (!profile || loadingDelivery) {
      return;
    }

    try {
      setLoadingDelivery(true);

      const { data: delivery, error } = await supabase
        .from("deliveries")
        .select("id, status, driver_id")
        .eq("driver_id", profile.id)
        .in("status", [
          "PENDING",
          "IN_PROGRESS",
          "ON_ROUTE",
        ])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<AssignedDelivery>();

      if (error) {
        console.error(
          "DRIVER DELIVERY ERROR:",
          error,
        );

        Alert.alert(
          "Error",
          "No se pudo cargar la entrega asignada.",
        );
        return;
      }

      if (!delivery) {
        Alert.alert(
          "Sin entregas",
          "No tienes ningún pedido asignado.",
        );
        return;
      }

      router.push(
        `/internal/delivery-console/${delivery.id}` as never,
      );
    } catch (error) {
      console.error(
        "DRIVER DELIVERY ERROR:",
        error,
      );

      Alert.alert(
        "Error",
        "Ocurrió un error al buscar la entrega.",
      );
    } finally {
      setLoadingDelivery(false);
    }
  }

  async function handleSignOut() {
    const { error } = await signOut();

    if (error) {
      Alert.alert(
        "Error",
        "No se pudo cerrar la sesión.",
      );
      return;
    }

    router.replace("/login" as never);
  }

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Cargando perfil...
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          No se pudo cargar el perfil.
        </Text>
      </View>
    );
  }

  const shortDriverId =
    profile.id.slice(-6).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="bicycle-outline"
            size={38}
            color={colors.white}
          />
        </View>

        <Text style={styles.headerTitle}>
          Modo repartidor
        </Text>

        <Text style={styles.headerSubtitle}>
          Gestiona tus entregas asignadas
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person-outline"
              size={34}
              color={colors.primary}
            />
          </View>

          <Text style={styles.name}>
            Repartidor 1
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              ID de repartidor
            </Text>

            <Text style={styles.infoValue}>
              #{shortDriverId}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Estado
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {profile.is_active
                  ? "Activo"
                  : "Inactivo"}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            loadingDelivery &&
              styles.buttonDisabled,
          ]}
          onPress={handleViewAssignedDeliveries}
          disabled={loadingDelivery}
        >
          {loadingDelivery ? (
            <ActivityIndicator
              color={colors.white}
            />
          ) : (
            <>
              <Ionicons
                name="cube-outline"
                size={23}
                color={colors.white}
              />

              <Text
                style={styles.primaryButtonText}
              >
                Ver entregas asignadas
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={handleSignOut}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.primary}
          />

          <Text
            style={styles.secondaryButtonText}
          >
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 28,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: colors.muted,
    textAlign: "center",
  },

  header: {
    backgroundColor: colors.primary,
    paddingTop: 76,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.white,
  },

  headerSubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
  },

  content: {
    flex: 1,
    padding: 24,
  },

  profileCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 22,
    marginBottom: 24,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },

  name: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.dark,
    textAlign: "center",
    marginBottom: 22,
  },

  infoRow: {
    marginTop: 14,
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
    marginBottom: 7,
  },

  infoValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    color: colors.dark,
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: colors.brandSoft,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  statusText: {
    color: colors.primary,
    fontWeight: "800",
  },

  primaryButton: {
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },

  secondaryButton: {
    height: 56,
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  buttonDisabled: {
    opacity: 0.65,
  },
});