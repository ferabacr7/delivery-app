import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useLanguage } from "../i18n/useLanguage";
import { useTranslation } from "../i18n/useTranslation";
import { colors } from "../styles/theme";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  function toggleLanguage() {
    setLanguage(language === "es" ? "en" : "es");
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.header}>
            <Text style={styles.logo}>{t("home.title")}</Text>

            <Pressable style={styles.languageButton} onPress={toggleLanguage}>
              <Text style={styles.languageText}>
                🌎 {language === "es" ? "EN" : "ES"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.slogan}>{t("home.slogan")}</Text>

          <Text style={styles.description}>{t("home.description")}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.title}>{t("home.question")}</Text>

          <View style={styles.grid}>
            <Category icon="cart-outline" title={t("home.shopping")} />
            <Category icon="fast-food-outline" title={t("home.food")} />
            <Category icon="bicycle-outline" title={t("home.errands")} />
            <Category icon="construct-outline" title={t("home.services")} />
          </View>

          <Pressable
            style={styles.button}
            onPress={() => router.push("/create-order")}
          >
            <Text style={styles.buttonText}>{t("home.makeOrder")}</Text>
            <Ionicons name="arrow-forward" size={24} color={colors.white} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.nav}>
        <Ionicons name="home" size={26} color={colors.primary} />

        <Pressable onPress={() => router.push("/orders")}>
          <Ionicons name="clipboard-outline" size={26} color={colors.muted} />
        </Pressable>

        <Pressable onPress={() => router.push("/profile")}>
          <Ionicons
            name="person-circle-outline"
            size={28}
            color={colors.muted}
          />
        </Pressable>
      </View>
    </View>
  );
}

function Category({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  hero: {
    paddingTop: 80,
    paddingHorizontal: 28,
    paddingBottom: 60,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
  },

  languageButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  languageText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 14,
  },

  slogan: {
    marginTop: 18,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    color: colors.white,
  },

  description: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 24,
    color: colors.white,
  },

  panel: {
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.dark,
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  card: {
    width: "47%",
    minHeight: 130,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    justifyContent: "center",
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.softTeal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.dark,
  },

  button: {
    marginTop: 30,
    height: 62,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  buttonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
  },

  nav: {
    height: 82,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
