import React from "react";
import { View } from "react-native";

import { spacing } from "../../constants/theme";

type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl";

type Props = {
  size?: SpacerSize;
};

export default function Spacer({ size = "md" }: Props) {
  return <View style={{ height: spacing[size] }} />;
}