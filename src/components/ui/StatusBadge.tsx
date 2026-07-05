import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

import { QuoteStatusTone } from "../../presentation/QuoteViewModel";

type Props = {
  label: string;
  tone: QuoteStatusTone;
};

export default function StatusBadge({ label, tone }: Props) {
  return (
    <View style={[styles.badge, getToneStyle(tone)]}>
      <Text style={[styles.label, getTextStyle(tone)]}>
        {label}
      </Text>
    </View>
  );
}

function getToneStyle(tone: QuoteStatusTone) {
  if (tone === "success") return styles.success;
  if (tone === "warning") return styles.warning;
  if (tone === "danger") return styles.danger;
  if (tone === "info") return styles.info;

  return styles.neutral;
}

function getTextStyle(tone: QuoteStatusTone) {
  if (tone === "success") return styles.successText;
  if (tone === "warning") return styles.warningText;
  if (tone === "danger") return styles.dangerText;
  if (tone === "info") return styles.infoText;

  return styles.neutralText;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  label: {
    ...typography.caption,
    fontWeight: "700",
  },

  success: {
    backgroundColor: colors.successSoft,
  },

  warning: {
    backgroundColor: colors.warningSoft,
  },

  danger: {
    backgroundColor: colors.dangerSoft,
  },

  info: {
    backgroundColor: colors.infoSoft,
  },

  neutral: {
    backgroundColor: colors.surfaceSoft,
  },

  successText: {
    color: colors.success,
  },

  warningText: {
    color: colors.warning,
  },

  dangerText: {
    color: colors.danger,
  },

  infoText: {
    color: colors.info,
  },

  neutralText: {
    color: colors.textMuted,
  },
});