import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../constants/theme";

type TrackingETAProps = {
  eta: string;
  label?: string;
};

export default function TrackingETA({
  eta,
  label = "Llegada estimada",
}: TrackingETAProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="time-outline"
          size={24}
          color={colors.brand}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text style={styles.value}>
          {eta}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.brandSoft,
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
  },

  label: {
    ...typography.caption,
    color: colors.textMuted,
  },

  value: {
    ...typography.body,
    color: colors.text,
    fontWeight: "800",
    marginTop: 2,
  },
});