import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getMyProfile, getSession } from "../services/authService";
import { colors } from "../styles/theme";

export default function AppEntryScreen() {
  useEffect(() => {
    void resolveInitialRoute();
  }, []);

  async function resolveInitialRoute() {
    try {
      const { data: sessionData, error: sessionError } =
        await getSession();

      if (sessionError) {
        console.error("INITIAL SESSION ERROR:", sessionError);

        router.replace("/welcome" as never);
        return;
      }

      if (!sessionData.session) {
        router.replace("/welcome" as never);
        return;
      }

      const { data: profile, error: profileError } =
        await getMyProfile();

      if (profileError || !profile) {
        console.error(
          "INITIAL PROFILE ERROR:",
          profileError,
        );

        router.replace("/welcome" as never);
        return;
      }

      if (profile.role === "driver") {
        router.replace("/driver" as never);
        return;
      }

      router.replace("/home" as never);
    } catch (error) {
      console.error("INITIAL ROUTE ERROR:", error);

      router.replace("/welcome" as never);
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colors.primary}
      />

      <Text style={styles.text}>
        Cargando...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.muted,
  },
});