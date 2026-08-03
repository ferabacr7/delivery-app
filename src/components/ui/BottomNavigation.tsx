import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTranslation } from "../../i18n/useTranslation";
import { colors } from "../../styles/theme";

type BottomNavigationKey = "home" | "orders" | "create" | "profile";

type BottomNavigationItem = {
  key: BottomNavigationKey;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
  labelKey:
    | "bottomNavigation.home"
    | "bottomNavigation.orders"
    | "bottomNavigation.create"
    | "bottomNavigation.profile";
};

type Props = {
  active: BottomNavigationKey;
};

const items: BottomNavigationItem[] = [
  {
    key: "home",
    icon: "home-outline",
    activeIcon: "home",
    route: "/",
    labelKey: "bottomNavigation.home",
  },
  {
    key: "orders",
    icon: "receipt-outline",
    activeIcon: "receipt",
    route: "/orders",
    labelKey: "bottomNavigation.orders",
  },
  {
    key: "create",
    icon: "add-circle-outline",
    activeIcon: "add-circle",
    route: "/create-order",
    labelKey: "bottomNavigation.create",
  },
  {
    key: "profile",
    icon: "person-outline",
    activeIcon: "person",
    route: "/profile",
    labelKey: "bottomNavigation.profile",
  },
];

export default function BottomNavigation({ active }: Props) {
  const { t } = useTranslation();

  function handleNavigate(item: BottomNavigationItem) {
    if (item.key === active) {
      return;
    }

    router.replace(item.route as never);
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.navBar}>
        {items.map((item) => {
          const isActive = item.key === active;

          return (
            <Pressable
              key={item.key}
              style={[styles.navItem, isActive && styles.activeItem]}
              onPress={() => handleNavigate(item)}
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={22}
                color={colors.primary}
              />

              <Text style={styles.label}>
                {t(item.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },

  navBar: {
    width: "100%",
    height: 68,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.34)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: "rgba(247, 95, 42, 0.38)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  navItem: {
    width: 62,
    height: 52,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    borderWidth: 1,
    borderColor: "rgba(247, 95, 42, 0.24)",
  },

  activeItem: {
    backgroundColor: colors.brandSoft,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },

  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "700",
    color: colors.primaryDark,
  },
});