import { useTranslation } from "react-i18next";
import styles from "./LanguageSelector.module.scss";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => handleChange("pt")}
        className={`${styles.button} ${i18n.language === "pt" ? styles.active : ""}`}
      >
        PT
      </button>
      <button
        onClick={() => handleChange("en")}
        className={`${styles.button} ${i18n.language === "en" ? styles.active : ""}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
