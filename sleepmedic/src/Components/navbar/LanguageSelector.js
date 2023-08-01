// LanguageSelector.js

import React from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const LanguageSelector = () => {
    const [t, i18n] = useTranslation("global");

  const handleChangeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
    localStorage.setItem("i18nextLang", event.target.value)
    window.location.reload(false)
  };

  return (
    <Select
      title='Select your Language' 
      value={i18n.language}
      onChange={handleChangeLanguage}
      label={t('navbar.language')}
      sx={{ color: "white", fieldset: { border: "none" }}}
    >
      <MenuItem value="en">{t("language-select.en")}</MenuItem>
      <MenuItem value="es">{t("language-select.es")}</MenuItem>
      {/* Add more languages if needed */}
    </Select>
  );
};

export default LanguageSelector;