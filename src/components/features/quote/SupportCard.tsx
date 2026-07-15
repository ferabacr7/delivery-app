import React from "react";
import { Linking, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Card from "../../ui/Card";
import { colors, radius, spacing, typography } from "../../../constants/theme";

type Props = {
  phoneNumber: string;
};

export default function SupportCard({ phoneNumber }: Props) {
  const handleContactSupport = async () => {
    try {
      await Linking.openURL(`https://wa.me/${phoneNumber}`);
    } catch (error) {
      console.warn("No fue posible abrir WhatsApp.", error);
    }
  };

  return (
    <Card>
      <Pressable style={styles.button} onPress={handleContactSupport}>
        <Ionicons
          name="logo-whatsapp"
          size={20}
          color={colors.textInverse}
        />

        <Text style={styles.buttonText}>
          Contactar Servicio al Cliente
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },

  buttonText: {
    ...typography.button,
    color: colors.textInverse,
  },
});