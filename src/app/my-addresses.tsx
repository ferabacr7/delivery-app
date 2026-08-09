import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../components/ui/AppHeader";
import BottomNavigation from "../components/ui/BottomNavigation";
import { useTranslation } from "../i18n/useTranslation";
import { getMyAddresses } from "../services/addressService";
import { colors } from "../styles/theme";

type Address = {
  id: string;
  label: string;
  address_line: string;
  reference: string | null;
  is_default: boolean;
};

function getAddressIcon(label?: string | null): keyof typeof Ionicons.glyphMap {
  const normalizedLabel = label?.trim().toLowerCase();

  if (normalizedLabel === "casa" || normalizedLabel === "home") {
    return "home-outline";
  }

  if (normalizedLabel === "trabajo" || normalizedLabel === "work") {
    return "briefcase-outline";
  }

  if (normalizedLabel === "apartamento" || normalizedLabel === "apartment") {
    return "business-outline";
  }

  if (normalizedLabel === "hotel") {
    return "bed-outline";
  }

  return "location-outline";
}

export default function MyAddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, []),
  );

  async function loadAddresses() {
    setIsLoading(true);
    setHasError(false);

    const { data, error } = await getMyAddresses();

    if (error) {
      console.error("Error loading addresses:", error);

      setAddresses([]);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setAddresses((data ?? []) as Address[]);
    setIsLoading(false);
  }

  function handleAddAddress() {
    router.push("/my-address" as never);
  }

  function handleEditAddress(addressId: string) {
    router.push({
      pathname: "/my-address",
      params: {
        addressId,
      },
    } as never);
  }

function handleBack() {
  router.back();
}

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AppHeader
          title={t("addresses.title")}
          subtitle={t("addresses.subtitle")}
          showBackButton
          backLabel={t("common.back")}
          onBack={handleBack}
        />

        <View style={styles.body}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.loadingText}>{t("addresses.loading")}</Text>
            </View>
          ) : hasError ? (
            <View style={styles.stateCard}>
              <View style={styles.stateIcon}>
                <Ionicons
                  name="alert-circle-outline"
                  size={30}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.stateTitle}>{t("addresses.errorTitle")}</Text>

              <Text style={styles.stateDescription}>
                {t("addresses.loadError")}
              </Text>

              <Pressable style={styles.secondaryButton} onPress={loadAddresses}>
                <Text style={styles.secondaryButtonText}>
                  {t("addresses.retry")}
                </Text>
              </Pressable>
            </View>
          ) : addresses.length === 0 ? (
            <View style={styles.stateCard}>
              <View style={styles.stateIcon}>
                <Ionicons
                  name="location-outline"
                  size={30}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.stateTitle}>{t("addresses.emptyTitle")}</Text>

              <Text style={styles.stateDescription}>
                {t("addresses.emptyDescription")}
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={handleAddAddress}
              >
                <Ionicons name="add" size={21} color={colors.white} />

                <Text style={styles.primaryButtonText}>
                  {t("addresses.add")}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.addressList}>
              {addresses.map((address) => {
                return (
                  <View key={address.id} style={styles.addressCard}>
                    <View style={styles.addressTopRow}>
                      <View style={styles.addressIconBox}>
                        <Ionicons
                          name={getAddressIcon(address.label)}
                          size={22}
                          color={colors.primary}
                        />
                      </View>

                      <View style={styles.addressContent}>
                        <Text style={styles.addressLabel}>{address.label}</Text>

                        <Text style={styles.addressLine}>
                          {address.address_line}
                        </Text>

                        {address.reference ? (
                          <Text style={styles.referenceText}>
                            {address.reference}
                          </Text>
                        ) : null}
                      </View>

                      <Pressable
                        style={styles.editIconButton}
                        onPress={() => handleEditAddress(address.id)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={t("addresses.editAccessibility")}
                      >
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color={colors.primary}
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavigation active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#F8FAFA",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 130,
  },

  body: {
    flexGrow: 1,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  loadingContainer: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.muted,
  },

  stateCard: {
    minHeight: 250,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  stateIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  stateTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "900",
    color: colors.dark,
    textAlign: "center",
  },

  stateDescription: {
    marginTop: 9,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
  },

  primaryButton: {
    width: "100%",
    height: 54,
    marginTop: 22,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryButton: {
    width: "100%",
    height: 52,
    marginTop: 22,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
  },

  addressList: {
    gap: 12,
  },

  addressCard: {
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  addressTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  addressIconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  addressContent: {
    flex: 1,
  },

  addressLabel: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.dark,
  },

  addressLine: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 21,
    color: colors.dark,
  },

  referenceText: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },

  editIconButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
