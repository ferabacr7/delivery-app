import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BottomNavigation from "../components/ui/BottomNavigation";
import { useTranslation } from "../i18n/useTranslation";
import { colors } from "../styles/theme";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <View style={styles.brandBadge}>
            <Ionicons name="bicycle-outline" size={18} color={colors.primary} />
            <Text style={styles.brandBadgeText}>Boomerang</Text>
          </View>

          <Text style={styles.slogan}>{t("home.slogan")}</Text>

          <Text style={styles.description}>{t("home.description")}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.eyebrow}>{t("home.question")}</Text>

          <View style={styles.grid}>
  <Category
    icon="cart-outline"
    title={t("home.supermarket")}
  />

  <Category
    icon="restaurant-outline"
    title={t("home.restaurant")}
  />

  <Category
    icon="medkit-outline"
    title={t("home.pharmacy")}
  />

  <Category
    icon="chatbox-ellipses-outline"
    title={t("home.messaging")}
  />
</View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/create-order")}
          >
            <Text style={styles.buttonText}>{t("home.makeOrder")}</Text>

            <View style={styles.buttonIcon}>
              <Ionicons
                name="arrow-forward"
                size={21}
                color={colors.white}
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNavigation active="home" />
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
        <Ionicons name={icon} size={30} color={colors.primaryDark} />
      </View>

      <Text style={styles.cardTitle}>{title}</Text>

      <Ionicons
        name="arrow-forward-outline"
        size={18}
        color={colors.textSoft}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: "relative",
  },

  content: {
    paddingBottom: 130,
  },

  hero: {
    paddingTop: 74,
    paddingHorizontal: 24,
    paddingBottom: 36,
    backgroundColor: colors.brandSoft,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  brandBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    marginBottom: 22,
  },

  brandBadgeText: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.primaryDark,
  },

  slogan: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
    color: colors.dark,
    maxWidth: 330,
  },

  description: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    maxWidth: 340,
  },

  panel: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  eyebrow: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: colors.primaryDark,
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  card: {
    width: "47%",
    minHeight: 144,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    justifyContent: "space-between",
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    marginTop: 18,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    color: colors.dark,
  },

  button: {
    marginTop: 30,
    minHeight: 62,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 18,
  },

  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },

  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  buttonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
});