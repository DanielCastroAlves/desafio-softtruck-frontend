import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSelector.module.scss";

const LANGUAGES = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className={styles.container}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`${styles.button} ${i18n.language === lang.code ? styles.active : ""}`}
          aria-label={`Change language to ${lang.label}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
