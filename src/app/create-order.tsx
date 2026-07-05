import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ServiceType } from "@/business/quoteEngine/models";
import { useTranslation } from "../i18n/useTranslation";
import { getMyAddresses } from "../services/addressService";
import { createOrder } from "../services/orderService";
import { colors } from "../styles/theme";

const SERVICE_TYPES: {
  label: string;
  value: ServiceType;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: "Supermercado", value: "SUPERMARKET", icon: "cart-outline" },
  { label: "Farmacia", value: "PHARMACY", icon: "medical-outline" },
  { label: "Recoger comida", value: "FOOD_PICKUP", icon: "restaurant-outline" },
  { label: "Mensajería", value: "GENERAL_MESSAGING", icon: "cube-outline" },
];

export default function CreateOrderScreen() {
  const [description, setDescription] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  async function loadAddresses() {
    const { data, error } = await getMyAddresses();

    if (error) {
      Alert.alert(t("common.error"), error.message);
      return;
    }

    setAddresses(data ?? []);

    const firstAddress = data?.[0];

    if (firstAddress) {
      setSelectedAddressId(firstAddress.id);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [])
  );

  async function handleCreateOrder() {
    const trimmedDescription = description.trim();

    if (!selectedAddressId) {
      Alert.alert(t("common.error"), "Selecciona una dirección.");
      return;
    }

    if (!selectedServiceType) {
      Alert.alert(t("common.error"), "Selecciona un tipo de servicio.");
      return;
    }

    if (!trimmedDescription) {
      Alert.alert(t("common.error"), t("createOrder.required"));
      return;
    }

    if (trimmedDescription.length < 5) {
      Alert.alert(t("common.error"), "El pedido debe tener más detalle.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await createOrder({
        description: trimmedDescription,
        addressId: selectedAddressId,
        serviceType: selectedServiceType,
      });

      if (error) {
        Alert.alert(t("common.error"), error.message);
        return;
      }

      Alert.alert(
        t("createOrder.successTitle"),
        t("createOrder.successMessage")
      );

      setDescription("");
      setSelectedServiceType(null);
      router.push("/orders");
    } catch {
      Alert.alert(t("common.error"), t("createOrder.errorMessage"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={colors.white} />
        </Pressable>

        <Text style={styles.title}>{t("createOrder.title")}</Text>
        <Text style={styles.subtitle}>{t("createOrder.subtitle")}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Dirección de entrega</Text>

        {addresses.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="location-outline" size={24} color={colors.muted} />
            <Text style={styles.emptyText}>
              No tienes direcciones registradas todavía.
            </Text>
          </View>
        ) : (
          addresses.map((address) => (
            <Pressable
              key={address.id}
              style={[
                styles.selectCard,
                selectedAddressId === address.id && styles.selectCardActive,
              ]}
              onPress={() => setSelectedAddressId(address.id)}
            >
              <Ionicons
                name="location-outline"
                size={24}
                color={
                  selectedAddressId === address.id
                    ? colors.primary
                    : colors.muted
                }
              />

              <View style={styles.selectContent}>
                <Text style={styles.selectTitle}>
                  {address.label || "Dirección"}
                </Text>
                <Text style={styles.selectSubtitle}>
                  {address.address_line}
                </Text>
              </View>

              {selectedAddressId === address.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary}
                />
              )}
            </Pressable>
          ))
        )}

        <Text style={styles.sectionTitle}>Tipo de servicio</Text>

        {SERVICE_TYPES.map((service) => (
          <Pressable
            key={service.value}
            style={[
              styles.selectCard,
              selectedServiceType === service.value && styles.selectCardActive,
            ]}
            onPress={() => setSelectedServiceType(service.value)}
          >
            <Ionicons
              name={service.icon}
              size={24}
              color={
                selectedServiceType === service.value
                  ? colors.primary
                  : colors.muted
              }
            />

            <View style={styles.selectContent}>
              <Text style={styles.selectTitle}>{service.label}</Text>
            </View>

            {selectedServiceType === service.value && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.primary}
              />
            )}
          </Pressable>
        ))}

        <Text style={styles.label}>{t("createOrder.question")}</Text>

        <TextInput
          style={styles.textArea}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder={t("createOrder.placeholder")}
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.sectionTitle}>
          {t("createOrder.optionalDetails")}
        </Text>

        <Option
          icon="image-outline"
          title={t("createOrder.referencePhoto")}
          comingSoon
        />

        <Option
          icon="document-text-outline"
          title={t("createOrder.additionalNotes")}
          comingSoon
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreateOrder}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t("createOrder.creating") : t("createOrder.button")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Option({
  icon,
  title,
  comingSoon = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  comingSoon?: boolean;
}) {
  return (
    <View style={[styles.option, comingSoon && styles.optionDisabled]}>
      <Ionicons
        name={icon}
        size={24}
        color={comingSoon ? colors.muted : colors.primary}
      />

      <Text style={[styles.optionText, comingSoon && styles.optionTextDisabled]}>
        {title}
      </Text>

      {comingSoon ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Próximamente</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={22} color={colors.muted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 52,
  },
  title: {
    marginTop: 28,
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: colors.white,
  },
  panel: {
    marginTop: -28,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.dark,
    marginTop: 24,
    marginBottom: 12,
  },
  textArea: {
    height: 140,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    color: colors.dark,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 14,
    fontSize: 17,
    fontWeight: "900",
    color: colors.dark,
  },
  selectCard: {
    minHeight: 62,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
  },
  selectCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#F1FAF4",
  },
  selectContent: {
    flex: 1,
  },
  selectTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.dark,
  },
  selectSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  emptyBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    flex: 1,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  option: {
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: colors.dark,
  },
  button: {
    marginTop: 24,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: "900" },
  optionDisabled: {
    opacity: 0.65,
  },
  optionTextDisabled: {
    color: colors.muted,
  },
  badge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "800",
  },
});