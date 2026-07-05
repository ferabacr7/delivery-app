import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Card from "../../ui/Card";
import InfoRow from "../../ui/InfoRow";
import StatusBadge from "../../ui/StatusBadge";

import {
  colors,
  spacing,
  typography,
} from "../../../constants/theme";

import { QuoteStatusTone } from "../../../presentation/QuoteViewModel";

type Props = {
  title: string;
  description: string;
  statusLabel: string;
  statusTone: QuoteStatusTone;
  locationTitle: string;
  address: string;
  reference?: string | null;
};

export default function QuoteDetailsCard({
  title,
  description,
  statusLabel,
  statusTone,
  locationTitle,
  address,
  reference,
}: Props) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <StatusBadge
          label={statusLabel}
          tone={statusTone}
        />
      </View>

      <Text style={styles.description}>
        {description}
      </Text>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>
        {locationTitle}
      </Text>

      <Text style={styles.address}>
        {address}
      </Text>

      {reference ? (
        <Text style={styles.reference}>
          {reference}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  title: {
    ...typography.subtitle,
  },

  description: {
    ...typography.body,
    color: colors.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.sm,
  },

  address: {
    ...typography.body,
    color: colors.text,
  },

  reference: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});