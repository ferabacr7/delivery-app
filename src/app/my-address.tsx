import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import LocationPicker, { SelectedLocation } from "../components/LocationPicker";
import { useTranslation } from "../i18n/useTranslation";
import {
  createAddress,
  getAddressById,
  updateAddress,
} from "../services/addressService";
import { colors } from "../styles/theme";

type AddressRecord = {
  id: string;
  label: string;
  address_line: string;
  reference: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function MyAddressScreen() {
  const params = useLocalSearchParams<{
    addressId?: string | string[];
  }>();

  const rawAddressId = params.addressId;

  const addressId = Array.isArray(rawAddressId)
    ? rawAddressId[0]
    : rawAddressId;

  const isEditing = Boolean(addressId);

  const [addressLine, setAddressLine] = useState("");
  const [reference, setReference] = useState("");

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const [isLoadingAddress, setIsLoadingAddress] = useState(isEditing);

  const [isSaving, setIsSaving] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (isEditing && addressId) {
      loadAddress(addressId);
    }
  }, [addressId, isEditing]);

  async function loadAddress(currentAddressId: string) {
    try {
      setIsLoadingAddress(true);

      const { data, error } = await getAddressById(currentAddressId);

      if (error) {
        console.error("Error loading address:", error);

        Alert.alert(t("common.error"), t("addressForm.loadError"));

        router.replace("/my-addresses" as never);
        return;
      }

      if (!data) {
        Alert.alert(t("common.error"), t("addressForm.notFound"));

        router.replace("/my-addresses" as never);
        return;
      }

      const address = data as AddressRecord;

      setAddressLine(address.address_line ?? "");
      setReference(address.reference ?? "");

      if (
        typeof address.latitude === "number" &&
        typeof address.longitude === "number"
      ) {
        setCoordinates({
          latitude: address.latitude,
          longitude: address.longitude,
        });
      }
    } catch (error) {
      console.error("Unexpected error loading address:", error);

      Alert.alert(t("common.error"), t("addressForm.loadError"));
    } finally {
      setIsLoadingAddress(false);
    }
  }

  function handleLocationChange(selectedLocation: SelectedLocation) {
    setAddressLine(selectedLocation.addressLine);

    setCoordinates({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });
  }

  async function handleSaveAddress() {
    const trimmedAddressLine = addressLine.trim();
    const trimmedReference = reference.trim();

    if (!coordinates || !trimmedAddressLine) {
      Alert.alert(t("common.error"), t("addressForm.locationRequired"));

      return;
    }

    try {
      setIsSaving(true);

      const addressInput = {
        label: "Casa",
        addressLine: trimmedAddressLine,
        reference: trimmedReference,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        isDefault: true,
      };

      const result =
        isEditing && addressId
          ? await updateAddress(addressId, addressInput)
          : await createAddress(addressInput);

      if (result.error) {
        console.error("Error saving address:", result.error);

        Alert.alert(t("common.error"), result.error.message);

        return;
      }

      Alert.alert(
        t("addressForm.savedTitle"),
        isEditing
          ? t("addressForm.updatedMessage")
          : t("addressForm.savedMessage"),
      );

      router.replace("/my-addresses" as never);
    } catch (error) {
      console.error("Unexpected error saving address:", error);

      Alert.alert(t("common.error"), t("addressForm.saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    router.replace("/my-addresses" as never);
  }

  if (isLoadingAddress) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.primary} />

        <Text style={styles.loadingText}>{t("addressForm.loading")}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
        >
          <Text style={styles.back}>← {t("common.back")}</Text>
        </Pressable>

        <Text style={styles.title}>
          {isEditing ? t("addressForm.editTitle") : t("addressForm.title")}
        </Text>

        <LocationPicker
          initialLatitude={coordinates?.latitude}
          initialLongitude={coordinates?.longitude}
          initialAddressLine={addressLine}
          onLocationChange={handleLocationChange}
        />

        <Text style={styles.label}>{t("addressForm.additionalNotes")}</Text>

        <TextInput
          style={styles.textArea}
          value={reference}
          onChangeText={setReference}
          placeholder={t("addressForm.additionalNotesPlaceholder")}
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          returnKeyType="done"
          blurOnSubmit
          maxLength={300}
        />

        <Text style={styles.characterCount}>{reference.length}/300</Text>

        <Pressable
          style={[
            styles.button,
            (!coordinates || isSaving) && styles.buttonDisabled,
          ]}
          onPress={handleSaveAddress}
          disabled={!coordinates || isSaving}
          accessibilityRole="button"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color={colors.white}
              />

              <Text style={styles.buttonText}>{t("addressForm.save")}</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.muted,
  },

  backButton: {
    alignSelf: "flex-start",
  },

  back: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  title: {
    marginTop: 24,
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "900",
    color: colors.primary,
  },

  label: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    color: colors.dark,
  },

  textArea: {
    minHeight: 112,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    lineHeight: 23,
    color: colors.dark,
    backgroundColor: colors.white,
    textAlignVertical: "top",
  },

  characterCount: {
    marginTop: 6,
    textAlign: "right",
    fontSize: 12,
    color: colors.muted,
  },

  button: {
    marginTop: 28,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
});
