import React, { ReactNode } from "react";
import { Text, StyleSheet } from "react-native";

import Card from "./Card";
import { spacing, typography } from "../../constants/theme";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export default function SectionCard({
  title,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
  },
});