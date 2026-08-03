import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { CourierWeight, ServiceType } from "@/business/quoteEngine/models";
import { businessConfig, SupportedCurrency } from "@/constants/businessConfig";

import { useTranslation } from "../i18n/useTranslation";
import { getMyAddresses } from "../services/addressService";
import { createOrder } from "../services/orderService";
import { colors } from "../styles/theme";

type ServiceTranslationKey =
  | "createOrder.supermarket"
  | "createOrder.pharmacy"
  | "createOrder.foodPickup"
  | "createOrder.messaging";

const SERVICE_TYPES: {
  labelKey: ServiceTranslationKey;
  value: ServiceType;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    labelKey: "createOrder.supermarket",
    value: "SUPERMARKET",
    icon: "cart-outline",
  },
  {
    labelKey: "createOrder.pharmacy",
    value: "PHARMACY",
    icon: "medical-outline",
  },
  {
    labelKey: "createOrder.foodPickup",
    value: "FOOD_PICKUP",
    icon: "restaurant-outline",
  },
  {
    labelKey: "createOrder.messaging",
    value: "GENERAL_MESSAGING",
    icon: "cube-outline",
  },
];

function formatCurrency(value: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CreateOrderScreen() {
  const [description, setDescription] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);

  const [courierWeight, setCourierWeight] = useState<CourierWeight>("LIGHT");

  const [foodOrderPaid, setFoodOrderPaid] = useState<boolean | null>(null);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { t, language } = useTranslation();

  const selectedCurrency: SupportedCurrency = language === "es" ? "CRC" : "USD";

  const purchaseLimits =
    selectedCurrency === "CRC"
      ? businessConfig.purchase.crc
      : businessConfig.purchase.usd;

  const [estimatedPurchaseAmount, setEstimatedPurchaseAmount] = useState(
    language === "es" ? 5000 : 10,
  );

  useEffect(() => {
    setEstimatedPurchaseAmount(language === "es" ? 5000 : 10);
  }, [language]);

  const courierWeightOptions: {
    title: string;
    subtitle: string;
    price: string;
    value: CourierWeight;
  }[] = [
    {
      title: t("createOrder.courierLightTitle"),
      subtitle: t("createOrder.courierLightDescription"),
      price: "₡2.500",
      value: "LIGHT",
    },
    {
      title: t("createOrder.courierMediumTitle"),
      subtitle: t("createOrder.courierMediumDescription"),
      price: "₡3.500",
      value: "MEDIUM",
    },
    {
      title: t("createOrder.courierHeavyTitle"),
      subtitle: t("createOrder.courierHeavyDescription"),
      price: "₡5.000",
      value: "HEAVY",
    },
  ];

  const shouldShowEstimatedPurchaseAmount =
    selectedServiceType === "SUPERMARKET" ||
    selectedServiceType === "PHARMACY" ||
    (selectedServiceType === "FOOD_PICKUP" && foodOrderPaid === false);

  function getPickupLocationLabel() {
    switch (selectedServiceType) {
      case "SUPERMARKET":
        return t("createOrder.preferredSupermarket");

      case "PHARMACY":
        return t("createOrder.preferredPharmacy");

      case "FOOD_PICKUP":
      case "GENERAL_MESSAGING":
        return t("createOrder.pickupLocation");

      default:
        return t("createOrder.pickupLocation");
    }
  }

  function getPickupLocationPlaceholder() {
    switch (selectedServiceType) {
      case "SUPERMARKET":
        return t("createOrder.preferredSupermarketPlaceholder");

      case "PHARMACY":
        return t("createOrder.preferredPharmacyPlaceholder");

      case "FOOD_PICKUP":
        return t("createOrder.restaurantPickupPlaceholder");

      case "GENERAL_MESSAGING":
        return t("createOrder.messagingPickupPlaceholder");

      default:
        return t("createOrder.pickupLocationPlaceholder");
    }
  }

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
    } else {
      setSelectedAddressId("");
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, []),
  );

  function handleSelectService(serviceType: ServiceType) {
    setSelectedServiceType(serviceType);
    setPickupLocation("");

    if (serviceType !== "FOOD_PICKUP") {
      setFoodOrderPaid(null);
    }

    if (serviceType !== "GENERAL_MESSAGING") {
      setCourierWeight("LIGHT");
    }
  }

  async function handleCreateOrder() {
    const trimmedDescription = description.trim();
    const trimmedPickupLocation = pickupLocation.trim();

    if (!selectedAddressId) {
      Alert.alert(t("common.error"), t("createOrder.selectAddress"));
      return;
    }

    if (!selectedServiceType) {
      Alert.alert(t("common.error"), t("createOrder.selectService"));
      return;
    }

    if (!trimmedPickupLocation) {
      Alert.alert(t("common.error"), t("createOrder.pickupLocationRequired"));
      return;
    }

    if (selectedServiceType === "FOOD_PICKUP" && foodOrderPaid === null) {
      Alert.alert(t("common.error"), t("createOrder.foodPaymentRequired"));
      return;
    }

    if (!trimmedDescription) {
      Alert.alert(t("common.error"), t("createOrder.required"));
      return;
    }

    if (trimmedDescription.length < 5) {
      Alert.alert(t("common.error"), t("createOrder.moreDetail"));
      return;
    }

    if (
      estimatedPurchaseAmount < purchaseLimits.minimum ||
      estimatedPurchaseAmount > purchaseLimits.maximum
    ) {
      Alert.alert(t("common.error"), t("createOrder.purchaseAmountOutOfRange"));
      return;
    }

    try {
      setLoading(true);

      console.warn("ORDER CURRENCY DEBUG:", {
        language,
        selectedCurrency,
        selectedServiceType,
        estimatedPurchaseAmount,
      });

      const { error } = await createOrder({
        description: trimmedDescription,
        addressId: selectedAddressId,
        serviceType: selectedServiceType,
        pickupLocation: trimmedPickupLocation,
        currency: selectedCurrency,

        courierWeight:
          selectedServiceType === "GENERAL_MESSAGING"
            ? courierWeight
            : undefined,

        foodOrderPaid:
          selectedServiceType === "FOOD_PICKUP"
            ? (foodOrderPaid ?? undefined)
            : undefined,

        estimatedPurchaseAmount: shouldShowEstimatedPurchaseAmount
          ? estimatedPurchaseAmount
          : undefined,
      });

      if (error) {
        Alert.alert(t("common.error"), error.message);
        return;
      }

      Alert.alert(
        t("createOrder.successTitle"),
        t("createOrder.successMessage"),
      );

      setDescription("");
      setPickupLocation("");
      setSelectedServiceType(null);
      setCourierWeight("LIGHT");
      setEstimatedPurchaseAmount(purchaseLimits.minimum);
      setFoodOrderPaid(null);

      router.replace("/orders" as never);
    } catch (error) {
      console.error("Unexpected error creating order:", error);

      Alert.alert(t("common.error"), t("createOrder.errorMessage"));
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    router.replace("/" as never);
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.hero}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
        >
          <Ionicons name="arrow-back" size={26} color={colors.white} />

          <Text style={styles.backButtonText}>{t("common.back")}</Text>
        </Pressable>

        <Text style={styles.title}>{t("createOrder.title")}</Text>

        <Text style={styles.subtitle}>{t("createOrder.subtitle")}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>
          {t("createOrder.deliveryAddress")}
        </Text>

        {addresses.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="location-outline" size={24} color={colors.muted} />

            <View style={styles.emptyContent}>
              <Text style={styles.emptyText}>
                {t("createOrder.noAddresses")}
              </Text>

              <Pressable
                style={styles.addressButton}
                onPress={() => router.push("/my-addresses" as never)}
              >
                <Text style={styles.addressButtonText}>
                  {t("createOrder.addAddress")}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </View>
        ) : (
          addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;

            return (
              <Pressable
                key={address.id}
                style={[
                  styles.selectCard,
                  isSelected && styles.selectCardActive,
                ]}
                onPress={() => setSelectedAddressId(address.id)}
              >
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={isSelected ? colors.primary : colors.muted}
                />

                <View style={styles.selectContent}>
                  <Text style={styles.selectTitle}>
                    {address.label || t("common.address")}
                  </Text>

                  <Text style={styles.selectSubtitle}>
                    {address.address_line}
                  </Text>
                </View>

                {isSelected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary}
                  />
                ) : null}
              </Pressable>
            );
          })
        )}

        <Text style={styles.sectionTitle}>{t("createOrder.serviceType")}</Text>

        {SERVICE_TYPES.map((service) => {
          const isSelected = selectedServiceType === service.value;

          return (
            <Pressable
              key={service.value}
              style={[styles.selectCard, isSelected && styles.selectCardActive]}
              onPress={() => handleSelectService(service.value)}
            >
              <Ionicons
                name={service.icon}
                size={24}
                color={isSelected ? colors.primary : colors.muted}
              />

              <View style={styles.selectContent}>
                <Text style={styles.selectTitle}>{t(service.labelKey)}</Text>
              </View>

              {isSelected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary}
                />
              ) : null}
            </Pressable>
          );
        })}

        {selectedServiceType === "GENERAL_MESSAGING" && (
          <>
            <Text style={styles.sectionTitle}>
              {t("createOrder.courierWeightTitle")}
            </Text>

            {courierWeightOptions.map((option) => {
              const isSelected = courierWeight === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.selectCard,
                    isSelected && styles.selectCardActive,
                  ]}
                  onPress={() => setCourierWeight(option.value)}
                >
                  <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={isSelected ? colors.primary : colors.muted}
                  />

                  <View style={styles.selectContent}>
                    <View style={styles.weightHeader}>
                      <Text style={styles.selectTitle}>{option.title}</Text>

                      <Text style={styles.weightPrice}>{option.price}</Text>
                    </View>

                    <Text style={styles.selectSubtitle}>{option.subtitle}</Text>
                  </View>
                </Pressable>
              );
            })}

            <View style={styles.courierNotice}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#8A6D3B"
              />

              <Text style={styles.courierNoticeText}>
                {t("createOrder.courierManualReview")}
              </Text>
            </View>
          </>
        )}

        {selectedServiceType === "FOOD_PICKUP" && (
          <>
            <Text style={styles.sectionTitle}>
              {t("createOrder.foodPaymentTitle")}
            </Text>

            <View style={styles.paymentOptions}>
              <Pressable
                style={[
                  styles.paymentOption,
                  foodOrderPaid === true && styles.paymentOptionActive,
                ]}
                onPress={() => setFoodOrderPaid(true)}
              >
                <Ionicons
                  name={
                    foodOrderPaid === true
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={24}
                  color={foodOrderPaid === true ? colors.primary : colors.muted}
                />

                <View style={styles.selectContent}>
                  <Text style={styles.selectTitle}>
                    {t("createOrder.foodPaymentYes")}
                  </Text>

                  <Text style={styles.selectSubtitle}>
                    {t("createOrder.foodPaymentYesDescription")}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={[
                  styles.paymentOption,
                  foodOrderPaid === false && styles.paymentOptionActive,
                ]}
                onPress={() => setFoodOrderPaid(false)}
              >
                <Ionicons
                  name={
                    foodOrderPaid === false
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={24}
                  color={
                    foodOrderPaid === false ? colors.primary : colors.muted
                  }
                />

                <View style={styles.selectContent}>
                  <Text style={styles.selectTitle}>
                    {t("createOrder.foodPaymentNo")}
                  </Text>

                  <Text style={styles.selectSubtitle}>
                    {t("createOrder.foodPaymentNoDescription")}
                  </Text>
                </View>
              </Pressable>
            </View>
          </>
        )}

        {shouldShowEstimatedPurchaseAmount && (
          <>
            <Text style={styles.sectionTitle}>
              {t("createOrder.estimatedPurchaseTitle")}
            </Text>

            <View style={styles.amountCard}>
              <View style={styles.amountHeader}>
                <View style={styles.amountIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.amountHeaderContent}>
                  <Text style={styles.amountLabel}>
                    {t("createOrder.estimatedPurchaseApproximately")}
                  </Text>

                  <Text style={styles.amountValue}>
                    {formatCurrency(
                      estimatedPurchaseAmount,
                      purchaseLimits.locale,
                      purchaseLimits.currency,
                    )}
                  </Text>
                </View>
              </View>

              <Text style={styles.amountHelper}>
                {t("createOrder.estimatedPurchaseValidationHelper")}
              </Text>

              <View style={styles.separateChargeNotice}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#356B75"
                />

                <Text style={styles.separateChargeNoticeText}>
                  {t("createOrder.estimatedPurchaseSeparateCharge")}
                </Text>
              </View>

              <Slider
                style={styles.slider}
                minimumValue={purchaseLimits.minimum}
                maximumValue={purchaseLimits.maximum}
                step={purchaseLimits.step}
                value={estimatedPurchaseAmount}
                onValueChange={setEstimatedPurchaseAmount}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
                accessibilityLabel={t(
                  "createOrder.estimatedPurchaseAccessibility",
                )}
                accessibilityValue={{
                  min: purchaseLimits.minimum,
                  max: purchaseLimits.maximum,
                  now: estimatedPurchaseAmount,
                  text: new Intl.NumberFormat(purchaseLimits.locale, {
                    style: "currency",
                    currency: purchaseLimits.currency,
                    maximumFractionDigits: 0,
                  }).format(estimatedPurchaseAmount),
                }}
              />

              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>
                  {t("createOrder.minimumPurchaseAmount")}{" "}
                  {formatCurrency(
                    purchaseLimits.minimum,
                    purchaseLimits.locale,
                    purchaseLimits.currency,
                  )}
                </Text>

                <Text style={styles.sliderLabel}>
                  {t("createOrder.maximumPurchaseAmount")}{" "}
                  {formatCurrency(
                    purchaseLimits.maximum,
                    purchaseLimits.locale,
                    purchaseLimits.currency,
                  )}
                </Text>
              </View>
            </View>
          </>
        )}

        {selectedServiceType ? (
          <>
            <Text style={styles.sectionTitle}>{getPickupLocationLabel()}</Text>

            <TextInput
              style={styles.input}
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholder={getPickupLocationPlaceholder()}
              placeholderTextColor={colors.muted}
            />
          </>
        ) : null}

        <Text style={styles.label}>{t("createOrder.question")}</Text>

        <TextInput
          style={styles.textArea}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder={t("createOrder.placeholder")}
          placeholderTextColor={colors.muted}
          textAlignVertical="top"
          returnKeyType="done"
          blurOnSubmit
        />

        <Text style={styles.sectionTitle}>
          {t("createOrder.optionalDetails")}
        </Text>

        <Option
          icon="image-outline"
          title={t("createOrder.referencePhoto")}
          comingSoonLabel={t("createOrder.comingSoon")}
          comingSoon
        />

        <Option
          icon="document-text-outline"
          title={t("createOrder.additionalNotes")}
          comingSoonLabel={t("createOrder.comingSoon")}
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

type OptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  comingSoonLabel: string;
  comingSoon?: boolean;
};

function Option({
  icon,
  title,
  comingSoonLabel,
  comingSoon = false,
}: OptionProps) {
  return (
    <View style={[styles.option, comingSoon && styles.optionDisabled]}>
      <Ionicons
        name={icon}
        size={24}
        color={comingSoon ? colors.muted : colors.primary}
      />

      <Text
        style={[styles.optionText, comingSoon && styles.optionTextDisabled]}
      >
        {title}
      </Text>

      {comingSoon ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{comingSoonLabel}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={22} color={colors.muted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  hero: {
    backgroundColor: colors.primary,
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 52,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
  },

  backButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.white,
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
    paddingBottom: 48,
  },

  label: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.dark,
    marginTop: 24,
    marginBottom: 12,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark,
    backgroundColor: colors.white,
  },

  textArea: {
    height: 140,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
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
    backgroundColor: colors.brandSoft,
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

  weightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  weightPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.primary,
  },

  courierNotice: {
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FFF8E1",
  },

  courierNoticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
    color: "#8A6D3B",
  },

  paymentOptions: {
    gap: 10,
  },

  paymentOption: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
  },

  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.brandSoft,
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

  emptyContent: {
    flex: 1,
  },

  emptyText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },

  addressButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  addressButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },

  amountCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 18,
    backgroundColor: colors.white,
  },

  amountHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  amountIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandSoft,
  },

  amountHeaderContent: {
    flex: 1,
  },

  amountLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
  },

  amountValue: {
    marginTop: 2,
    fontSize: 28,
    fontWeight: "900",
    color: colors.primary,
  },

  amountHelper: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },

  separateChargeNotice: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#EAF7F8",
  },

  separateChargeNoticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    color: "#356B75",
  },

  slider: {
    width: "100%",
    height: 44,
    marginTop: 10,
  },

  sliderLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sliderLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
  },

  option: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
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

  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

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
