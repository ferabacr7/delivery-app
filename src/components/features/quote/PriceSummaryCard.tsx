import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../constants/theme";

import Card from "../../ui/Card";
import InfoRow from "../../ui/InfoRow";

type Props = {
  title: string;
  subtotalLabel: string;
  subtotal: string;
  deliveryFeeLabel: string;
  deliveryFee: string;
  totalLabel: string;
  total: string;
  showDetailLabel?: string;
  hideDetailLabel?: string;
};

export default function PriceSummaryCard({
  title,
  subtotalLabel,
  subtotal,
  deliveryFeeLabel,
  deliveryFee,
  totalLabel,
  total,
  showDetailLabel = "Ver detalle",
  hideDetailLabel = "Ocultar detalle",
}: Props) {
  const [isExpanded, setIsExpanded] =
    useState(false);

  return (
    <Card>
      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>
          {totalLabel}
        </Text>

        <Text style={styles.totalValue}>
          {total}
        </Text>
      </View>

      <Pressable
        style={styles.detailButton}
        onPress={() =>
          setIsExpanded((current) => !current)
        }
        accessibilityRole="button"
        accessibilityState={{
          expanded: isExpanded,
        }}
      >
        <Text style={styles.detailButtonText}>
          {isExpanded
            ? hideDetailLabel
            : showDetailLabel}
        </Text>

        <Ionicons
          name={
            isExpanded
              ? "chevron-up-outline"
              : "chevron-down-outline"
          }
          size={20}
          color={colors.brandDark}
        />
      </Pressable>

      {isExpanded ? (
        <View style={styles.detailSection}>
          <InfoRow
            label={subtotalLabel}
            value={subtotal}
          />

          <InfoRow
            label={deliveryFeeLabel}
            value={deliveryFee}
          />

          <View style={styles.divider} />

          <InfoRow
            label={totalLabel}
            value={total}
            labelStyle={styles.detailTotalLabel}
            valueStyle={styles.detailTotalValue}
          />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    color: colors.text,
  },

  totalSection: {
    marginTop: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
  },

  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },

  totalValue: {
    marginTop: spacing.xs,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    color: colors.brandDark,
    textAlign: "center",
  },

  detailButton: {
    minHeight: 46,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  detailButtonText: {
    ...typography.body,
    color: colors.brandDark,
    fontWeight: "800",
  },

  detailSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  detailTotalLabel: {
    fontWeight: "800",
    color: colors.text,
  },

  detailTotalValue: {
    fontWeight: "900",
    color: colors.brandDark,
  },
});