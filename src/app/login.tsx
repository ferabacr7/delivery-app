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
import { signIn } from "../services/authService";
import { colors } from "../styles/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { t } = useTranslation();

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t("login.requiredTitle"), t("login.requiredMessage"));
      return;
    }

    const { data, error } = await signIn(email.trim(), password.trim());

    if (error) {
      Alert.alert(t("login.errorTitle"), error.message);
      return;
    }

    console.log("LOGIN USER:", data.user);
    console.log("LOGIN SESSION:", data.session);

    router.replace("/profile" as never);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Delivery App</Text>

      <Text style={styles.title}>{t("login.title")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("login.email")}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={t("login.password")}
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t("login.button")}</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/register" as never)}>
        <Text style={styles.link}>{t("login.createAccount")}</Text>
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

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.dark,
    marginBottom: 24,
  },

  input: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: colors.dark,
  },

  button: {
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 18,
  },

  link: {
    marginTop: 24,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "700",
  },
});
