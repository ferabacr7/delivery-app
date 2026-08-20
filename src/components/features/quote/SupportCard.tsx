import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, StyleSheet, Text } from "react-native";

import { colors, spacing, typography } from "../../../constants/theme";

import { useTranslation } from "../../../i18n/useTranslation";

type Props = {
  phoneNumber: string;
};

export default function SupportCard({ phoneNumber }: Props) {
  const { t } = useTranslation();
  const handleContactSupport = async () => {
    try {
      await Linking.openURL(`https://wa.me/${phoneNumber}`);
    } catch (error) {
      console.warn("No fue posible abrir WhatsApp.", error);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={handleContactSupport}
      accessibilityRole="button"
      accessibilityLabel={t("orderDetail.contactSupport")}
    >
      <Ionicons name="logo-whatsapp" size={20} color={colors.brand} />

      <Text style={styles.buttonText}>{t("orderDetail.contactSupport")}</Text>
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
