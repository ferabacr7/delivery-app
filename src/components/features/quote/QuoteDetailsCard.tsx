import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Card from "../../ui/Card";
import StatusBadge from "../../ui/StatusBadge";

import {
  colors,
  spacing,
  typography,
} from "../../../constants/theme";

import { QuoteStatusTone } from "../../../presentation/QuoteViewModel";

type Props = {
  title: string;

  typeLabel: string;
  type: string;

  description: string;

  statusPrefix: string;
  statusLabel: string;
  statusTone: QuoteStatusTone;

  locationTitle: string;
  address: string;
  reference?: string | null;
};

export default function QuoteDetailsCard({
  title,
  typeLabel,
  type,
  description,
  statusPrefix,
  statusLabel,
  statusTone,
  locationTitle,
  address,
  reference,
}: Props) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>
          {typeLabel}
        </Text>

        <Text style={styles.value}>
          {type}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>
          {statusPrefix}
        </Text>

        <StatusBadge
          label={statusLabel}
          tone={statusTone}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>
          Descripción
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>

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
  title: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
  },

  section: {
    marginBottom: spacing.md,
  },

  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    fontWeight: "600",
  },

  value: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700",
  },

  description: {
    ...typography.body,
    color: colors.text,
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