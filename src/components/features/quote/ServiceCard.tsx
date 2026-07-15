import React from "react";
import { StyleSheet, Text } from "react-native";

import Card from "../../ui/Card";
import { colors, spacing, typography } from "../../../constants/theme";

type Props = {
  title: string;
  type: string;
};

export default function ServiceCard({
  title,
  type,
}: Props) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{type}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    marginBottom: spacing.sm,
  },

  value: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700",
    fontSize: 18,
  },
});