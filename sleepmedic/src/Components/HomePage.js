//import logo from '../logo.svg';
import "./HomePage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import {TextField } from "@mui/material/";
import axios from "axios";
import { valueToPercent } from '@mui/base';
import { useState } from 'react';
import React from 'react';

//Shaun
function OpenHomePage() {
    //implement logic for collecting parameters

    return (
        <div className="sleep-medic-container">
            <div className="home-page-form">
                <h1>Sleep-Medic Home Page</h1>
                <br/>
                <Link to="/editgoal" style={{color: "gold"}}>Edit Your Goal</Link>
            </div>
        </div>
    );
}

export default OpenProfilePage;