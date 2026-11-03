import { Ionicons } from "@expo/vector-icons";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t, language } = useTranslation();

  async function handleLogin() {
    if (loading) {
      return;
    }

    if (!email.trim() || !password) {
      Alert.alert(
        t("login.requiredTitle"),
        t("login.requiredMessage"),
      );

      return;
    }

    try {
      setLoading(true);

      const { data, error } = await signIn(
        email.trim().toLowerCase(),
        password,
      );

      if (error) {
        const isInvalidCredentials =
          error.message
            .toLowerCase()
            .includes("invalid login credentials");

        Alert.alert(
          t("login.errorTitle"),
          isInvalidCredentials
            ? language === "es"
              ? "El correo electrónico o la contraseña son incorrectos."
              : "The email or password is incorrect."
            : error.message,
        );

        return;
      }

      console.log(
        "LOGIN SUCCESS:",
        data.user?.id,
      );

      const {
        data: profile,
        error: profileError,
      } = await getMyProfile();

      if (profileError || !profile) {
        Alert.alert(
          t("login.errorTitle"),
          profileError?.message ??
            (language === "es"
              ? "No se pudo cargar el perfil del usuario."
              : "The user profile could not be loaded."),
        );

        return;
      }

      console.log(
        "LOGIN ROLE:",
        profile.role,
      );

      if (profile.role === "driver") {
        router.replace(
          "/driver" as never,
        );

        return;
      }

      router.replace(
        "/home" as never,
      );
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error,
      );

      Alert.alert(
        t("login.errorTitle"),
        language === "es"
          ? "Ocurrió un error al iniciar sesión."
          : "An error occurred while signing in.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/imagenlogin.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {t("login.title")}
          </Text>

          {/* EMAIL */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666666"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder={t("login.email")}
              placeholderTextColor="#777777"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666666"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder={t("login.password")}
              placeholderTextColor="#777777"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            <Pressable
              style={styles.passwordVisibilityButton}
              onPress={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              disabled={loading}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword
                  ? language === "es"
                    ? "Ocultar contraseña"
                    : "Hide password"
                  : language === "es"
                    ? "Mostrar contraseña"
                    : "Show password"
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={21}
                color="#666666"
              />
            </Pressable>
          </View>

          {/* FORGOT PASSWORD */}
          <Pressable
            onPress={() =>
              router.push(
                "/forgot-password" as never,
              )
            }
            disabled={loading}
          >
            <Text
              style={[
                styles.forgotPassword,
                loading &&
                  styles.linkDisabled,
              ]}
            >
              {language === "es"
                ? "¿Olvidaste tu contraseña?"
                : "Forgot your password?"}
            </Text>
          </Pressable>

          {/* SIGN IN */}
          <Pressable
            style={[
              styles.button,
              loading &&
                styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? language === "es"
                  ? "Ingresando..."
                  : "Signing in..."
                : t("login.button")}
            </Text>
          </Pressable>

          {/* CREATE ACCOUNT */}
          <Pressable
            onPress={() =>
              router.push(
                "/register" as never,
              )
            }
            disabled={loading}
          >
            <Text
              style={[
                styles.link,
                loading &&
                  styles.linkDisabled,
              ]}
            >
              {t("login.createAccount")}
            </Text>
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
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor:
      "rgba(255,255,255,0.42)",
  },

  formContainer: {
    width: "100%",
    marginTop: 52,
  },

  title: {
    marginBottom: 24,
    color: colors.dark,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  inputContainer: {
    width: "84%",
    height: 54,

    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
    paddingHorizontal: 16,

    borderRadius: 16,
    backgroundColor:
      "rgba(255,255,255,0.68)",
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    color: colors.dark,
    fontSize: 16,
  },

  passwordVisibilityButton: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  forgotPassword: {
    width: "84%",
    alignSelf: "center",
    marginTop: -2,
    marginBottom: 12,
    paddingHorizontal: 4,
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  button: {
    width: "52%",
    height: 46,

    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 4,

    borderRadius: 15,
    backgroundColor: colors.primary,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  link: {
    alignSelf: "center",
    marginTop: 18,

    paddingHorizontal: 12,
    paddingVertical: 5,

    borderRadius: 10,
    backgroundColor:
      "rgba(255,255,255,0.38)",

    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  linkDisabled: {
    opacity: 0.5,
  },
});
