import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Card from "../../ui/Card";
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
    <Card>
      <Text style={styles.title}>{title}</Text>

      <InfoRow label={subtotalLabel} value={subtotal} />
      <InfoRow label={deliveryFeeLabel} value={deliveryFee} />

      <View style={styles.divider} />

      <InfoRow
        label={totalLabel}
        value={total}
        labelStyle={styles.totalLabel}
        valueStyle={styles.totalValue}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  totalLabel: {
    fontWeight: "800",
    color: colors.text,
  },

  totalValue: {
    fontWeight: "900",
    color: colors.brandDark,
  },
});