import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { colors } from "../styles/theme";

export default function AboutScreen() {
  const { language } = useTranslation();

  async function openPrivacyPolicy() {
    const url =
      "https://orbit-cr.com/privacy";

    const supported =
      await Linking.canOpenURL(url);

    if (!supported) {
      console.error(
        "Unable to open URL:",
        url,
      );
      return;
    }

    await Linking.openURL(url);
  }

  async function openTerms() {
    const url =
      "https://orbit-cr.com/terms";

    const supported =
      await Linking.canOpenURL(url);

    if (!supported) {
      console.error(
        "Unable to open URL:",
        url,
      );
      return;
    }

    await Linking.openURL(url);
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={colors.primary}
        />

        <Text style={styles.backText}>
          {language === "es"
            ? "Atrás"
            : "Back"}
        </Text>
      </Pressable>

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons
            name="information-circle-outline"
            size={30}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {language === "es"
            ? "Acerca de ORBIT"
            : "About ORBIT"}
        </Text>

        <Text style={styles.subtitle}>
          {language === "es"
            ? "Información legal y de privacidad de ORBIT."
            : "Legal and privacy information for ORBIT."}
        </Text>
      </View>

      <View style={styles.options}>
        <AboutOption
          icon="shield-checkmark-outline"
          title={
            language === "es"
              ? "Política de Privacidad"
              : "Privacy Policy"
          }
          subtitle={
            language === "es"
              ? "Conocé cómo protegemos y utilizamos tus datos"
              : "Learn how we protect and use your data"
          }
          onPress={() => {
            void openPrivacyPolicy();
          }}
        />

        <AboutOption
          icon="document-text-outline"
          title={
            language === "es"
              ? "Términos y Condiciones"
              : "Terms & Conditions"
          }
          subtitle={
            language === "es"
              ? "Consultá los términos de uso de ORBIT"
              : "Review ORBIT's terms of use"
          }
          onPress={() => {
            void openTerms();
          }}
        />
      </View>
    </View>
  );
}

type AboutOptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function AboutOption({
  icon,
  title,
  subtitle,
  onPress,
}: AboutOptionProps) {
  return (
    <Pressable
      style={styles.optionCard}
      onPress={onPress}
    >
      <View style={styles.optionIcon}>
        <Ionicons
          name={icon}
          size={24}
          color={colors.primary}
        />
      </View>

      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>
          {title}
        </Text>

        <Text style={styles.optionSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  backText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  header: {
    marginTop: 28,
    marginBottom: 28,
  },

  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.dark,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },

  options: {
    gap: 12,
  },

  optionCard: {
    minHeight: 86,
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },

  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  optionContent: {
    flex: 1,
    marginRight: 10,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.dark,
  },

  optionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
});