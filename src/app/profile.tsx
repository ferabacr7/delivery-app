import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useLanguage } from "../i18n/useLanguage";
import { useTranslation } from "../i18n/useTranslation";
import { getCurrentUser, getMyProfile, signOut } from "../services/authService";
import { colors } from "../styles/theme";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileStatus, setProfileStatus] = useState("");

  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    loadUser();
  }, [language]);

  async function loadUser() {
    setProfileStatus(t("profile.loading"));

    const { data, error } = await getCurrentUser();

    if (error || !data.user) {
      setProfileStatus(t("profile.noUser"));
      return;
    }

    setEmail(data.user.email ?? "");
    setUserId(data.user.id ?? "");

    const profileResult = await getMyProfile();

    if (profileResult.error) {
      setProfileStatus(t("profile.notFound"));
      return;
    }

    setProfileName(profileResult.data?.full_name ?? t("profile.noName"));
    setProfileStatus(t("profile.loaded"));
  }

  async function handleLogout() {
    await signOut();
    router.replace("/login" as never);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("profile.title")}</Text>

      <Text style={styles.label}>{t("profile.email")}:</Text>
      <Text style={styles.value}>{email || t("profile.notAvailable")}</Text>

      <Text style={styles.label}>{t("profile.userId")}:</Text>
      <Text style={styles.value}>{userId || t("profile.notAvailable")}</Text>

      <Text style={styles.label}>{t("profile.profileName")}:</Text>
      <Text style={styles.value}>
        {profileName || t("profile.notAvailable")}
      </Text>

      <Text style={styles.label}>{t("profile.status")}:</Text>
      <Text style={styles.value}>{profileStatus}</Text>

      <View style={styles.languageBox}>
        <Text style={styles.label}>{t("profile.language")}</Text>

        <View style={styles.languageButtons}>
          <Pressable
            style={[
              styles.languageButton,
              language === "es" && styles.activeLanguage,
            ]}
            onPress={() => setLanguage("es")}
          >
            <Text style={styles.languageText}>🇪🇸 {t("profile.spanish")}</Text>
          </Pressable>

          <Pressable
            style={[
              styles.languageButton,
              language === "en" && styles.activeLanguage,
            ]}
            onPress={() => setLanguage("en")}
          >
            <Text style={styles.languageText}>🇺🇸 {t("profile.english")}</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>{t("profile.logout")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 32,
  },

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.muted,
    marginTop: 16,
  },

  value: {
    fontSize: 16,
    color: colors.dark,
    marginTop: 6,
  },

  languageBox: {
    marginTop: 28,
  },

  languageButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  languageButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  activeLanguage: {
    backgroundColor: colors.softTeal,
    borderColor: colors.primary,
  },

  languageText: {
    fontWeight: "800",
    color: colors.dark,
  },

  button: {
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  buttonText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 18,
  },
});
