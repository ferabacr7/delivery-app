import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { createOrder } from "../services/orderService";
import { colors } from "../styles/theme";

export default function CreateOrderScreen() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  async function handleCreateOrder() {
    if (!description.trim()) {
      Alert.alert(t("common.error"), t("createOrder.required"));
      return;
    }

    try {
      setLoading(true);

      const { error } = await createOrder(description);

      if (error) {
        Alert.alert(t("common.error"), error.message);
        return;
      }

      Alert.alert(
        t("createOrder.successTitle"),
        t("createOrder.successMessage"),
      );

      setDescription("");
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

        <Option icon="image-outline" title={t("createOrder.referencePhoto")} />
        <Option
          icon="location-outline"
          title={t("createOrder.deliveryAddress")}
        />
        <Option
          icon="document-text-outline"
          title={t("createOrder.additionalNotes")}
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
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.option}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.optionText}>{title}</Text>
      <Ionicons name="chevron-forward" size={22} color={colors.muted} />
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
    marginTop: 28,
    marginBottom: 14,
    fontSize: 17,
    fontWeight: "900",
    color: colors.dark,
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
  optionText: { flex: 1, fontSize: 15, fontWeight: "800", color: colors.dark },
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
});
