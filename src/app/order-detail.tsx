import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function OrderDetailScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={colors.white} />
        </Pressable>

        <Text style={styles.title}>Pedido #1024</Text>
        <Text style={styles.subtitle}>Tu pedido va en camino.</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.label}>Estado actual</Text>
        <Text style={styles.status}>En camino</Text>

        <View style={styles.steps}>
          {["Recibido", "Preparación", "En camino", "Entregado"].map(
            (step, index) => (
              <View key={step} style={styles.step}>
                <View style={[styles.dot, index < 3 && styles.activeDot]}>
                  {index < 3 && (
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  )}
                </View>
                <Text
                  style={[styles.stepText, index === 2 && styles.activeText]}
                >
                  {step}
                </Text>
              </View>
            ),
          )}
        </View>

        <View style={styles.mapBox}>
          <Ionicons name="map-outline" size={50} color={colors.primary} />
          <Text style={styles.mapText}>Mapa del recorrido</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pedilero asignado</Text>
          <Text style={styles.cardValue}>Andrés ⭐ 4.9</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total estimado</Text>
          <Text style={styles.cardValue}>₡13.450</Text>
        </View>

        <Pressable style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 52,
  },
  title: {
    marginTop: 28,
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
  },
  subtitle: { marginTop: 8, fontSize: 16, color: colors.white },
  panel: {
    marginTop: -28,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  label: { color: colors.muted, fontWeight: "800" },
  status: { marginTop: 8, fontSize: 30, fontWeight: "900", color: colors.dark },
  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 28,
  },
  step: { alignItems: "center", width: 78 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: { backgroundColor: colors.primary },
  stepText: {
    marginTop: 8,
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
  },
  activeText: { color: colors.primary, fontWeight: "900" },
  mapBox: {
    height: 170,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  mapText: { marginTop: 8, color: colors.muted },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  cardLabel: { color: colors.muted, fontWeight: "700" },
  cardValue: {
    marginTop: 6,
    color: colors.dark,
    fontSize: 18,
    fontWeight: "900",
  },
  button: {
    marginTop: 18,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: "900" },
});
