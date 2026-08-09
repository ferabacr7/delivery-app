import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import {
  colors,
  spacing,
  typography,
} from "../../../constants/theme";

type Props = {
  phoneNumber: string;
};

export default function SupportCard({
  phoneNumber,
}: Props) {
  const handleContactSupport = async () => {
    try {
      await Linking.openURL(
        `https://wa.me/${phoneNumber}`,
      );
    } catch (error) {
      console.warn(
        "No fue posible abrir WhatsApp.",
        error,
      );
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={handleContactSupport}
      accessibilityRole="button"
      accessibilityLabel="Contactar a Servicio al Cliente"
    >
      <Ionicons
        name="logo-whatsapp"
        size={20}
        color={colors.brand}
      />

      <Text style={styles.buttonText}>
        Contactar a Servicio al Cliente
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingTop: spacing.md,

    borderTopWidth: 1,
    borderTopColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: spacing.xs,
  },

  buttonPressed: {
    opacity: 0.65,
  },

  buttonText: {
    ...typography.caption,
    color: colors.brand,
    fontWeight: "700",
  },
});