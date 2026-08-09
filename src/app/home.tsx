import { router } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BottomNavigation from "../components/ui/BottomNavigation";
import { useTranslation } from "../i18n/useTranslation";
import { colors } from "../styles/theme";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/logosolo.png")}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.slogan}>
            {t("home.slogan")}
          </Text>

          <Text style={styles.description}>
            {t("home.description")}
          </Text>
        </View>

        {/* SERVICIOS */}
        <View style={styles.panel}>
          <Text style={styles.eyebrow}>
            {t("home.question")}
          </Text>

          <View style={styles.grid}>
            <Category
              image={require("../../assets/images/supermercadohome.png")}
              title={t("home.supermarket")}
            />

            <Category
              image={require("../../assets/images/restaurantehome.png")}
              title={t("home.restaurant")}
            />

            <Category
              image={require("../../assets/images/farmaciahome.png")}
              title={t("home.pharmacy")}
            />

            <Category
              image={require("../../assets/images/mensajeriahome.png")}
              title={t("home.messaging")}
            />
          </View>

          {/* HACER PEDIDO */}
          <View style={styles.buttonArea}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/create-order")}
            >
              <Text style={styles.buttonText}>
                {t("home.makeOrder")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <BottomNavigation active="home" />
    </View>
  );
}

function Category({
  image,
  title,
}: {
  image: ImageSourcePropType;
  title: string;
}) {
  return (
    <View style={styles.card}>
      <Image
        source={image}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardLabel}>
        <Text
          style={styles.cardTitle}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  main: {
    flex: 1,
    paddingBottom: 108,
  },

  /* =========================
     HERO
  ========================= */

  hero: {
    backgroundColor: "#FFE1D2",

    paddingTop: 54,
    paddingHorizontal: 22,

    // Más grande para aprovechar mejor
    // la parte superior de la pantalla.
    paddingBottom: 34,

    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  logoWrapper: {
    width: 78,
    height: 68,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,

    overflow: "hidden",
  },

  brandLogo: {
    width: 145,
    height: 145,

    transform: [{ scale: 1.25 }],
  },

  slogan: {
    // Más protagonista
    fontSize: 33,
    lineHeight: 39,

    fontWeight: "900",
    color: colors.dark,

    maxWidth: 365,
  },

  description: {
    marginTop: 10,

    // Más grande también
    fontSize: 17,
    lineHeight: 23,

    fontWeight: "600",

    color: colors.muted,

    maxWidth: 360,
  },

  /* =========================
     SERVICIOS
  ========================= */

  panel: {
    flex: 1,

    paddingHorizontal: 22,

    // Baja un poco las cards
    paddingTop: 24,
  },

  eyebrow: {
    marginBottom: 14,

    fontSize: 14,
    fontWeight: "900",

    letterSpacing: 1.1,
    textTransform: "uppercase",

    color: colors.primaryDark,
  },

  /* =========================
     GRID
  ========================= */

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",

    rowGap: 14,
  },

  /* =========================
     CARDS
  ========================= */

  card: {
    width: "48%",
    height: 176,

    borderRadius: 20,

    backgroundColor: colors.white,

    borderWidth: 1,
    borderColor: colors.border,

    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: 136,
  },

  cardLabel: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 8,

    backgroundColor: colors.white,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "800",

    color: colors.dark,

    textAlign: "center",
  },

  /* =========================
     BOTÓN
  ========================= */

  buttonArea: {
    flex: 1,

    // Empuja Hacer pedido hacia abajo
    justifyContent: "flex-end",
    alignItems: "center",

    paddingTop: 12,

    // Lo acercamos al navigation
    paddingBottom: 0,
  },

  button: {
    width: "56%",
    height: 44,

    borderRadius: 15,

    backgroundColor: colors.primary,

    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },

  buttonText: {
    color: colors.white,

    fontSize: 15,
    fontWeight: "900",
  },
});