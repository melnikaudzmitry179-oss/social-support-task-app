import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import SocialSupportFormWizard from "./SocialSupportFormWizard";

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {t('appTitle')}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('ar')}
            className={`px-3 py-1 rounded ${language === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            aria-label="التبديل إلى العربية"
          >
            AR
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <SocialSupportFormWizard />
      </div>
    </div>
  );
};

export default HomePage;
