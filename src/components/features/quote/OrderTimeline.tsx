import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Card from "../../ui/Card";
import { colors, radius, spacing, typography } from "../../../constants/theme";
import { QuoteStatusType } from "../../../presentation/QuoteViewModel";

type TimelineStep = {
  key: string;
  label: string;
};

type Props = {
  currentStatus: QuoteStatusType;
};

const normalSteps: TimelineStep[] = [
  { key: "pending", label: "Pendiente" },
  { key: "accepted", label: "Aceptada" },
  { key: "on_route", label: "En ruta" },
  { key: "delivered", label: "Entregado" },
];

const rejectedSteps: TimelineStep[] = [
  { key: "pending", label: "Pendiente" },
  { key: "rejected", label: "Rechazada" },
];

export default function OrderTimeline({ currentStatus }: Props) {
  const isRejected = currentStatus === "rejected";
  const steps = isRejected ? rejectedSteps : normalSteps;
  const currentIndex = getCurrentIndex(currentStatus);

  return (
    <Card>
      <Text style={styles.title}>Estado del pedido</Text>

      <View style={styles.timeline}>
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isActive = index <= currentIndex;

          return (
            <View key={step.key} style={styles.step}>
              <View
                style={[
                  styles.dot,
                  getDotStyle(step.key, isActive, isCurrent, isRejected),
                ]}
              >
                {isActive ? <Text style={styles.check}>✓</Text> : null}
              </View>

              <Text
                style={[
                  styles.stepLabel,
                  isActive ? styles.stepLabelActive : styles.stepLabelInactive,
                ]}
              >
                {step.label}
              </Text>

              {index < steps.length - 1 ? (
                <View
                  style={[
                    styles.line,
                    isActive ? styles.lineActive : styles.lineInactive,
                    isRejected && styles.lineRejected,
                  ]}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function getCurrentIndex(status: QuoteStatusType) {
  if (status === "pending") return 0;
  if (status === "accepted") return 1;
  if (status === "rejected") return 1;

  return 0;
}

function getDotStyle(
  key: string,
  isActive: boolean,
  isCurrent: boolean,
  isRejected: boolean,
) {
  if (!isActive) return styles.dotInactive;
  if (isRejected && key === "rejected") return styles.dotRejected;
  if (key === "pending") return styles.dotPending;
  if (key === "accepted") return styles.dotAccepted;
  if (key === "on_route") return styles.dotOnRoute;
  if (key === "delivered") return styles.dotDelivered;

  return styles.dotActive;
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
  },

  timeline: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  step: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },

  dot: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  check: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  dotActive: {
    backgroundColor: colors.brand,
  },

  dotPending: {
    backgroundColor: colors.warning,
  },

  dotAccepted: {
    backgroundColor: colors.success,
  },

  dotRejected: {
    backgroundColor: colors.danger,
  },

  dotOnRoute: {
    backgroundColor: colors.brand,
  },

  dotDelivered: {
    backgroundColor: colors.success,
  },

  dotInactive: {
    backgroundColor: colors.border,
  },

  line: {
    position: "absolute",
    top: 11,
    left: "50%",
    right: "-50%",
    height: 2,
    zIndex: 1,
  },

  lineActive: {
    backgroundColor: colors.brand,
  },

  lineRejected: {
    backgroundColor: colors.danger,
  },

  lineInactive: {
    backgroundColor: colors.border,
  },

  stepLabel: {
    ...typography.caption,
    textAlign: "center",
  },

  stepLabelActive: {
    color: colors.text,
    fontWeight: "700",
  },

  stepLabelInactive: {
    color: colors.textSoft,
  },
});
