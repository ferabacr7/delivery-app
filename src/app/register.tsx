import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
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
import { signUp } from "../services/authService";
import { colors } from "../styles/theme";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { t } = useTranslation();

  async function handleRegister() {
    if (isRegistering) {
      return;
    }

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert(
        t("register.requiredTitle"),
        t("register.requiredMessage"),
      );

      return;
    }

    try {
      setIsRegistering(true);

      const { data, error } = await signUp(
        email.trim(),
        password.trim(),
        fullName.trim(),
        phone.trim(),
      );

      if (error) {
        Alert.alert(t("register.errorTitle"), error.message);
        return;
      }

      Alert.alert(
        t("register.successTitle"),
        t("register.successMessage"),
        [
          {
            text: "OK",
            onPress: () => router.push("/"),
          },
        ],
      );
    } catch (error) {
      console.error("Unexpected register error:", error);

      Alert.alert(
        t("register.errorTitle"),
        t("common.error"),
      );
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/register2.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>
              {t("register.title")}
            </Text>

            <Text style={styles.subtitle}>
              {t("register.subtitle")}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={t("register.fullName")}
              placeholderTextColor="#8A8A8A"
              autoCapitalize="words"
              autoCorrect={false}
              value={fullName}
              onChangeText={setFullName}
              editable={!isRegistering}
            />

            <TextInput
              style={styles.input}
              placeholder={t("register.phone")}
              placeholderTextColor="#8A8A8A"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!isRegistering}
            />

            <TextInput
              style={styles.input}
              placeholder={t("register.email")}
              placeholderTextColor="#8A8A8A"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!isRegistering}
            />

            <TextInput
              style={styles.input}
              placeholder={t("register.password")}
              placeholderTextColor="#8A8A8A"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              editable={!isRegistering}
            />

            <Pressable
              style={[
                styles.button,
                isRegistering && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isRegistering}
            >
              <Text style={styles.buttonText}>
                {isRegistering
                  ? t("register.registering")
                  : t("register.registerButton")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/")}
              disabled={isRegistering}
            >
              <Text
                style={[
                  styles.link,
                  isRegistering && styles.linkDisabled,
                ]}
              >
                {t("register.backHome")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  backgroundImage: {
    position: "absolute",
    width: "125%",
    height: "125%",
    alignSelf: "center",
    top: -140,
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  overlay: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: "rgba(255,255,255,0.88)",
  },

  title: {
    marginBottom: 12,
    color: colors.dark,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginBottom: 28,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },

  input: {
    height: 58,
    marginBottom: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.60)",
    color: colors.dark,
    fontSize: 16,
  },

  button: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  link: {
    marginTop: 24,
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  linkDisabled: {
    opacity: 0.5,
  },
});