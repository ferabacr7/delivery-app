import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import {
  getCurrentUser,
  getMyProfile,
  updateMyEmail,
  updateMyProfile,
} from "../services/authService";
import { colors } from "../styles/theme";

export default function EditProfileScreen() {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const [userResult, profileResult] = await Promise.all([
        getCurrentUser(),
        getMyProfile(),
      ]);

      if (userResult.error || !userResult.data.user) {
        Alert.alert(
          t("common.error"),
          t("profileEdit.loadError"),
        );

        router.back();
        return;
      }

      const currentEmail = userResult.data.user.email ?? "";

      setEmail(currentEmail);
      setOriginalEmail(currentEmail);

      if (profileResult.error || !profileResult.data) {
        Alert.alert(
          t("common.error"),
          t("profileEdit.loadError"),
        );
        return;
      }

      setFullName(profileResult.data.full_name ?? "");
      setPhone(profileResult.data.phone ?? "");
    } catch (error) {
      console.error("Unexpected error loading profile:", error);

      Alert.alert(
        t("common.error"),
        t("profileEdit.loadError"),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const normalizedName = fullName.trim();
    const normalizedPhone = phone.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      Alert.alert(
        t("common.error"),
        t("profileEdit.nameRequired"),
      );
      return;
    }

    if (!normalizedEmail) {
      Alert.alert(
        t("common.error"),
        t("profileEdit.emailRequired"),
      );
      return;
    }

    try {
      setSaving(true);

      const profileResult = await updateMyProfile(
        normalizedName,
        normalizedPhone,
      );

      if (profileResult.error) {
        Alert.alert(
          t("common.error"),
          profileResult.error.message,
        );
        return;
      }

      const emailChanged =
        normalizedEmail !== originalEmail.toLowerCase();

      if (emailChanged) {
        const emailResult =
          await updateMyEmail(normalizedEmail);

        if (emailResult.error) {
          Alert.alert(
            t("common.error"),
            emailResult.error.message,
          );
          return;
        }

        Alert.alert(
          t("profileEdit.savedTitle"),
          t("profileEdit.emailConfirmationMessage"),
          [
            {
              text: t("common.accept"),
              onPress: () => router.back(),
            },
          ],
        );

        return;
      }

      Alert.alert(
        t("profileEdit.savedTitle"),
        t("profileEdit.savedMessage"),
        [
          {
            text: t("common.accept"),
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.error("Unexpected error updating profile:", error);

      Alert.alert(
        t("common.error"),
        t("profileEdit.saveError"),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          {t("profileEdit.loading")}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
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
            {t("common.back")}
          </Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="person-outline"
              size={28}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>
            {t("profileEdit.title")}
          </Text>

          <Text style={styles.subtitle}>
            {t("profileEdit.subtitle")}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>
            {t("profileEdit.fullName")}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.muted}
            />

            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder={t("profileEdit.fullNamePlaceholder")}
              placeholderTextColor={colors.textSoft}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>
            {t("profileEdit.phone")}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color={colors.muted}
            />

            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder={t("profileEdit.phonePlaceholder")}
              placeholderTextColor={colors.textSoft}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>
            {t("profileEdit.email")}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.muted}
            />

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t("profileEdit.emailPlaceholder")}
              placeholderTextColor={colors.textSoft}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color={colors.primaryDark}
            />

            <Text style={styles.noticeText}>
              {t("profileEdit.emailNotice")}
            </Text>
          </View>

          <Pressable
            style={[
              styles.saveButton,
              saving && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color={colors.white}
              />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color={colors.white}
                />

                <Text style={styles.saveButtonText}>
                  {t("profileEdit.save")}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.muted,
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

  form: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    color: colors.dark,
  },

  inputContainer: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
    paddingVertical: 14,
  },

  notice: {
    marginTop: 18,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: colors.brandSoft,
  },

  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.dark,
  },

  saveButton: {
    marginTop: 26,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
});