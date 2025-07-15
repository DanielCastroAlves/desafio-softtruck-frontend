import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: "6px",
        padding: "6px 12px",
        display: "flex",
        gap: "8px",
        zIndex: 20,
      }}
    >
      <button
        onClick={() => handleChange("pt")}
        style={{
          background: i18n.language === "pt" ? "#3b9ddd" : "transparent",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        PT
      </button>
      <button
        onClick={() => handleChange("en")}
        style={{
          background: i18n.language === "en" ? "#3b9ddd" : "transparent",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
