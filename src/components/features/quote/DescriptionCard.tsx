import React from "react";
import { StyleSheet, Text } from "react-native";

import Card from "../../ui/Card";
import { colors, spacing, typography } from "../../../constants/theme";

type Props = {
  title: string;
  description: string;
};

export default function DescriptionCard({
  title,
  description,
}: Props) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>
        {description}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },

  description: {
    ...typography.body,
    color: colors.text,
  },
});