import './App.css'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HomePage from './components/HomePage'

function App() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // Set document direction based on current language
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    
    // Update body class for RTL support
    if (i18n.language === 'ar') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
    
    const handleLanguageChange = () => {
      document.documentElement.lang = i18n.language;
      document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
      
      // Update body class for RTL support
      if (i18n.language === 'ar') {
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
      } else {
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <>
      <a href="#form-content" className="skip-link">
        {t('skipToMainContent', 'Skip to main content')}
      </a>
      <HomePage/>
    </>
  )
}

export default App
