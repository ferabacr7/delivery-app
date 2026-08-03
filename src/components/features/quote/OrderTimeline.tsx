import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../../../constants/theme";

import { useTranslation } from "../../../i18n/useTranslation";
import { QuoteStatusType } from "../../../presentation/QuoteViewModel";

import Card from "../../ui/Card";

type TimelineStep = {
  key: QuoteStatusType;
  label: string;
};

type Props = {
  currentStatus: QuoteStatusType;
};

export default function OrderTimeline({ currentStatus }: Props) {
  const { t } = useTranslation();

  const isRejected = currentStatus === "rejected";
  const isCancelled = currentStatus === "cancelled";
  const isExpired = currentStatus === "expired";

  /*
   * Timeline simplificado para el cliente.
   *
   * Estados internos:
   * VALIDATION / QUOTED
   * ACCEPTED / IN_PROGRESS
   * ON_ROUTE
   * DELIVERED
   *
   * Estados visuales:
   * En revisión
   * Confirmado
   * En camino
   * Entregado
   */
  const normalSteps: TimelineStep[] = [
    {
      key: "validation",
      label: t("orderStatus.validation"),
    },
    {
      key: "accepted",
      label: t("orderStatus.accepted"),
    },
    {
      key: "on_route",
      label: t("orderStatus.onRoute"),
    },
    {
      key: "delivered",
      label: t("orderStatus.delivered"),
    },
  ];

  const rejectedSteps: TimelineStep[] = [
    {
      key: "validation",
      label: t("orderStatus.validation"),
    },
    {
      key: "quoted",
      label: t("orderStatus.quoted"),
    },
    {
      key: "rejected",
      label: t("orderStatus.rejected"),
    },
  ];

  const cancelledSteps: TimelineStep[] = [
    {
      key: "validation",
      label: t("orderStatus.validation"),
    },
    {
      key: "accepted",
      label: t("orderStatus.accepted"),
    },
    {
      key: "cancelled",
      label: t("orderStatus.cancelled"),
    },
  ];

  const expiredSteps: TimelineStep[] = [
    {
      key: "validation",
      label: t("orderStatus.validation"),
    },
    {
      key: "quoted",
      label: t("orderStatus.quoted"),
    },
    {
      key: "expired",
      label: t("orderStatus.expired"),
    },
  ];

  const steps = isRejected
    ? rejectedSteps
    : isCancelled
      ? cancelledSteps
      : isExpired
        ? expiredSteps
        : normalSteps;

  const currentIndex = getCurrentIndex(currentStatus, steps);

  const hasFinalErrorState = isRejected || isCancelled || isExpired;

  return (
    <Card>
      <Text style={styles.title}>{t("orderDetail.currentStatus")}</Text>

      <View style={styles.timeline}>
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isActive = index <= currentIndex;

          const isFinalErrorStep =
            hasFinalErrorState && index === steps.length - 1;

          return (
            <View key={step.key} style={styles.step}>
              <View
                style={[
                  styles.dot,
                  getDotStyle(step.key, isActive, isFinalErrorStep),
                ]}
              >
                {isCompleted ? (
                  <Text style={styles.check}>✓</Text>
                ) : isCurrent ? (
                  <View style={styles.currentDot} />
                ) : null}
              </View>

              <Text
                style={[
                  styles.stepLabel,
                  isActive ? styles.stepLabelActive : styles.stepLabelInactive,
                  isFinalErrorStep && styles.stepLabelDanger,
                ]}
              >
                {step.label}
              </Text>

              {index < steps.length - 1 ? (
                <View
                  style={[
                    styles.line,
                    index < currentIndex
                      ? styles.lineActive
                      : styles.lineInactive,
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

function getCurrentIndex(status: QuoteStatusType, steps: TimelineStep[]) {
  /*
   * Convierte los estados internos del sistema
   * en las cuatro etapas visuales del cliente.
   */
  const statusMap: Partial<Record<QuoteStatusType, QuoteStatusType>> = {
    pending: "validation",
    validation: "validation",
    quoted: "validation",

    accepted: "accepted",
    in_progress: "accepted",

    on_route: "on_route",
    delivered: "delivered",

    rejected: "rejected",
    cancelled: "cancelled",
    expired: "expired",
  };

  const normalizedStatus = statusMap[status] ?? "validation";

  const index = steps.findIndex((step) => step.key === normalizedStatus);

  if (index >= 0) {
    return index;
  }

  return 0;
}

function getDotStyle(
  key: QuoteStatusType,
  isActive: boolean,
  isFinalErrorStep: boolean,
) {
  if (!isActive) {
    return styles.dotInactive;
  }

  if (isFinalErrorStep) {
    return styles.dotDanger;
  }

  if (key === "validation") {
    return styles.dotValidation;
  }

  if (key === "accepted") {
    return styles.dotAccepted;
  }

  if (key === "on_route") {
    return styles.dotOnRoute;
  }

  if (key === "delivered") {
    return styles.dotDelivered;
  }

  return styles.dotActive;
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    color: colors.text,
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

  currentDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.textInverse,
  },

  check: {
    color: colors.textInverse,
    fontSize: 13,
    fontWeight: "900",
  },

  dotActive: {
    backgroundColor: colors.brand,
  },

  dotValidation: {
    backgroundColor: "#F59E0B",
  },

  dotAccepted: {
    backgroundColor: "#22C55E",
  },

  dotOnRoute: {
    backgroundColor: "#3B82F6",
  },

  dotDelivered: {
  backgroundColor: colors.brand,
},

  dotDanger: {
    backgroundColor: colors.danger,
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
    backgroundColor: "#CBD5E1",
  },

  lineInactive: {
    backgroundColor: colors.border,
  },

  stepLabel: {
    ...typography.caption,
    textAlign: "center",
    paddingHorizontal: 2,
  },

  stepLabelActive: {
    color: colors.text,
    fontWeight: "700",
  },

  stepLabelInactive: {
    color: colors.textSoft,
  },

  stepLabelDanger: {
    color: colors.danger,
  },
});
