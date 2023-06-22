//import logo from '../logo.svg';
import "./CreateReminderPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import {TextField } from "@mui/material/";
import axios from "axios";
import { valueToPercent } from '@mui/base';
import { useState } from 'react';
import React from 'react';

//Shaun
function CreateRem() {
    //implement logic for collecting parameters

    return (
        <div className="sleep-medic-container">
            <div className="create-rem-form">
                <h1>Create a Reminder</h1>
            </div>
        </div>
    );
}

export default CreateRem;