import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import AppHeader from "../components/ui/AppHeader";
import Spacer from "../components/ui/Spacer";

import QuoteDetailsCard from "../components/features/quote/QuoteDetailsCard";
import PriceSummaryCard from "../components/features/quote/PriceSummaryCard";
import CustomerMessageCard from "../components/features/quote/CustomerMessageCard";
import QuoteActions from "../components/features/quote/QuoteActions";

import { colors, spacing } from "../constants/theme";
import { QuoteViewModel } from "../presentation/QuoteViewModel";

type Props = {
  quote: QuoteViewModel;
  onAccept: () => void;
  onReject: () => void;
  isSubmitting?: boolean;
};

export default function QuoteScreen({
  quote,
  onAccept,
  onReject,
  isSubmitting = false,
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title={quote.header.title}
          subtitle={quote.header.subtitle}
        />

        <Spacer size="lg" />

        <QuoteDetailsCard
          title={quote.service.title}
          description={quote.service.description}
          statusLabel={quote.service.statusLabel}
          statusTone={quote.service.statusTone}
          locationTitle={quote.location.title}
          address={quote.location.address}
          reference={quote.location.reference}
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

        <CustomerMessageCard
          title={quote.customerMessage.title}
          message={quote.customerMessage.message}
        />

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
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});