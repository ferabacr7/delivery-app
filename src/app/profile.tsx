import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>Usuario Demo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Pedidos realizados</Text>
        <Text style={styles.value}>12</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Ciudad</Text>
        <Text style={styles.value}>Potrero, Guanacaste</Text>
      </View>
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 12,
  },
  label: {
    color: colors.muted,
    fontWeight: "700",
  },
  value: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
    color: colors.dark,
  },
});
