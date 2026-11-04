import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { isValidPassword, updateMyPassword } from "../services/authService";
import { supabase } from "../lib/supabase";
import { colors } from "../styles/theme";

type RecoveryParams = {
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
};

function getRecoveryParams(url: string): RecoveryParams {
  const parsed = Linking.parse(url);

  const queryParams = parsed.queryParams ?? {};

  let accessToken =
    typeof queryParams.access_token === "string"
      ? queryParams.access_token
      : null;

  let refreshToken =
    typeof queryParams.refresh_token === "string"
      ? queryParams.refresh_token
      : null;

  let code = typeof queryParams.code === "string" ? queryParams.code : null;

  const hashIndex = url.indexOf("#");

  if (hashIndex >= 0) {
    const hash = url.slice(hashIndex + 1);

    const hashParams = new URLSearchParams(hash);

    accessToken = accessToken ?? hashParams.get("access_token");

    refreshToken = refreshToken ?? hashParams.get("refresh_token");

    code = code ?? hashParams.get("code");
  }

  return {
    accessToken,
    refreshToken,
    code,
  };
}

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [validatingSession, setValidatingSession] = useState(true);

  const [recoveryReady, setRecoveryReady] = useState(false);

  const { language } = useTranslation();

  useEffect(() => {
    async function handleRecoveryUrl(url: string | null) {
      if (!url) {
        setRecoveryReady(false);
        setValidatingSession(false);
        return;
      }

      try {
        const { accessToken, refreshToken, code } = getRecoveryParams(url);

        const parsedUrl = Linking.parse(url);

        const queryType = parsedUrl.queryParams?.type;

        const hashIndex = url.indexOf("#");

        const hashType =
          hashIndex >= 0
            ? new URLSearchParams(url.slice(hashIndex + 1)).get("type")
            : null;

        const recoveryType =
          typeof queryType === "string" ? queryType : hashType;

        if (recoveryType !== "recovery") {
          setRecoveryReady(false);
          return;
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("RECOVERY SET SESSION ERROR:", error);

            setRecoveryReady(false);
            return;
          }

          setRecoveryReady(true);
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error("RECOVERY CODE EXCHANGE ERROR:", error);

            setRecoveryReady(false);
            return;
          }

          setRecoveryReady(true);
          return;
        }

        // No permitir la recuperación solamente
        // porque exista una sesión iniciada.

        setRecoveryReady(false);
      } catch (error) {
        console.error("RECOVERY URL ERROR:", error);

        setRecoveryReady(false);
      } finally {
        setValidatingSession(false);
      }
    }

    async function initialize() {
      const initialUrl = await Linking.getInitialURL();

      await handleRecoveryUrl(initialUrl);
    }

    void initialize();

    const subscription = Linking.addEventListener("url", ({ url }) => {
      setValidatingSession(true);

      void handleRecoveryUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  async function handleUpdatePassword() {
    if (loading) {
      return;
    }

    if (!recoveryReady) {
      Alert.alert(
        language === "es" ? "Enlace no válido" : "Invalid link",
        language === "es"
          ? "No se pudo validar la sesión de recuperación. Solicitá un nuevo enlace."
          : "The recovery session could not be validated. Request a new link.",
      );

      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        language === "es" ? "Contraseña no válida" : "Invalid password",
        language === "es"
          ? "La contraseña debe tener al menos 8 caracteres e incluir una letra mayúscula, una minúscula, un número y un símbolo."
          : "The password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a symbol.",
      );

      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        language === "es"
          ? "Las contraseñas no coinciden"
          : "Passwords do not match",
        language === "es"
          ? "Ingresá la misma contraseña en ambos campos."
          : "Enter the same password in both fields.",
      );

      return;
    }

    try {
      setLoading(true);

      const { error } = await updateMyPassword(password);

      if (error) {
        console.error("UPDATE RECOVERY PASSWORD ERROR:", error);

        Alert.alert(
          language === "es" ? "No se pudo actualizar" : "Unable to update",
          error.message,
        );

        return;
      }

      await supabase.auth.signOut();

      Alert.alert(
        language === "es" ? "Contraseña actualizada" : "Password updated",
        language === "es"
          ? "Tu contraseña fue actualizada correctamente. Ya podés iniciar sesión."
          : "Your password was updated successfully. You can now sign in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login" as never),
          },
        ],
      );
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      Alert.alert(
        "Error",
        language === "es"
          ? "Ocurrió un error al actualizar tu contraseña."
          : "An error occurred while updating your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (validatingSession) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.statusText}>
          {language === "es" ? "Validando enlace..." : "Validating link..."}
        </Text>
      </View>
    );
  }

  if (!recoveryReady) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={34}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {language === "es" ? "Enlace no válido" : "Invalid link"}
        </Text>

        <Text style={styles.description}>
          {language === "es"
            ? "No se pudo validar el enlace de recuperación. Volvé a ORBIT y solicitá uno nuevo."
            : "The recovery link could not be validated. Return to ORBIT and request a new one."}
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/forgot-password" as never)}
        >
          <Text style={styles.buttonText}>
            {language === "es" ? "Solicitar nuevo enlace" : "Request new link"}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={34}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {language === "es" ? "Nueva contraseña" : "New password"}
        </Text>

        <Text style={styles.description}>
          {language === "es"
            ? "Creá una nueva contraseña para tu cuenta de ORBIT."
            : "Create a new password for your ORBIT account."}
        </Text>

        {/* NEW PASSWORD */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#666666"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.input}
            placeholder={
              language === "es" ? "Nueva contraseña" : "New password"
            }
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
            onPress={() => setShowPassword((current) => !current)}
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
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={21}
              color="#666666"
            />
          </Pressable>
        </View>

        {/* CONFIRM PASSWORD */}
        <View style={[styles.inputContainer, styles.secondInput]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#666666"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.input}
            placeholder={
              language === "es" ? "Confirmar contraseña" : "Confirm password"
            }
            placeholderTextColor="#777777"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />

          <Pressable
            style={styles.passwordVisibilityButton}
            onPress={() => setShowConfirmPassword((current) => !current)}
            disabled={loading}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              showConfirmPassword
                ? language === "es"
                  ? "Ocultar contraseña"
                  : "Hide password"
                : language === "es"
                  ? "Mostrar contraseña"
                  : "Show password"
            }
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={21}
              color="#666666"
            />
          </Pressable>
        </View>

        <Text style={styles.passwordHint}>
          {language === "es"
            ? "Mínimo 8 caracteres, incluyendo una letra, un número y un símbolo."
            : "At least 8 characters, including a letter, a number, and a symbol."}
        </Text>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => {
            void handleUpdatePassword();
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? language === "es"
                ? "Actualizando..."
                : "Updating..."
              : language === "es"
                ? "Actualizar contraseña"
                : "Update password"}
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

  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: colors.background,
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

  secondInput: {
    marginTop: 14,
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

  passwordVisibilityButton: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  passwordHint: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
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

  statusText: {
    color: colors.muted,
    fontSize: 15,
    textAlign: "center",
  },
});
