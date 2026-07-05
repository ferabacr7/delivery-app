import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import {
  colors,
  spacing,
  typography,
} from "../../constants/theme";

type Props = {
  title: string;
  subtitle?: string;
};

export default function AppHeader({
  title,
  subtitle,
}: Props) {
  return (
    <View style={styles.container}>
      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },

  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  title: {
    ...typography.title,
    color: colors.text,
  },
});