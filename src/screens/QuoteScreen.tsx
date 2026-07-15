import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DescriptionCard from "../components/features/quote/DescriptionCard";
import OrderTimeline from "../components/features/quote/OrderTimeline";
import PriceSummaryCard from "../components/features/quote/PriceSummaryCard";
import QuoteActions from "../components/features/quote/QuoteActions";
import SupportCard from "../components/features/quote/SupportCard";
import Card from "../components/ui/Card";
import Spacer from "../components/ui/Spacer";

import { colors, radius, spacing, typography } from "../constants/theme";
import { useTranslation } from "../i18n/useTranslation";
import { QuoteViewModel } from "../presentation/QuoteViewModel";

import TrackingCard from "../components/features/tracking/TrackingCard";

type Props = {
  quote: QuoteViewModel;
  deliveryId?: string | null;
  onAccept: () => void;
  onReject: () => void;
  isSubmitting?: boolean;
};

export default function QuoteScreen({
  quote,
  deliveryId,
  onAccept,
  onReject,
  isSubmitting = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const quoteStatus = quote.service.statusType;

  const isAccepted = quoteStatus === "accepted";
  const isRejected = quoteStatus === "rejected";

  function handleBackToOrders() {
    router.replace("/orders" as never);
  }

  function getStatusIcon(): keyof typeof Ionicons.glyphMap {
    if (isAccepted) {
      return "checkmark-circle";
    }

    if (isRejected) {
      return "close-circle";
    }

    return "time-outline";
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
        >
          <Ionicons name="arrow-back" size={22} color={colors.brand} />

          <Text style={styles.backText}>{t("common.back")}</Text>
        </Pressable>

        <View style={styles.titleRow}>
          <View style={styles.titleContent}>
            <Text style={styles.screenTitle}>
              {t("orders.order")} #{quote.orderNumber}
            </Text>

            <Text style={styles.screenSubtitle}>{quote.header.subtitle}</Text>
          </View>

          <View style={styles.statusBadge}>
            <Ionicons
              name={getStatusIcon()}
              size={16}
              color={colors.brandDark}
            />

            <Text style={styles.statusBadgeText} numberOfLines={2}>
              {quote.service.statusLabel}
            </Text>
          </View>
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

              <Text style={styles.serviceDescription} numberOfLines={2}>
                {quote.service.description}
              </Text>
            </View>

            <View style={styles.totalInformation}>
              <Text style={styles.totalAmount}>{quote.pricing.total}</Text>

              <Text style={styles.totalLabel}>{quote.pricing.totalLabel}</Text>
            </View>
          </View>
        </Card>

        <Spacer size="lg" />

        <OrderTimeline currentStatus={quote.service.statusType} />

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
          updatedText={t("orderDetail.updatedRecently")}
          eta={
            quote.service.statusType === "accepted"
              ? t("orderDetail.estimatedMinutes")
              : t("orderDetail.pendingEstimate")
          }
          updatedAt={
            quote.service.statusType === "accepted"
              ? t("orderDetail.updatedRecently")
              : t("orderDetail.notAvailable")
          }
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
        />

        <Spacer size="lg" />

        <SupportCard phoneNumber="50688888888" />

        <Spacer size="xl" />

        <QuoteActions
          acceptLabel={quote.actions.acceptLabel}
          rejectLabel={quote.actions.rejectLabel}
          canRespond={quote.actions.canRespond}
          isSubmitting={isSubmitting}
          onAccept={onAccept}
          onReject={onReject}
        />
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

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  titleContent: {
    flex: 1,
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

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
    maxWidth: 145,
  },

  statusBadgeText: {
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    color: colors.brandDark,
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

  serviceDescription: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  totalInformation: {
    alignItems: "flex-end",
  },

  totalAmount: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: "900",
  },

  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
