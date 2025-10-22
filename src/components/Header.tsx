import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Select, MenuItem, FormControl } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    // Set the initial language if available
    setLanguage(i18n.language || "en");
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value as string;
    changeLanguage(newLanguage);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full bg-blue-700 text-white shadow-lg z-50 h-[80px]"
      style={{ backgroundColor: "#1e40af", color: "white" }}
    >
      <div className="h-full flex items-center justify-end">
        <div className="flex items-center space-x-4">
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: 80, backgroundColor: "white", borderRadius: 1, margin: '0 16px' }}
          >
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              inputProps={{ "aria-label": "Language" }}
              sx={{
                color: "#1e40af",
                fontWeight: "bold",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1e40af",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1e40af",
                },
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="ar">AR</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </header>
  );
};

export default Header;
