import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import {
  isValidPassword,
  signUp,
} from "../services/authService";
import { colors } from "../styles/theme";

export default function RegisterScreen() {
  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    isRegistering,
    setIsRegistering,
  ] = useState(false);

  const { t, language } =
    useTranslation();

  const passwordRule =
    language === "es"
      ? "Mínimo 8 caracteres, incluyendo una letra, un número y un símbolo."
      : "Minimum 8 characters, including a letter, a number, and a symbol.";

  async function handleRegister() {
    if (isRegistering) {
      return;
    }

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password
    ) {
      Alert.alert(
        t(
          "register.requiredTitle",
        ),
        t(
          "register.requiredMessage",
        ),
      );

      return;
    }

    if (
      !isValidPassword(password)
    ) {
      Alert.alert(
        t(
          "register.errorTitle",
        ),
        passwordRule,
      );

      return;
    }

    try {
      setIsRegistering(true);

      const { error } =
        await signUp(
          email.trim(),
          password,
          fullName.trim(),
          phone.trim(),
        );

      if (error) {
        Alert.alert(
          t(
            "register.errorTitle",
          ),
          error.message,
        );

        return;
      }

      Alert.alert(
        t(
          "register.successTitle",
        ),
        t(
          "register.successMessage",
        ),
        [
          {
            text: "OK",
            onPress: () =>
              router.push("/"),
          },
        ],
      );
    } catch (error) {
      console.error(
        "Unexpected register error:",
        error,
      );

      Alert.alert(
        t(
          "register.errorTitle",
        ),
        t("common.error"),
      );
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <View
      style={styles.container}
    >
      <Image
        source={require("../../assets/images/imagenlogin.png")}
        style={
          styles.backgroundImage
        }
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        style={
          styles.keyboardContainer
        }
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <View
            style={styles.overlay}
          >
            <View
              style={
                styles.formSection
              }
            >
              <Text
                style={styles.title}
              >
                {t(
                  "register.title",
                )}
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                {t(
                  "register.subtitle",
                )}
              </Text>

              {/* FULL NAME */}
              <View
                style={
                  styles.inputContainer
                }
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666666"
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder={t(
                    "register.fullName",
                  )}
                  placeholderTextColor="#777777"
                  autoCapitalize="words"
                  autoCorrect={
                    false
                  }
                  value={fullName}
                  onChangeText={
                    setFullName
                  }
                  editable={
                    !isRegistering
                  }
                />
              </View>

              {/* PHONE */}
              <View
                style={
                  styles.inputContainer
                }
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#666666"
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder={t(
                    "register.phone",
                  )}
                  placeholderTextColor="#777777"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={
                    setPhone
                  }
                  editable={
                    !isRegistering
                  }
                />
              </View>

              {/* EMAIL */}
              <View
                style={
                  styles.inputContainer
                }
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666666"
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder={t(
                    "register.email",
                  )}
                  placeholderTextColor="#777777"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                  keyboardType="email-address"
                  value={email}
                  onChangeText={
                    setEmail
                  }
                  editable={
                    !isRegistering
                  }
                />
              </View>

              {/* PASSWORD */}
              <View
                style={
                  styles.inputContainer
                }
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666666"
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder={t(
                    "register.password",
                  )}
                  placeholderTextColor="#777777"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                  value={password}
                  onChangeText={
                    setPassword
                  }
                  editable={
                    !isRegistering
                  }
                />
              </View>

              <Text
                style={
                  styles.passwordRule
                }
              >
                {passwordRule}
              </Text>

              {/* REGISTER BUTTON */}
              <Pressable
                style={[
                  styles.button,
                  isRegistering &&
                    styles.buttonDisabled,
                ]}
                onPress={
                  handleRegister
                }
                disabled={
                  isRegistering
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {isRegistering
                    ? t(
                        "register.registering",
                      )
                    : t(
                        "register.registerButton",
                      )}
                </Text>
              </Pressable>

              {/* BACK */}
              <Pressable
                onPress={() =>
                  router.push("/")
                }
                disabled={
                  isRegistering
                }
              >
                <Text
                  style={[
                    styles.link,
                    isRegistering &&
                      styles.linkDisabled,
                  ]}
                >
                  {t(
                    "register.backHome",
                  )}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },

    keyboardContainer: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
    },

    overlay: {
      flexGrow: 1,
      justifyContent:
        "center",
      paddingHorizontal: 28,
      paddingTop: 20,
      paddingBottom: 40,
      backgroundColor:
        "rgba(255,255,255,0.32)",
    },

    formSection: {
      width: "100%",
      marginTop: 160,
    },

    title: {
      marginBottom: 8,
      color: colors.dark,
      fontSize: 28,
      fontWeight: "900",
      textAlign: "center",
    },

    subtitle: {
      marginBottom: 18,
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
    },

    inputContainer: {
      width: "84%",
      height: 54,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      paddingHorizontal: 16,
      borderRadius: 16,
      backgroundColor:
        "rgba(255,255,255,0.68)",
    },

    inputIcon: {
      marginRight: 10,
    },

    input: {
      flex: 1,
      height: "100%",
      paddingVertical: 0,
      color: colors.dark,
      fontSize: 16,
    },

    passwordRule: {
      width: "84%",
      alignSelf: "center",
      marginTop: -2,
      marginBottom: 12,
      paddingHorizontal: 4,
      color: colors.muted,
      fontSize: 12,
      lineHeight: 17,
    },

    button: {
      width: "52%",
      height: 46,
      alignSelf: "center",
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 4,
      borderRadius: 15,
      backgroundColor:
        colors.primary,
    },

    buttonDisabled: {
      opacity: 0.65,
    },

    buttonText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: "900",
    },

    link: {
      marginTop: 14,
      color: colors.primary,
      fontSize: 15,
      fontWeight: "800",
      textAlign: "center",
    },

    linkDisabled: {
      opacity: 0.5,
    },
  });