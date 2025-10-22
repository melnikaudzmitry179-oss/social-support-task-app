# Social Support Task App

A React + TypeScript + Vite application designed to help users apply for social support by providing an intuitive form wizard with AI-powered suggestions.

## Features

- Multi-step form wizard for social support applications
- AI-powered suggestions for form fields using OpenAI API
- Multi-language support (English and Arabic)
- Responsive design with Tailwind CSS
- Local storage for form data persistence

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm or yarn package manager

## How to Run the Project

1. **Clone or download the project** to your local machine

2. **Install dependencies** by running:
   ```bash
   npm install
   ```

3. **Set up environment variables** (see next section)

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173` to view the application

6. **(Optional) Start the JSON server** for local API functionality:
   ```bash
   npm run server
   ```

## How to Set up the OpenAI API Key

1. **Get an OpenAI API key** from [OpenAI](https://platform.openai.com/api-keys) or compatible service

2. **Create a `.env` file** in the root directory of the project (if it doesn't already exist)

3. **Add your API key** to the `.env` file:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

4. **Important**: Make sure the `.env` file is included in your `.gitignore` file to keep your API key secure

5. **Restart the development server** after adding the API key for the changes to take effect

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint to check for code issues
- `npm run preview` - Locally preview the production build
- `npm run server` - Starts a JSON server for local API functionality (port 3001)

## Project Structure

- `.gitignore` - Git ignore configuration
- `eslint.config.js` - ESLint configuration
- `index.html` - Main HTML entry point
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `postcss.config.js` - PostCSS configuration
- `README.md` - Project documentation
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.app.json` - TypeScript configuration for application
- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.node.json` - TypeScript configuration for Node.js
- `vite.config.ts` - Vite build configuration
- `public/` - Static assets
  - `public/vite.svg` - Vite logo asset
- `src/` - Main source code directory
  - `src/App.css` - Main application styles
  - `src/App.tsx` - Main application component
  - `src/index.css` - Global styles
  - `src/main.tsx` - Main entry point
  - `src/pages/` - Page components for the application
    - `pages/HomePage.tsx` - Home page component
  - `src/i18n/` - Internationalization configuration
    - `i18n/i18n.ts` - i18n setup and configuration
    - `i18n/translations.d.ts` - Translation type definitions
  - `src/api/` - API service files, including OpenAI integration
    - `src/api/formService.ts` - Form data service
    - `src/api/index.ts` - API index file
    - `src/api/openaiService.ts` - OpenAI service integration
  - `src/assets/` - Image and other asset files
    - `src/assets/react.svg` - React logo asset
  - `src/components/` - Reusable React components
    - `src/components/Header.tsx` - Header component
    - `src/components/forms/` - Form components for the social support application
      - `src/components/forms/FamilyFinancialInfoForm.tsx` - Family and financial information form
      - `src/components/forms/PersonalInfoForm.tsx` - Personal information form
      - `src/components/forms/SituationDescriptionsForm.tsx` - Situation descriptions form
      - `src/components/forms/SocialSupportFormWizard.tsx` - Main form wizard component
    - `src/components/popups/` - Popup components like AI suggestion popup
      - `src/components/popups/AiSuggestionPopup.tsx` - AI suggestion popup component
  - `src/context/` - React context for state management
    - `src/context/SocialSupportWizardContext.tsx` - Social support wizard context
    - `src/context/useSocialSupportWizard.ts` - Custom hook for wizard context
  - `src/hooks/` - Custom React hooks
    - `src/hooks/useAiSuggestion.ts` - Custom hook for AI suggestions
  - `src/layout/` - Layout components
    - `src/layout/Layout.tsx` - Main layout component
  - `src/styles/` - CSS style files
    - `src/styles/accessibility.css` - Accessibility styles
  - `src/translations/` - Language translation files
    - `src/translations/ar.json` - Arabic translations
    - `src/translations/en.json` - English translations
  - `src/types/` - TypeScript type definitions
    - `src/types/formTypes.ts` - Form-related type definitions
    - `src/types/translations.d.ts` - Translation type definitions
    - `src/types/wizardTypes.ts` - Wizard-related type definitions
  - `src/utils/` - Utility functions
    - `src/utils/i18n.util.ts` - i18n utility functions
    - `src/utils/localStorage.util.ts` - Local storage utility functions
    - `src/utils/validation.util.ts` - Validation utility functions
