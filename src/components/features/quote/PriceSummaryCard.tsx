import React from "react";
import { View, Text, StyleSheet } from "react-native";

import SectionCard from "../../ui/SectionCard";
import InfoRow from "../../ui/InfoRow";

import {
  colors,
  spacing,
  typography,
} from "../../../constants/theme";

type Props = {
  title: string;
  subtotalLabel: string;
  subtotal: string;
  deliveryFeeLabel: string;
  deliveryFee: string;
  totalLabel: string;
  total: string;
};

export default function PriceSummaryCard({
  title,
  subtotalLabel,
  subtotal,
  deliveryFeeLabel,
  deliveryFee,
  totalLabel,
  total,
}: Props) {
  return (
    <SectionCard title={title}>
      <InfoRow label={subtotalLabel} value={subtotal} />
      <InfoRow label={deliveryFeeLabel} value={deliveryFee} />

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{totalLabel}</Text>
        <Text style={styles.totalValue}>{total}</Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    ...typography.subtitle,
    color: colors.text,
  },

  totalValue: {
    ...typography.title,
    color: colors.primary,
  },
});