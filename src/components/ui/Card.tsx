import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import {
  colors,
  radius,
  spacing,
  shadows,
} from "../../constants/theme";

type Props = ViewProps & {
  children: React.ReactNode;
};

export default function Card({ children, style, ...props }: Props) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.sm,
  },
});