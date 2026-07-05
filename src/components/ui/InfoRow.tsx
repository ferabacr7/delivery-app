import React from "react";
import { View, Text, StyleSheet } from "react-native";

import {
  colors,
  spacing,
  typography,
} from "../../constants/theme";

type InfoRowProps = {
  label: string;
  value: string;
};

export default function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },

  label: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },

  value: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },
});