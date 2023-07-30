import "./NotificationsPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Button } from "@mui/material/";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useState } from 'react';
import React from 'react';
import ReactSwitch from 'react-switch';

//Shaun
function OpenNotificationsPage() {
    //implement logic for collecting parameters
    const [checked, setChecked] = useState(true);
    const [t, i18n] = useTranslation("global");

      const handleChange = val => {
        setChecked(val)
      }

    return (
        <div className="sleep-medic-container">
            <div className="notif-page-form">
                <h1>{t("notificationPage.title")}</h1>
                <Button variant="contained">{t("notificationPage.optInOut")}</Button>
                <ReactSwitch
                        checked={checked}
                        onChange={handleChange}
                      />
                <br/>
                <Link to="/profilepage">
                            <Button variant="contained">{t("notificationPage.back")}</Button>
                            </Link>
            </div>
        </div>
    );
}

export default OpenNotificationsPage;