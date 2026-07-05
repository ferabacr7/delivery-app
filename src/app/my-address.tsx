import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { createAddress } from "../services/addressService";
import { colors } from "../styles/theme";

export default function MyAddressScreen() {
  const [label, setLabel] = useState("Casa");
  const [addressLine, setAddressLine] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSaveAddress() {
    const trimmedLabel = label.trim();
    const trimmedAddress = addressLine.trim();
    const trimmedReference = reference.trim();

    if (!trimmedLabel) {
      Alert.alert("Error", "Escribe un nombre para la dirección.");
      return;
    }

    if (!trimmedAddress) {
      Alert.alert("Error", "Escribe la dirección de entrega.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await createAddress({
        label: trimmedLabel,
        addressLine: trimmedAddress,
        reference: trimmedReference,
        isDefault: true,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert("Dirección guardada", "Tu dirección fue guardada correctamente.");
      router.back();
    } catch {
      Alert.alert("Error", "No se pudo guardar la dirección.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Volver</Text>
      </Pressable>

      <Text style={styles.title}>Mi dirección</Text>
      <Text style={styles.subtitle}>
        Registra una única dirección para recibir tus pedidos durante la beta.
      </Text>

      <Text style={styles.label}>Nombre de la dirección</Text>
      <TextInput
        style={styles.input}
        value={label}
        onChangeText={setLabel}
        placeholder="Casa, trabajo, apartamento..."
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.textArea}
        value={addressLine}
        onChangeText={setAddressLine}
        placeholder="Ej: 200m norte del supermercado..."
        placeholderTextColor={colors.muted}
        multiline
      />

      <Text style={styles.label}>Referencia adicional</Text>
      <TextInput
        style={styles.textArea}
        value={reference}
        onChangeText={setReference}
        placeholder="Color de portón, punto de referencia, indicaciones..."
        placeholderTextColor={colors.muted}
        multiline
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSaveAddress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Guardando..." : "Guardar dirección"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
    paddingTop: 70,
  },
  back: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  title: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: "900",
    color: colors.primary,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  label: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    color: colors.dark,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark,
  },
  textArea: {
    minHeight: 92,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: colors.dark,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 28,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
});