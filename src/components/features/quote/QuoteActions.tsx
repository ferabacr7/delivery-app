import React from "react";
import { View } from "react-native";

import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import Spacer from "../../ui/Spacer";

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
    <View>
      <PrimaryButton
        title={acceptLabel}
        onPress={onAccept}
        disabled={isSubmitting}
      />

      <Spacer size="sm" />

      <SecondaryButton
        title={rejectLabel}
        onPress={onReject}
        disabled={isSubmitting}
      />
    </View>
  );
}