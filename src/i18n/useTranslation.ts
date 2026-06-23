import { useContext } from "react";
import { LanguageContext } from "./languageContext";
import { translations } from "./translations";

export function useTranslation() {
  const { language } = useContext(LanguageContext);

  function t(path: string) {
    const keys = path.split(".");

    let value: any = translations[language];

    for (const key of keys) {
      value = value?.[key];
    }

    return value ?? path;
  }

  return {
    language,
    t,
  };
}
