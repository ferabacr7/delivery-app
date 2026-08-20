import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OrderTimeline from "../components/features/quote/OrderTimeline";
import PriceSummaryCard from "../components/features/quote/PriceSummaryCard";
import QuoteActions from "../components/features/quote/QuoteActions";
import TrackingCard from "../components/features/tracking/TrackingCard";
import Card from "../components/ui/Card";
import Spacer from "../components/ui/Spacer";

import { colors, radius, spacing, typography } from "../constants/theme";

import { useTranslation } from "../i18n/useTranslation";
import { QuoteViewModel } from "../presentation/QuoteViewModel";

type Props = {
  quote: QuoteViewModel;
  deliveryId?: string | null;
  onAccept: () => void;
  onReject: () => void;
  onCancelOrder?: () => void;
  canCancelOrder?: boolean;
  isSubmitting?: boolean;
};

export default function QuoteScreen({
  quote,
  deliveryId,
  onAccept,
  onReject,
  onCancelOrder,
  canCancelOrder = false,
  isSubmitting = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const normalizedStatus = String(quote.service.statusType)
    .trim()
    .toUpperCase();

  const shouldShowTracking =
    normalizedStatus !== "REJECTED" && normalizedStatus !== "CANCELLED";

  function handleBackToOrders() {
    router.replace("/orders" as never);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={handleBackToOrders}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
        >
          <Ionicons name="arrow-back" size={22} color={colors.brand} />

          <Text style={styles.backText}>{t("common.back")}</Text>
        </Pressable>

        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>
            {t("orders.order")} #{quote.orderNumber}
          </Text>

          <Text style={styles.screenSubtitle}>{quote.header.subtitle}</Text>
        </View>

        <Card>
          <View style={styles.serviceSummary}>
            <View style={styles.serviceIcon}>
              <Ionicons
                name="bag-handle-outline"
                size={28}
                color={colors.brand}
              />
            </View>

            <View style={styles.serviceInformation}>
              <Text style={styles.serviceLabel}>{quote.service.title}</Text>

              <Text style={styles.serviceValue}>{quote.service.type}</Text>
            </View>

            <View style={styles.totalInformation}>
              <Text style={styles.totalAmount}>{quote.pricing.total}</Text>

              <Text style={styles.totalLabel}>{quote.pricing.totalLabel}</Text>
            </View>
          </View>
        </Card>

        <Spacer size="lg" />

        <QuoteActions
          acceptLabel={quote.actions.acceptLabel}
          rejectLabel={quote.actions.rejectLabel}
          canRespond={quote.actions.canRespond}
          isSubmitting={isSubmitting}
          onAccept={onAccept}
          onReject={onReject}
        />

        {quote.actions.canRespond ? <Spacer size="lg" /> : null}

        <OrderTimeline currentStatus={quote.service.statusType} />

        {shouldShowTracking ? (
          <>
            <Spacer size="lg" />

            <TrackingCard
              deliveryId={deliveryId}
              status={quote.service.statusType}
              latitude={quote.location.latitude}
              longitude={quote.location.longitude}
              trackingTitle={t("orderDetail.trackingTitle")}
              waitingText={t("orderDetail.trackingWaiting")}
              activeText={t("orderDetail.trackingLive")}
              unavailableText={t("orderDetail.trackingUnavailable")}
              eta={quote.tracking.estimatedArrival}
              etaLabel={quote.tracking.estimatedArrivalLabel}
            />
          </>
        ) : null}

        <Spacer size="lg" />

        <Card>
          <Text style={styles.orderDetailsTitle}>
            {t("orderDetail.orderDetails")}
          </Text>

          {quote.orderDetails.pickupLocation ? (
            <View style={styles.orderDetailsRow}>
              <Text style={styles.orderDetailsLabel}>
                {t("orderDetail.pickupLocation")}
              </Text>

              <Text style={styles.orderDetailsValue}>
                {quote.orderDetails.pickupLocation}
              </Text>
            </View>
          ) : null}

          {quote.orderDetails.courierWeight ? (
            <View style={styles.orderDetailsRow}>
              <Text style={styles.orderDetailsLabel}>
                {t("orderDetail.courierWeight")}
              </Text>

              <Text style={styles.orderDetailsValue}>
                {quote.orderDetails.courierWeight
                  ? quote.orderDetails.courierWeight.charAt(0).toUpperCase() +
                    quote.orderDetails.courierWeight.slice(1).toLowerCase()
                  : ""}
              </Text>
            </View>
          ) : null}

          <View style={styles.descriptionSection}>
            <Text style={styles.orderDetailsLabel}>
              {t("orderDetail.description")}
            </Text>

            <Text style={styles.descriptionValue}>
              {quote.service.description}
            </Text>
          </View>

          {canCancelOrder && onCancelOrder ? (
            <>
              <Spacer size="lg" />

              <Pressable
                style={[
                  styles.cancelOrderButton,
                  isSubmitting && styles.cancelOrderButtonDisabled,
                ]}
                onPress={onCancelOrder}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={t("orderDetail.cancelOrder")}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={21}
                  color="#DC2626"
                />

                <Text style={styles.cancelOrderButtonText}>
                  {t("orderDetail.cancelOrder")}
                </Text>
              </Pressable>
            </>
          ) : null}
        </Card>

        <Spacer size="lg" />

        <PriceSummaryCard
          title={quote.pricing.title}
          subtotalLabel={quote.pricing.subtotalLabel}
          subtotal={quote.pricing.subtotal}
          deliveryFeeLabel={quote.pricing.deliveryFeeLabel}
          deliveryFee={quote.pricing.deliveryFee}
          totalLabel={quote.pricing.totalLabel}
          total={quote.pricing.total}
          paymentMethod={
            quote.orderDetails.paymentMethod === "CASH"
              ? t("orderDetail.cash")
              : quote.orderDetails.paymentMethod
          }
          estimatedPurchaseLabel={t("orderDetail.estimatedPurchaseAmount")}
          estimatedPurchaseAmount={quote.purchaseValidation.amount}
          purchaseDetail={t("orderDetail.purchaseDetail")}
          deliveryServiceLabel={t("orderDetail.deliveryService")}
          serviceTypeFeeLabel={t("orderDetail.serviceTypeFee")}
          viewDetailLabel={t("orderDetail.viewDetail")}
          hideDetailLabel={t("orderDetail.hideDetail")}
          foodPaymentStatusLabel={t("orderDetail.paymentStatusLabel")}
          foodPaymentStatus={quote.purchaseValidation.paymentStatus}
          courierPaymentStatusLabel={t("orderDetail.courierPaymentStatusLabel")}
          courierPaymentStatus={quote.orderDetails.courierPaymentStatus}
          supportPhoneNumber="50688888888"
        />

        <Spacer size="xl" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },

  backText: {
    ...typography.body,
    color: colors.brand,
    fontWeight: "700",
  },

  titleSection: {
    marginBottom: spacing.lg,
  },

  screenTitle: {
    ...typography.pageTitle,
    color: colors.text,
  },

  screenSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  serviceSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  serviceIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandSoft,
  },

  serviceInformation: {
    flex: 1,
  },

  serviceLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },

  serviceValue: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: 2,
  },

  totalInformation: {
    alignItems: "flex-end",
    maxWidth: 125,
  },

  totalAmount: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: "900",
    textAlign: "right",
  },

  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "right",
  },

  orderDetailsTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },

  descriptionSection: {
    paddingBottom: spacing.md,
  },

  descriptionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  descriptionValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
    lineHeight: 22,
  },

  orderDetailsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  orderDetailsLabel: {
    ...typography.body,
    flex: 1,
    color: colors.textMuted,
  },

  orderDetailsValue: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    fontWeight: "700",
    textAlign: "right",
  },

  orderDetailsAmount: {
    ...typography.subtitle,
    color: colors.brandDark,
    fontWeight: "900",
    textAlign: "right",
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

  paymentBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
  },

  paymentBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.brandDark,
  },

  cancelOrderButton: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,

    borderTopWidth: 1,
    borderTopColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: spacing.xs,
  },

  cancelOrderButtonDisabled: {
    opacity: 0.5,
  },

  cancelOrderButtonText: {
    ...typography.caption,
    color: "#DC2626",
    fontWeight: "700",
  },
});
