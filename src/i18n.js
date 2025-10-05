import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { navbarTranslations } from "./constants/i18nConstants/navbarTranslations";
import { landingTranslations } from "./constants/i18nConstants/landingTranslations";
import { joinStateHeadTranslations } from "./constants/i18nConstants/joinStateHeeadTranslations";
import { footerTranslations } from "./constants/i18nConstants/footerTranslations";
import { stateHeadTranslations } from "./constants/i18nConstants/stateHeadTranslations";
import { profileFormTranslations } from "./constants/i18nConstants/profileFormTranslations";
import { userDetailsTranslations } from "./constants/i18nConstants/userDetailsTranslations";
import { raiseVoiceTranslations } from "./constants/i18nConstants/raiseVoiceTranslations";
import { districtAuthorityGuidelines } from "./constants/i18nConstants/districtAuthorityGuidelines";
import { efficiencyTranslations } from "./constants/i18nConstants/efficiencyTranslations";
const resources = {
  en: {
    translation: {
      ...navbarTranslations.en,
      ...landingTranslations.en,
      ...joinStateHeadTranslations.en,
      ...footerTranslations.en,
      ...stateHeadTranslations.en,
      ...profileFormTranslations.en,
      ...userDetailsTranslations.en,
      ...raiseVoiceTranslations.en,
      ...districtAuthorityGuidelines.en,
      ...efficiencyTranslations.en,
    },
  },
  ta: {
    translation: {
      ...navbarTranslations.ta,
      ...landingTranslations.ta,
      ...joinStateHeadTranslations.ta,
      ...footerTranslations.ta,
      ...stateHeadTranslations.ta,
      ...profileFormTranslations.ta,
      ...userDetailsTranslations.ta,
      ...raiseVoiceTranslations.ta,
      ...districtAuthorityGuidelines.ta,
      ...efficiencyTranslations.ta,
    },
  },
  ur: {
    translation: {
      ...navbarTranslations.ur,
      ...landingTranslations.ur,
      ...joinStateHeadTranslations.ur,
      ...footerTranslations.ur,
      ...stateHeadTranslations.ur,
      ...profileFormTranslations.ur,
      ...userDetailsTranslations.ur,
      ...raiseVoiceTranslations.ur,
      ...districtAuthorityGuidelines.ur,
      ...efficiencyTranslations.ur,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
