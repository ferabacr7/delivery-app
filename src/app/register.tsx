import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { signUp } from "../services/authService";
import { colors } from "../styles/theme";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { t } = useTranslation();

  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t("register.requiredTitle"), t("register.requiredMessage"));
      return;
    }

    const { data, error } = await signUp(email.trim(), password.trim());

    if (error) {
      Alert.alert(t("register.errorTitle"), error.message);
      return;
    }

    console.log("REGISTER DATA:", data);

    Alert.alert(t("register.successTitle"), t("register.successMessage"), [
      {
        text: "OK",
        onPress: () => router.push("/"),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Delivery App</Text>

      <Text style={styles.title}>{t("register.title")}</Text>

      <Text style={styles.subtitle}>{t("register.subtitle")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("register.email")}
        placeholderTextColor="#8A8A8A"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={t("register.password")}
        placeholderTextColor="#8A8A8A"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{t("register.registerButton")}</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/")}>
        <Text style={styles.link}>{t("register.backHome")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 32,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.dark,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    marginBottom: 32,
  },

  input: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    fontSize: 16,
    color: colors.dark,
    marginBottom: 16,
  },

  button: {
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  link: {
    marginTop: 24,
    textAlign: "center",
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});
