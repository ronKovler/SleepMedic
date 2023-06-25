import "./NotificationsPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Button } from "@mui/material/";
import axios from "axios";
import { useState } from 'react';
import React from 'react';

//Shaun
function OpenNotificationsPage() {
    //implement logic for collecting parameters

    return (
        <div className="sleep-medic-container">
            <div className="notif-page-form">
                <h1>Notification Preferences</h1>
                <Button variant="contained">Opt-in/Opt-Out</Button>
                <br/>
                <Link to="/profilepage">
                            <Button variant="contained">Back</Button>
                            </Link>
            </div>
        </div>
    );
}

export default OpenNotificationsPage;