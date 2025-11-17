import React from "react";
import { useTranslation } from "react-i18next";
import SocialSupportFormWizard from "../components/forms/SocialSupportFormWizard";

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 pt-8 max-w-4xl w-full">
      <div className="text-center mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-800">
          {t("appTitle", "Social Support Application")}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <SocialSupportFormWizard />
      </div>
    </div>
  );
};

export default HomePage;
