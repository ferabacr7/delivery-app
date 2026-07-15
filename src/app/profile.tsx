import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BottomNavigation from "../components/ui/BottomNavigation";
import { useLanguage } from "../i18n/useLanguage";
import { useTranslation } from "../i18n/useTranslation";
import { getCurrentUser, getMyProfile, signOut } from "../services/authService";
import { colors } from "../styles/theme";

const profileDeliveryBg = require("../images/profile-delivery-bg.png");

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [profileName, setProfileName] = useState("");

  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    loadUser();
  }, [language]);

  async function loadUser() {
    const { data, error } = await getCurrentUser();

    if (error || !data.user) {
      setEmail("");
      setProfileName(t("profile.noUser"));
      return;
    }

    setEmail(data.user.email ?? "");

    const profileResult = await getMyProfile();

    if (profileResult.error) {
      setProfileName(t("profile.noName"));
      return;
    }

    setProfileName(profileResult.data?.full_name ?? t("profile.noName"));
  }

  async function handleLogout() {
    await signOut();
    router.replace("/login" as never);
  }

  function handleToggleLanguage() {
    setLanguage(language === "es" ? "en" : "es");
  }

  function getInitials() {
    const source = profileName || email || "Usuario Delivery";

    const words = source.trim().split(" ").filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return source.charAt(0).toUpperCase();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <View style={styles.backgroundDecoration}>
            <View style={styles.bgCircleOne} />
            <View style={styles.bgCircleTwo} />
            <View style={styles.bgCircleThree} />

            <Ionicons
              name="car-outline"
              size={132}
              color="rgba(20, 184, 166, 0.12)"
              style={styles.bgVehicle}
            />

            <Ionicons
              name="navigate-outline"
              size={42}
              color="rgba(20, 184, 166, 0.12)"
              style={styles.bgNavigate}
            />
          </View>

          <View style={styles.heroTopRow}>
            <Pressable style={styles.iconButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </Pressable>

            <Pressable
              style={styles.languageButton}
              onPress={handleToggleLanguage}
            >
              <Ionicons name="globe-outline" size={20} color={colors.primary} />
              <Text style={styles.languageButtonText}>
                {language === "es" ? "ES" : "EN"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profileName || t("profile.notAvailable")}
              </Text>

              <Text style={styles.profileEmail}>
                {email || t("profile.notAvailable")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.illustrationArea}>
          <Image
            source={profileDeliveryBg}
            style={styles.illustrationImage}
            resizeMode="cover"
          />

          <View style={styles.illustrationOverlay} />
        </View>

        <View style={styles.flexSpacer} />

        <View style={styles.bottomContent}>
          <ProfileOption
            icon="location-outline"
            title={t("profile.myAddress")}
            subtitle={t("profile.myAddressSubtitle")}
            onPress={() => router.push("/my-addresses" as never)}
          />

          <ProfileOption
            icon="information-circle-outline"
            title={t("profile.aboutApp")}
            subtitle={t("profile.aboutAppSubtitle")}
            onPress={() => {}}
          />

          <ProfileOption
            icon="headset-outline"
            title={t("profile.contactSupport")}
            subtitle={t("profile.contactSupportSubtitle")}
            onPress={() => {}}
          />

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
            <Text style={styles.logoutButtonText}>{t("profile.logout")}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNavigation active="profile" />
    </View>
  );
}

type ProfileOptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function ProfileOption({ icon, title, subtitle, onPress }: ProfileOptionProps) {
  return (
    <Pressable style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIconBox}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>

        <View style={styles.optionTextBlock}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={22} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFA",
    position: "relative",
  },

  content: {
    flexGrow: 1,
    paddingBottom: 118,
  },

  hero: {
    paddingTop: 42,
    paddingHorizontal: 24,
    paddingBottom: 8,
    position: "relative",
  },

  backgroundDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 206,
    backgroundColor: "#F2FBFA",
    overflow: "hidden",
  },

  bgCircleOne: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(20, 184, 166, 0.08)",
    top: -64,
    right: -42,
  },

  bgCircleTwo: {
    position: "absolute",
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: "rgba(20, 184, 166, 0.07)",
    bottom: -58,
    left: -42,
  },

  bgCircleThree: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(20, 184, 166, 0.05)",
    top: 78,
    left: 132,
  },

  bgVehicle: {
    position: "absolute",
    right: 18,
    bottom: 22,
  },

  bgNavigate: {
    position: "absolute",
    left: 34,
    top: 84,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    zIndex: 2,
  },

  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  languageButton: {
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  languageButtonText: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    zIndex: 2,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    borderWidth: 5,
    borderColor: colors.softTeal,
  },

  avatarText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "900",
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.dark,
  },

  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    color: colors.muted,
  },

  illustrationArea: {
    height: 150,
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: colors.softTeal,
    position: "relative",
  },

  illustrationImage: {
    width: "100%",
    height: "100%",
    opacity: 0.92,
  },

  illustrationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },

  flexSpacer: {
    flex: 1,
    minHeight: 18,
  },

  bottomContent: {
    paddingHorizontal: 24,
  },

  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  optionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.softTeal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  optionTextBlock: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.dark,
  },

  optionSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },

  logoutButton: {
    marginTop: 4,
    height: 60,
    borderRadius: 22,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  logoutButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
});
