import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { getMyProfile, signIn } from "../services/authService";
import { colors } from "../styles/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  async function handleLogin() {
    if (loading) {
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert(t("login.requiredTitle"), t("login.requiredMessage"));
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await signIn(email.trim(), password.trim());

      if (error) {
        Alert.alert(t("login.errorTitle"), error.message);
        return;
      }

      console.log("LOGIN SUCCESS:", data.user?.id);

      const { data: profile, error: profileError } = await getMyProfile();

      if (profileError || !profile) {
        Alert.alert(
          t("login.errorTitle"),
          profileError?.message ?? "No se pudo cargar el perfil del usuario.",
        );
        return;
      }

      console.log("LOGIN ROLE:", profile.role);

      if (profile.role === "driver") {
        router.replace("/driver" as never);
        return;
      }

      router.replace("/home" as never);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      Alert.alert(t("login.errorTitle"), "Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/login2.png")}
        style={styles.backgroundImage}
        resizeMode="contain"
      />

      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t("login.title")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("login.email")}
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
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

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Ingresando..." : t("login.button")}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push("/register" as never)}>
            <Text style={styles.link}>{t("login.createAccount")}</Text>
          </Pressable>
        </View>
      </View>
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
    top: -185,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "rgba(255,255,255,0.82)",
  },

  formContainer: {
    width: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.dark,
    marginBottom: 24,
    textAlign: "center",
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

  buttonDisabled: {
    opacity: 0.65,
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
