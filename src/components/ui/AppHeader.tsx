import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../../styles/theme";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backLabel?: string;
  onBack?: () => void;
};

export default function AppHeader({
  title,
  subtitle,
  showBackButton = false,
  backLabel = "Volver",
  onBack,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  }

  return (
    <View
      style={[
        styles.hero,
        {
          paddingTop: insets.top + 8,
        },
      ]}
    >
      {showBackButton ? (
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={10}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.white}
          />

          <Text style={styles.backButtonText}>{backLabel}</Text>
        </Pressable>
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingBottom: 52,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    marginBottom: 28,
  },

  backButtonText: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    color: colors.white,
  },

  title: {
    ...typography.pageTitle,
    color: colors.white,
  },

  subtitle: {
    marginTop: spacing.sm,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: colors.white,
    opacity: 0.95,
  },
});