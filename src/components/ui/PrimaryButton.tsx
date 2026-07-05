import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
} from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

type Props = PressableProps & {
  title: string;
};

export default function PrimaryButton({
  title,
  style,
  ...props
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style as any,
      ]}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.85,
  },

  text: {
    ...typography.button,
    color: colors.textInverse,
  },
});