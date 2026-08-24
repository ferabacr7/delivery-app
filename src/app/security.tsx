import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { colors } from "../styles/theme";

export default function SecurityScreen() {
  const { language } = useTranslation();

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
          {language === "es" ? "Atrás" : "Back"}
        </Text>
      </Pressable>

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons
            name="shield-checkmark-outline"
            size={28}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {language === "es"
            ? "Seguridad"
            : "Security"}
        </Text>

        <Text style={styles.subtitle}>
          {language === "es"
            ? "Administrá la seguridad y el acceso a tu cuenta."
            : "Manage your account security and access."}
        </Text>
      </View>

      <View style={styles.options}>
        <SecurityOption
          icon="lock-closed-outline"
          title={
            language === "es"
              ? "Cambiar contraseña"
              : "Change password"
          }
          subtitle={
            language === "es"
              ? "Actualizá la contraseña de tu cuenta"
              : "Update your account password"
          }
          onPress={() =>
            router.push("/change-password" as never)
          }
        />

        <SecurityOption
          icon="trash-outline"
          title={
            language === "es"
              ? "Eliminar cuenta"
              : "Delete account"
          }
          subtitle={
            language === "es"
              ? "Eliminá permanentemente tu cuenta de ORBIT"
              : "Permanently delete your ORBIT account"
          }
          onPress={() =>
            router.push("/delete-account" as never)
          }
          destructive
        />
      </View>
    </View>
  );
}

type SecurityOptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  destructive?: boolean;
};

function SecurityOption({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
}: SecurityOptionProps) {
  return (
    <Pressable
      style={styles.optionCard}
      onPress={onPress}
    >
      <View
        style={[
          styles.optionIcon,
          destructive &&
            styles.destructiveIcon,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={
            destructive
              ? "#C62828"
              : colors.primary
          }
        />
      </View>

      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionTitle,
            destructive &&
              styles.destructiveText,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.optionSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={
          destructive
            ? "#C62828"
            : colors.primary
        }
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
    width: 58,
    height: 58,
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

  destructiveIcon: {
    backgroundColor: "#FDECEC",
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

  destructiveText: {
    color: "#C62828",
  },

  optionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
});