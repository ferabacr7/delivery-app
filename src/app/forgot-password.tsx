import { Ionicons } from "@expo/vector-icons";
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
import { requestPasswordReset } from "../services/authService";
import { colors } from "../styles/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { language } = useTranslation();

  async function handleResetPassword() {
    if (loading) {
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert(
        language === "es"
          ? "Correo requerido"
          : "Email required",
        language === "es"
          ? "Ingresá el correo asociado a tu cuenta."
          : "Enter the email associated with your account.",
      );

      return;
    }

    try {
      setLoading(true);

      const { error } =
        await requestPasswordReset(
          normalizedEmail,
        );

      if (error) {
        console.error(
          "PASSWORD RESET REQUEST ERROR:",
          error,
        );

        Alert.alert(
          language === "es"
            ? "No se pudo enviar el enlace"
            : "Unable to send reset link",
          error.message,
        );

        return;
      }

      Alert.alert(
        language === "es"
          ? "Revisá tu correo"
          : "Check your email",
        language === "es"
          ? "Si existe una cuenta asociada a ese correo, recibirás un enlace para restablecer tu contraseña."
          : "If an account exists for that email, you will receive a link to reset your password.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace(
                "/login" as never,
              ),
          },
        ],
      );
    } catch (error) {
      console.error(
        "PASSWORD RESET ERROR:",
        error,
      );

      Alert.alert(
        language === "es"
          ? "Error"
          : "Error",
        language === "es"
          ? "Ocurrió un error al solicitar el cambio de contraseña."
          : "An error occurred while requesting the password reset.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={colors.primary}
        />

        <Text style={styles.backText}>
          {language === "es"
            ? "Atrás"
            : "Back"}
        </Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="key-outline"
            size={34}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {language === "es"
            ? "Restablecer contraseña"
            : "Reset password"}
        </Text>

        <Text style={styles.description}>
          {language === "es"
            ? "Ingresá el correo asociado a tu cuenta de ORBIT. Te enviaremos un enlace para crear una nueva contraseña."
            : "Enter the email associated with your ORBIT account. We'll send you a link to create a new password."}
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#666666"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.input}
            placeholder={
              language === "es"
                ? "Correo electrónico"
                : "Email address"
            }
            placeholderTextColor="#777777"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            returnKeyType="send"
            onSubmitEditing={() => {
              void handleResetPassword();
            }}
          />
        </View>

        <Pressable
          style={[
            styles.button,
            loading &&
              styles.buttonDisabled,
          ]}
          onPress={() => {
            void handleResetPassword();
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? language === "es"
                ? "Enviando..."
                : "Sending..."
              : language === "es"
                ? "Enviar enlace"
                : "Send reset link"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.replace(
              "/login" as never,
            )
          }
          disabled={loading}
        >
          <Text style={styles.loginLink}>
            {language === "es"
              ? "Volver a iniciar sesión"
              : "Back to sign in"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
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

  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },

  iconContainer: {
    width: 64,
    height: 64,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: colors.brandSoft,
  },

  title: {
    color: colors.dark,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  description: {
    maxWidth: 360,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 28,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  inputContainer: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    color: colors.dark,
    fontSize: 16,
  },

  button: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    borderRadius: 16,
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

  loginLink: {
    alignSelf: "center",
    marginTop: 20,
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});