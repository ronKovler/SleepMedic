//import logo from '../logo.svg';
import "./CreateReminderPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
//import { Link } from "react-router-dom";
import {TextField } from "@mui/material/";
import axios from "axios";
import { valueToPercent } from '@mui/base';
import { useState } from 'react';
import React from 'react';

//Shaun
function CreateRem() {
    const [ReminderType, setRemType] = useState('');
    const [ReminderTime, setRemTime] = useState('');
    const [ReminderName, setRemName] = useState('');
    //implement logic for collecting parameters
    //


    return (
        <div className="sleep-medic-container">
            <div className="create-rem-form">
                <h1>Create a Reminder</h1>
                <label>
                Reminder Type:
                <input
                    value={ReminderType}
                    onChange = {e => setRemType(e.target.value)}
                />
                </label>
                <br/>
                <label>
                Reminder Time:
                <input
                    value={ReminderTime}
                    onChange = {e => setRemTime(e.target.value)}
                />
                </label>
                <br/>
                <label>
                Reminder Name:
                <input
                    value={ReminderName}
                    onChange = {e => setRemName(e.target.value)}
                />
                </label>
            </div>
        </div>
    );
}

export default CreateRem;