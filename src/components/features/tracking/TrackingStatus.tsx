import { QuoteStatusType } from "../../../presentation/QuoteViewModel";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../constants/theme";

type TrackingStatusType =
  | "pending"
  | "quoted"
  | "accepted"
  | "in_progress"
  | "on_route"
  | "delivered"
  | "rejected"
  | "expired"
  | "unknown";

type TrackingStatusProps = {
  status: QuoteStatusType;
  title: string;
  waitingText: string;
  activeText: string;
  unavailableText: string;
};

export default function TrackingStatus({
  status,
  title,
  waitingText,
  activeText,
  unavailableText,
}: TrackingStatusProps) {
const isActive =
  status === "accepted" ||
  status === "in_progress" ||
  status === "on_route";

const isUnavailable =
  status === "rejected" ||
  status === "expired";

  function getMessage() {
    if (isActive) {
      return activeText;
    }

    if (isUnavailable) {
      return unavailableText;
    }

    return waitingText;
  }

  function getIconName(): keyof typeof Ionicons.glyphMap {
    if (isActive) {
      return "navigate-circle-outline";
    }

    if (isUnavailable) {
      return "close-circle-outline";
    }

    return "time-outline";
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleGroup}>
          <View
            style={[
              styles.iconContainer,
              isUnavailable && styles.unavailableIconContainer,
            ]}
          >
            <Ionicons
              name={getIconName()}
              size={24}
              color={
                isUnavailable
                  ? colors.textMuted
                  : colors.brand
              }
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.message}>
              {getMessage()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  titleGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandSoft,
  },

  unavailableIconContainer: {
    backgroundColor: colors.surfaceSoft,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    ...typography.subtitle,
    color: colors.text,
  },

  message: {
    ...typography.caption,
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
});