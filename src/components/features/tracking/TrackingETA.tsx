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
  updatedAt: string;
};

export default function TrackingETA({
  eta,
  updatedAt,
}: TrackingETAProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="time-outline"
            size={24}
            color={colors.brand}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>
            Llegada estimada
          </Text>

          <Text style={styles.value}>
            {eta}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="refresh-outline"
            size={24}
            color={colors.brand}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>
            Última actualización
          </Text>

          <Text style={styles.value}>
            {updatedAt}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: spacing.lg,
    alignItems: "center",
  },

  divider: {
    width: 1,
    alignSelf: "stretch",
    marginHorizontal: spacing.md,
    backgroundColor: colors.border,
  },

  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
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