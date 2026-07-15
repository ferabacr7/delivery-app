import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  StyleProp,
} from "react-native";

import {
  colors,
  spacing,
  typography,
} from "../../constants/theme";

type InfoRowProps = {
  label: string;
  value: string;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
};

export default function InfoRow({
  label,
  value,
  labelStyle,
  valueStyle,
}: InfoRowProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>
        {label}
      </Text>

      <Text style={[styles.value, valueStyle]}>
        {value}
      </Text>
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