import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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
  updateMyPassword,
  verifyCurrentPassword,
} from "../services/authService";
import { colors } from "../styles/theme";

export default function ChangePasswordScreen() {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [saving, setSaving] = useState(false);

  async function handleChangePassword() {
    if (!currentPassword) {
      Alert.alert(
        t("common.error"),
        t("passwordChange.currentPasswordRequired"),
      );
      return;
    }

    if (!password) {
      Alert.alert(
        t("common.error"),
        t("passwordChange.passwordRequired"),
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        t("common.error"),
        t("passwordChange.passwordLength"),
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t("common.error"),
        t("passwordChange.passwordMismatch"),
      );
      return;
    }

    if (currentPassword === password) {
      Alert.alert(
        t("common.error"),
        t("passwordChange.samePassword"),
      );
      return;
    }

    try {
      setSaving(true);

      const verificationResult =
        await verifyCurrentPassword(currentPassword);

      if (verificationResult.error) {
        Alert.alert(
          t("common.error"),
          t("passwordChange.currentPasswordInvalid"),
        );
        return;
      }

      const result = await updateMyPassword(password);

      if (result.error) {
        Alert.alert(
          t("common.error"),
          result.error.message,
        );
        return;
      }

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");

      Alert.alert(
        t("passwordChange.successTitle"),
        t("passwordChange.successMessage"),
        [
          {
            text: t("common.accept"),
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.error(
        "Unexpected error changing password:",
        error,
      );

      Alert.alert(
        t("common.error"),
        t("passwordChange.saveError"),
      );
    } finally {
      setSaving(false);
    }
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
              name="lock-closed-outline"
              size={28}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>
            {t("passwordChange.title")}
          </Text>

          <Text style={styles.subtitle}>
            {t("passwordChange.subtitle")}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>
            {t("passwordChange.currentPassword")}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="key-outline"
              size={20}
              color={colors.muted}
            />

            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder={t(
                "passwordChange.currentPasswordPlaceholder",
              )}
              placeholderTextColor={colors.textSoft}
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Pressable
              onPress={() =>
                setShowCurrentPassword(
                  (current) => !current,
                )
              }
              hitSlop={10}
            >
              <Ionicons
                name={
                  showCurrentPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color={colors.muted}
              />
            </Pressable>
          </View>

          <Text style={styles.label}>
            {t("passwordChange.newPassword")}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.muted}
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={t(
                "passwordChange.newPasswordPlaceholder",
              )}
              placeholderTextColor={colors.textSoft}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Pressable
              onPress={() =>
                setShowPassword((current) => !current)
              }
              hitSlop={10}
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color={colors.muted}
              />
            </Pressable>
          </View>

          <Text style={styles.label}>
            {t("passwordChange.confirmPassword")}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.muted}
            />

            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t(
                "passwordChange.confirmPasswordPlaceholder",
              )}
              placeholderTextColor={colors.textSoft}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Pressable
              onPress={() =>
                setShowConfirmPassword(
                  (current) => !current,
                )
              }
              hitSlop={10}
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color={colors.muted}
              />
            </Pressable>
          </View>

          <View style={styles.notice}>
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color={colors.primaryDark}
            />

            <Text style={styles.noticeText}>
              {t("passwordChange.securityNotice")}
            </Text>
          </View>

          <Pressable
            style={[
              styles.saveButton,
              saving && styles.buttonDisabled,
            ]}
            onPress={handleChangePassword}
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
                  name="lock-closed-outline"
                  size={21}
                  color={colors.white}
                />

                <Text style={styles.saveButtonText}>
                  {t("passwordChange.button")}
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