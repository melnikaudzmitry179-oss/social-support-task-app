import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import HomePage from "../pages/HomePage";

const Layout: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const updateDocumentDirection = (language: string) => {
    document.documentElement.lang = language;
    const direction = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.body.classList.toggle("rtl", direction === "rtl");
    document.body.classList.toggle("ltr", direction === "ltr");
  };

  useEffect(() => {
    updateDocumentDirection(i18n.language);
    const handleLanguageChangeInternal = (lng: string) =>
      updateDocumentDirection(lng);

    i18n.on("languageChanged", handleLanguageChangeInternal);

    return () => {
      i18n.off("languageChanged", handleLanguageChangeInternal);
    };
  }, [i18n]);

  const renderContent = () => {
    switch (location.pathname) {
      case "/":
        return <HomePage />;
      default:
        return <Outlet />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex justify-center w-full mt-[80px]">
        <main className="max-w-[1200px] px-8 flex-grow pb-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;
