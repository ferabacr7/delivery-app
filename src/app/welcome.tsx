import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../styles/theme";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/welcome.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.actions}>
          {/* INICIAR SESIÓN */}
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/login" as never)}
          >
            <Text style={styles.primaryButtonText}>
              Iniciar sesión
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color={colors.white}
            />
          </Pressable>

          {/* CREAR CUENTA */}
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/register" as never)}
          >
            <Text style={styles.secondaryButtonText}>
              Crear cuenta
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  actions: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 105,
    alignItems: "center",
  },

  primaryButton: {
    width: "62%",
    height: 44,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    borderRadius: 14,
    backgroundColor: colors.primary,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },

  secondaryButton: {
    width: "62%",
    height: 44,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    marginTop: 10,

    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.78)",
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
});