import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  acceptLabel: string;
  rejectLabel: string;
  canRespond: boolean;
  isSubmitting?: boolean;
  onAccept: () => void;
  onReject: () => void;
};

export default function QuoteActions({
  acceptLabel,
  rejectLabel,
  canRespond,
  isSubmitting = false,
  onAccept,
  onReject,
}: Props) {
  if (!canRespond) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.actionButton,
          styles.acceptButton,
          isSubmitting && styles.disabledButton,
        ]}
        onPress={onAccept}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel={acceptLabel}
      >
        <View style={[styles.iconBox, styles.acceptIconBox]}>
          <Ionicons
            name="checkmark"
            size={26}
            color="#15803D"
          />
        </View>

        <Text style={[styles.actionText, styles.acceptText]}>
          {acceptLabel}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.actionButton,
          styles.rejectButton,
          isSubmitting && styles.disabledButton,
        ]}
        onPress={onReject}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel={rejectLabel}
      >
        <View style={[styles.iconBox, styles.rejectIconBox]}>
          <Ionicons
            name="close"
            size={26}
            color="#DC2626"
          />
        </View>

        <Text style={[styles.actionText, styles.rejectText]}>
          {rejectLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },

  actionButton: {
    flex: 1,
    minHeight: 94,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  acceptButton: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },

  rejectButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  acceptIconBox: {
    backgroundColor: "#DCFCE7",
  },

  rejectIconBox: {
    backgroundColor: "#FEE2E2",
  },

  actionText: {
    fontSize: 15,
    fontWeight: "900",
  },

  acceptText: {
    color: "#15803D",
  },

  rejectText: {
    color: "#DC2626",
  },

  disabledButton: {
    opacity: 0.55,
  },
});