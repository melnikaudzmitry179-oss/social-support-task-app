import React from "react";
import SocialSupportFormWizard from "./SocialSupportFormWizard";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Social Support Application
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <SocialSupportFormWizard />
      </div>
    </div>
  );
};

export default HomePage;
