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
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  async function handleLogin() {
    if (loading) {
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert(
        t("login.requiredTitle"),
        t("login.requiredMessage"),
      );

      return;
    }

    try {
      setLoading(true);

      const { data, error } = await signIn(
        email.trim(),
        password.trim(),
      );

      if (error) {
        Alert.alert(
          t("login.errorTitle"),
          error.message,
        );

        return;
      }

      console.log("LOGIN SUCCESS:", data.user?.id);

      const {
        data: profile,
        error: profileError,
      } = await getMyProfile();

      if (profileError || !profile) {
        Alert.alert(
          t("login.errorTitle"),
          profileError?.message ??
            "No se pudo cargar el perfil del usuario.",
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

      Alert.alert(
        t("login.errorTitle"),
        "Ocurrió un error al iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/womanlogin.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        {/* LOGO */}
        <Image
          source={require("../../assets/images/transparentlogo3.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* LOGIN */}
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
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          {/* SIGN IN */}
          <Pressable
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? "Ingresando..."
                : t("login.button")}
            </Text>
          </Pressable>

          {/* CREATE ACCOUNT */}
          <Pressable
onPress={() => router.push("/register" as never)}            disabled={loading}
          >
            <Text
              style={[
                styles.link,
                loading && styles.linkDisabled,
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

  /*
   * Fondo de la motorizada.
   * Cubre toda la pantalla de forma más natural.
   */
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  /*
   * Mucho menos blanco que antes para que
   * la fotografía realmente se pueda apreciar.
   */
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
backgroundColor: "rgba(255,255,255,0.42)",  },

  /*
   * Logo arriba.
   * Mantiene una proporción similar
   * a la pantalla Register.
   */
  logo: {
    width: 235,
    height: 125,
    alignSelf: "center",
    transform: [{ translateY: -72 }],
    marginBottom: -48,
  },

  /*
   * Sign In + inputs + botón bajan
   * independientemente del logo.
   */
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

  /*
   * Mismo ancho que Register.
   */
  inputContainer: {
    width: "84%",
    height: 54,

    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
    paddingHorizontal: 16,

    borderRadius: 16,

    /*
     * Transparencia igual al estilo
     * nuevo de Register.
     */
    backgroundColor: "rgba(255,255,255,0.68)",
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

  /*
   * Botón compacto como Register.
   */
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
  backgroundColor: "rgba(255,255,255,0.38)",

  color: colors.primary,
  fontSize: 14,
  fontWeight: "800",
  textAlign: "center",
},

  linkDisabled: {
    opacity: 0.5,
  },
});