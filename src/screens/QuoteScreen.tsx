import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DescriptionCard from "../components/features/quote/DescriptionCard";
import OrderTimeline from "../components/features/quote/OrderTimeline";
import PriceSummaryCard from "../components/features/quote/PriceSummaryCard";
import QuoteActions from "../components/features/quote/QuoteActions";
import SupportCard from "../components/features/quote/SupportCard";
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

type PurchaseValidationCardProps = {
  purchaseValidation: QuoteViewModel["purchaseValidation"];
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
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.brand}
          />

          <Text style={styles.backText}>
            {t("common.back")}
          </Text>
        </Pressable>

        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>
            {t("orders.order")} #{quote.orderNumber}
          </Text>

          <Text style={styles.screenSubtitle}>
            {quote.header.subtitle}
          </Text>
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
              <Text style={styles.serviceLabel}>
                {quote.service.title}
              </Text>

              <Text style={styles.serviceValue}>
                {quote.service.type}
              </Text>
            </View>

            <View style={styles.totalInformation}>
              <Text style={styles.totalAmount}>
                {quote.pricing.total}
              </Text>

              <Text style={styles.totalLabel}>
                {quote.pricing.totalLabel}
              </Text>
            </View>
          </View>
        </Card>

        <Spacer size="lg" />

        <OrderTimeline
          currentStatus={quote.service.statusType}
        />

        <Spacer size="lg" />

        <TrackingCard
          deliveryId={deliveryId}
          status={quote.service.statusType}
          latitude={quote.location.latitude}
          longitude={quote.location.longitude}
          trackingTitle={t("orderDetail.trackingTitle")}
          waitingText={t("orderDetail.trackingWaiting")}
          activeText={t("orderDetail.trackingLive")}
          unavailableText={t(
            "orderDetail.trackingUnavailable",
          )}
          eta={quote.tracking.estimatedArrival}
          etaLabel={quote.tracking.estimatedArrivalLabel}
        />

        <Spacer size="lg" />

        <DescriptionCard
          title={t("orderDetail.description")}
          description={quote.service.description}
        />

        <Spacer size="lg" />

        <PriceSummaryCard
          title={quote.pricing.title}
          subtotalLabel={quote.pricing.subtotalLabel}
          subtotal={quote.pricing.subtotal}
          deliveryFeeLabel={quote.pricing.deliveryFeeLabel}
          deliveryFee={quote.pricing.deliveryFee}
          totalLabel={quote.pricing.totalLabel}
          total={quote.pricing.total}
          showDetailLabel={t("orderDetail.showPriceDetail")}
          hideDetailLabel={t("orderDetail.hidePriceDetail")}
        />

        {quote.purchaseValidation.shouldShow ? (
          <>
            <Spacer size="lg" />

            <PurchaseValidationCard
              purchaseValidation={quote.purchaseValidation}
            />
          </>
        ) : null}

        <Spacer size="lg" />

        <QuoteActions
          acceptLabel={quote.actions.acceptLabel}
          rejectLabel={quote.actions.rejectLabel}
          canRespond={quote.actions.canRespond}
          isSubmitting={isSubmitting}
          onAccept={onAccept}
          onReject={onReject}
        />

        {canCancelOrder && onCancelOrder ? (
  <>
    <Spacer size="md" />

    <Pressable
      style={[
        styles.cancelOrderButton,
        isSubmitting && styles.cancelOrderButtonDisabled,
      ]}
      onPress={onCancelOrder}
      disabled={isSubmitting}
      accessibilityRole="button"
      accessibilityLabel="Cancelar pedido"
    >
      <Ionicons
        name="close-circle-outline"
        size={21}
        color="#DC2626"
      />

      <Text style={styles.cancelOrderButtonText}>
        Cancelar pedido
      </Text>
    </Pressable>
  </>
) : null}

        <SupportCard phoneNumber="50688888888" />

        <Spacer size="xl" />
      </ScrollView>
    </View>
  );
}

function PurchaseValidationCard({
  purchaseValidation,
}: PurchaseValidationCardProps) {
  return (
    <Card>
      <View style={styles.purchaseHeader}>
        <View style={styles.purchaseIcon}>
          <Ionicons
            name="basket-outline"
            size={26}
            color={colors.brand}
          />
        </View>

        <View style={styles.purchaseHeaderContent}>
          <Text style={styles.purchaseTitle}>
            {purchaseValidation.title}
          </Text>
        </View>
      </View>

      {purchaseValidation.amount ? (
        <View style={styles.purchaseRow}>
          <Text style={styles.purchaseRowLabel}>
            {purchaseValidation.amountLabel}
          </Text>

          <Text style={styles.purchaseAmount}>
            {purchaseValidation.amount}
          </Text>
        </View>
      ) : null}

      {purchaseValidation.isFoodPickup &&
      purchaseValidation.paymentStatus ? (
        <View style={styles.purchaseRow}>
          <Text style={styles.purchaseRowLabel}>
            {purchaseValidation.paymentStatusLabel}
          </Text>

          <View style={styles.paymentBadge}>
            <Text style={styles.paymentBadgeText}>
              {purchaseValidation.paymentStatus}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.purchaseNotice}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={colors.brandDark}
        />

        <Text style={styles.purchaseNoticeText}>
          {purchaseValidation.helperText}
        </Text>
      </View>
    </Card>
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

  purchaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  purchaseIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandSoft,
  },

  purchaseHeaderContent: {
    flex: 1,
  },

  purchaseTitle: {
    ...typography.subtitle,
    color: colors.text,
  },

  purchaseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  purchaseRowLabel: {
    ...typography.body,
    flex: 1,
    color: colors.textMuted,
  },

  purchaseAmount: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: "900",
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

  purchaseNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.lg,
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

  cancelOrderButton: {
  width: "100%",
  minHeight: 54,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: "#DC2626",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: spacing.sm,
  backgroundColor: colors.background,
},

cancelOrderButtonDisabled: {
  opacity: 0.55,
},

cancelOrderButtonText: {
  ...typography.button,
  color: "#DC2626",
  textAlign: "center",
},
});