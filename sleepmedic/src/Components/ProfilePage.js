import "./ProfilePage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Button } from "@mui/material/";
import axios from "axios";
import { useState } from 'react';
import React from 'react';

//Shaun
function OpenProfilePage() {
    //implement logic for collecting parameters

    return (
        <div className="sleep-medic-container">
            <div className="profile-page-form">
                <h1>User Profile</h1>
                <Link to="/editgoal">
                    <Button variant="contained">Edit Your Goals</Button>
                </Link>
                <Link to="/notificationspage">
                    <Button variant="contained">Notification Preferences</Button>
                </Link>
                <Link to="/home">
                                    <Button variant="contained">Home</Button>
                                </Link>
            </div>
        </div>
    );
}

export default OpenProfilePage;