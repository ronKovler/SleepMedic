import "./NotificationsPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Button } from "@mui/material/";
import axios from "axios";
import { useState } from 'react';
import React from 'react';
import ReactSwitch from 'react-switch';

//Shaun
function OpenNotificationsPage() {
    //implement logic for collecting parameters
    const [checked, setChecked] = useState(true);

      const handleChange = val => {
        setChecked(val)
      }

    return (
        <div className="sleep-medic-container">
            <div className="notif-page-form">
                <h1>Notification Preferences</h1>
                <Button variant="contained">Opt-in/Opt-Out</Button>
                <ReactSwitch
                        checked={checked}
                        onChange={handleChange}
                      />
                <br/>
                <Link to="/profilepage">
                            <Button variant="contained">Back</Button>
                            </Link>
            </div>
        </div>
    );
}

export default OpenNotificationsPage;