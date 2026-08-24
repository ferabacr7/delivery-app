import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import { deleteMyAccount } from "../services/authService";
import { colors } from "../styles/theme";

export default function DeleteAccountScreen() {
  const { language } = useTranslation();
  const [deleting, setDeleting] = useState(false);

  async function performDeletion() {
    try {
      setDeleting(true);

      const { data, error } =
        await deleteMyAccount();

      if (error) {
        const errorMessage =
          data?.error ??
          error.message;

        if (
          errorMessage ===
          "ACTIVE_ORDER_EXISTS"
        ) {
          Alert.alert(
            language === "es"
              ? "No se puede eliminar"
              : "Account cannot be deleted",
            language === "es"
              ? "Tenés un pedido activo. Completalo o cancelalo antes de eliminar tu cuenta."
              : "You have an active order. Complete or cancel it before deleting your account.",
          );

          return;
        }

        Alert.alert(
          language === "es"
            ? "Error"
            : "Error",
          language === "es"
            ? "No pudimos eliminar tu cuenta. Intentá de nuevo."
            : "We could not delete your account. Please try again.",
        );

        return;
      }

      Alert.alert(
        language === "es"
          ? "Cuenta eliminada"
          : "Account deleted",
        language === "es"
          ? "Tu cuenta fue eliminada correctamente."
          : "Your account was deleted successfully.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace(
                "/welcome" as never,
              ),
          },
        ],
      );
    } catch (error) {
      console.error(
        "DELETE ACCOUNT ERROR:",
        error,
      );

      Alert.alert(
        language === "es"
          ? "Error"
          : "Error",
        language === "es"
          ? "Ocurrió un error inesperado. Intentá de nuevo."
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleDeletePress() {
    Alert.alert(
      language === "es"
        ? "Eliminar cuenta"
        : "Delete account",
      language === "es"
        ? "Esta acción eliminará tu acceso a ORBIT y anonimizará tus datos personales. Esta acción no se puede deshacer."
        : "This action will remove your access to ORBIT and anonymize your personal data. This action cannot be undone.",
      [
        {
          text:
            language === "es"
              ? "Cancelar"
              : "Cancel",
          style: "cancel",
        },
        {
          text:
            language === "es"
              ? "Continuar"
              : "Continue",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              language === "es"
                ? "¿Eliminar definitivamente?"
                : "Delete permanently?",
              language === "es"
                ? "No podrás recuperar esta cuenta después de eliminarla."
                : "You will not be able to recover this account after deletion.",
              [
                {
                  text:
                    language === "es"
                      ? "Cancelar"
                      : "Cancel",
                  style: "cancel",
                },
                {
                  text:
                    language === "es"
                      ? "Eliminar cuenta"
                      : "Delete account",
                  style: "destructive",
                  onPress: () => {
                    void performDeletion();
                  },
                },
              ],
            );
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.primary}
          />

          <Text style={styles.backText}>
            {language === "es"
              ? "Atrás"
              : "Back"}
          </Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="trash-outline"
              size={30}
              color="#C62828"
            />
          </View>

          <Text style={styles.title}>
            {language === "es"
              ? "Eliminar cuenta"
              : "Delete account"}
          </Text>

          <Text style={styles.subtitle}>
            {language === "es"
              ? "Podés eliminar permanentemente tu cuenta de ORBIT desde aquí."
              : "You can permanently delete your ORBIT account from here."}
          </Text>
        </View>

        <View style={styles.warningCard}>
          <Ionicons
            name="warning-outline"
            size={25}
            color="#C62828"
          />

          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>
              {language === "es"
                ? "Antes de continuar"
                : "Before you continue"}
            </Text>

            <Text style={styles.warningText}>
              {language === "es"
                ? "Al eliminar tu cuenta, perderás el acceso a ORBIT. Tus datos personales serán eliminados o anonimizados según corresponda. El historial operativo necesario puede conservarse de forma anonimizada."
                : "When you delete your account, you will lose access to ORBIT. Your personal data will be deleted or anonymized as appropriate. Necessary operational history may be retained in anonymized form."}
            </Text>

            <Text style={styles.warningText}>
              {language === "es"
                ? "No podrás eliminar la cuenta mientras tengás un pedido activo."
                : "You cannot delete your account while you have an active order."}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.deleteButton,
            deleting &&
              styles.buttonDisabled,
          ]}
          onPress={handleDeletePress}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <>
              <Ionicons
                name="trash-outline"
                size={22}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.deleteButtonText
                }
              >
                {language === "es"
                  ? "Eliminar mi cuenta"
                  : "Delete my account"}
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  backText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  header: {
    marginTop: 28,
    marginBottom: 28,
  },

  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor:
      "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.dark,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },

  warningCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F2C7C7",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  warningContent: {
    flex: 1,
  },

  warningTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#C62828",
    marginBottom: 8,
  },

  warningText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.dark,
    marginBottom: 8,
  },

  deleteButton: {
    marginTop: 28,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#C62828",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});