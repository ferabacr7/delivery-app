import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../../../constants/theme";

import Card from "../../ui/Card";
import InfoRow from "../../ui/InfoRow";
import SupportCard from "./SupportCard";

type Props = {
  title: string;

  subtotalLabel: string;
  subtotal: string;

  deliveryFeeLabel: string;
  deliveryFee: string;

  totalLabel: string;
  total: string;

  paymentMethod?: string | null;

  estimatedPurchaseLabel?: string;
  estimatedPurchaseAmount?: string | null;
  purchaseDetail?: string;

  deliveryServiceLabel?: string;
  serviceTypeFeeLabel?: string;

  viewDetailLabel?: string;
  hideDetailLabel?: string;

  foodPaymentStatusLabel?: string;
  foodPaymentStatus?: string | null;

  courierPaymentStatusLabel?: string;
  courierPaymentStatus?: string | null;

  supportPhoneNumber?: string;

  
};

export default function PriceSummaryCard({
  title,

  subtotalLabel,
  subtotal,

  deliveryFeeLabel,
  deliveryFee,

  totalLabel,
  total,

  paymentMethod,

  estimatedPurchaseLabel,
  estimatedPurchaseAmount,
  purchaseDetail,

  deliveryServiceLabel = "Delivery service",
  serviceTypeFeeLabel = "Service fee",

  viewDetailLabel = "View detail",
  hideDetailLabel = "Hide detail",

  foodPaymentStatusLabel,
  foodPaymentStatus,

  courierPaymentStatusLabel,
  courierPaymentStatus,

  supportPhoneNumber="50688888888"

}: Props) {
  const [showPurchaseDetail, setShowPurchaseDetail] = useState(false);
  const [showDeliveryDetail, setShowDeliveryDetail] = useState(false);

  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      {foodPaymentStatus ? (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{foodPaymentStatusLabel}</Text>

          <Text style={styles.infoValue}>{foodPaymentStatus}</Text>
        </View>
      ) : null}

      {courierPaymentStatus ? (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{courierPaymentStatusLabel}</Text>

          <Text style={styles.infoValue}>{courierPaymentStatus}</Text>
        </View>
      ) : null}

      {paymentMethod ? (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery payment method</Text>

          <Text style={styles.infoValue}>{paymentMethod}</Text>
        </View>
      ) : null}

      {estimatedPurchaseAmount ? (
        <View style={styles.section}>
          <View style={styles.amountRow}>
            <View style={styles.amountInformation}>
              <Text style={styles.amountLabel}>{estimatedPurchaseLabel}</Text>

              <Text style={styles.purchaseAmount}>
                {estimatedPurchaseAmount}
              </Text>
            </View>

            <Pressable
              style={styles.miniDetailButton}
              onPress={() => setShowPurchaseDetail((current) => !current)}
              accessibilityRole="button"
              accessibilityState={{
                expanded: showPurchaseDetail,
              }}
            >
              <Text style={styles.miniDetailButtonText}>
                {showPurchaseDetail ? hideDetailLabel : viewDetailLabel}
              </Text>

              <Ionicons
                name={
                  showPurchaseDetail
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={16}
                color={colors.brandDark}
              />
            </Pressable>
          </View>

          {showPurchaseDetail && purchaseDetail ? (
            <View style={styles.purchaseNotice}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={colors.brandDark}
              />

              <Text style={styles.purchaseNoticeText}>
                {purchaseDetail}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.amountRow}>
          <View style={styles.amountInformation}>
            <Text style={styles.amountLabel}>{deliveryServiceLabel}</Text>

            <Text style={styles.deliveryAmount}>{total}</Text>
          </View>

          <Pressable
            style={styles.miniDetailButton}
            onPress={() => setShowDeliveryDetail((current) => !current)}
            accessibilityRole="button"
            accessibilityState={{
              expanded: showDeliveryDetail,
            }}
          >
            <Text style={styles.miniDetailButtonText}>
              {showDeliveryDetail ? hideDetailLabel : viewDetailLabel}
            </Text>

            <Ionicons
              name={
                showDeliveryDetail
                  ? "chevron-up-outline"
                  : "chevron-down-outline"
              }
              size={16}
              color={colors.brandDark}
            />
          </Pressable>
        </View>

        {showDeliveryDetail ? (
          <View style={styles.deliveryDetail}>
            <InfoRow label={serviceTypeFeeLabel} value={subtotal} />

            <InfoRow label={deliveryFeeLabel} value={deliveryFee} />

            <View style={styles.divider} />

            <InfoRow
              label={totalLabel}
              value={total}
              labelStyle={styles.detailTotalLabel}
              valueStyle={styles.detailTotalValue}
            />
          </View>
        ) : null}
      </View>

      {supportPhoneNumber ? (
        <View style={styles.supportSection}>
          <SupportCard phoneNumber={supportPhoneNumber} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  infoLabel: {
    ...typography.body,
    flex: 1,
    color: colors.textMuted,
  },

  infoValue: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    fontWeight: "800",
    textAlign: "right",
  },

  section: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  amountInformation: {
    flex: 1,
  },

  amountLabel: {
    ...typography.body,
    color: colors.textMuted,
  },

  purchaseAmount: {
    marginTop: spacing.xs,
    ...typography.body,
    color: colors.text,
    fontWeight: "800",
  },

  deliveryAmount: {
    marginTop: spacing.xs,
    ...typography.body,
    color: colors.text,
    fontWeight: "800",
  },

  miniDetailButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
  },

  miniDetailButtonText: {
    ...typography.caption,
    color: colors.brandDark,
    fontWeight: "700",
  },

  purchaseNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSoft,
  },

  purchaseNoticeText: {
    ...typography.caption,
    flex: 1,
    color: colors.textMuted,
    lineHeight: 19,
  },

  deliveryDetail: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  detailTotalLabel: {
    fontWeight: "800",
    color: colors.text,
  },

  detailTotalValue: {
    fontWeight: "900",
    color: colors.brandDark,
  },

  supportSection: {
    marginTop: spacing.sm,
  },
});