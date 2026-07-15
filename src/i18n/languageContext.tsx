import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { Language } from "./translations";

const LANGUAGE_STORAGE_KEY = "@delivery_app_language";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  isLanguageLoading: boolean;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: async () => {},
  isLanguageLoading: true,
});

type LanguageProviderProps = {
  children: ReactNode;
};

function getDeviceLanguage(): Language {
  const deviceLanguage = getLocales()[0]?.languageCode;

  if (deviceLanguage === "en") {
    return "en";
  }

  return "es";
}

function isSupportedLanguage(value: string | null): value is Language {
  return value === "es" || value === "en";
}

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("es");
  const [isLanguageLoading, setIsLanguageLoading] = useState(true);

  useEffect(() => {
    loadInitialLanguage();
  }, []);

  async function loadInitialLanguage() {
    try {
      const savedLanguage = await AsyncStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      );

      if (isSupportedLanguage(savedLanguage)) {
        setLanguageState(savedLanguage);
        return;
      }

      setLanguageState(getDeviceLanguage());
    } catch (error) {
      console.error("Error loading language preference:", error);
      setLanguageState(getDeviceLanguage());
    } finally {
      setIsLanguageLoading(false);
    }
  }

  async function setLanguage(newLanguage: Language) {
    try {
      setLanguageState(newLanguage);

      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        newLanguage,
      );
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isLanguageLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}