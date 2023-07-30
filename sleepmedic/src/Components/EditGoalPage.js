//import logo from '../logo.svg';
import "./EditGoalPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
//import { Link } from "react-router-dom";
import {TextField, Button } from "@mui/material/";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { valueToPercent } from '@mui/base';
import { useState } from 'react';
import React from 'react';

//Shaun
function EditGoal() {
    //implement logic for collecting parameters
    const [t, i18n] = useTranslation("global");

    return (
        <div className="sleep-medic-container">
            <div className="edit-goal-form">
                <h1>{t("editGoals.title")}</h1>
                <Link to="/createreminder">{t("editGoals.create-reminder")}</Link>
                <Link to="/home">
                    <Button variant="contained">{t("editGoals.home")}</Button>
                </Link>
            </div>
        </div>
    );
}

export default EditGoal;