import { router } from "expo-router";
import { useState } from "react";
import {
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
import { createAddress } from "../services/addressService";
import { colors } from "../styles/theme";

export default function MyAddressScreen() {
  const [label, setLabel] = useState("Casa");
  const [addressLine, setAddressLine] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  async function handleSaveAddress() {
    const trimmedLabel = label.trim();
    const trimmedAddress = addressLine.trim();
    const trimmedReference = reference.trim();

    if (!trimmedLabel) {
      Alert.alert(
        t("common.error"),
        t("addressForm.nameRequired"),
      );
      return;
    }

    if (!trimmedAddress) {
      Alert.alert(
        t("common.error"),
        t("addressForm.addressRequired"),
      );
      return;
    }

    try {
      setLoading(true);

      const { error } = await createAddress({
        label: trimmedLabel,
        addressLine: trimmedAddress,
        reference: trimmedReference,
        isDefault: true,
      });

      if (error) {
        Alert.alert(t("common.error"), error.message);
        return;
      }

      Alert.alert(
        t("addressForm.savedTitle"),
        t("addressForm.savedMessage"),
      );

      router.replace("/my-addresses" as never);
    } catch (error) {
      console.error("Unexpected error saving address:", error);

      Alert.alert(
        t("common.error"),
        t("addressForm.saveError"),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    router.replace("/my-addresses" as never);
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
          onPress={handleBack}
          hitSlop={10}
        >
          <Text style={styles.back}>
            ← {t("common.back")}
          </Text>
        </Pressable>

        <Text style={styles.title}>
          {t("addressForm.title")}
        </Text>

        <Text style={styles.subtitle}>
          {t("addressForm.subtitle")}
        </Text>

        <Text style={styles.label}>
          {t("addressForm.labelName")}
        </Text>

        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder={t("addressForm.placeholderLabel")}
          placeholderTextColor={colors.muted}
          returnKeyType="next"
        />

        <Text style={styles.label}>
          {t("addressForm.address")}
        </Text>

        <TextInput
          style={styles.textArea}
          value={addressLine}
          onChangeText={setAddressLine}
          placeholder={t("addressForm.placeholderAddress")}
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          blurOnSubmit
        />

        <Text style={styles.label}>
          {t("addressForm.reference")}
        </Text>

        <TextInput
          style={styles.textArea}
          value={reference}
          onChangeText={setReference}
          placeholder={t("addressForm.placeholderReference")}
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          returnKeyType="done"
          blurOnSubmit
        />

        <Pressable
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSaveAddress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? t("addressForm.saving")
              : t("addressForm.save")}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
  },

  back: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  title: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: "900",
    color: colors.primary,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },

  label: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    color: colors.dark,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark,
    backgroundColor: colors.white,
  },

  textArea: {
    minHeight: 92,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: colors.dark,
    backgroundColor: colors.white,
    textAlignVertical: "top",
  },

  button: {
    marginTop: 28,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
});