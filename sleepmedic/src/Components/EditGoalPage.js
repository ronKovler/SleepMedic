//import logo from '../logo.svg';
import "./EditGoalPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
//import { Link } from "react-router-dom";
import {TextField, Button } from "@mui/material/";
import axios from "axios";
import { valueToPercent } from '@mui/base';
import { useState } from 'react';
import React from 'react';

//Shaun
function EditGoal() {
    //implement logic for collecting parameters

    return (
        <div className="sleep-medic-container">
            <div className="edit-goal-form">
                <h1>Edit your Goals</h1>
                <Link to="/createreminder" style={{color: "gold"}}>Create a Reminder</Link>
                <Link to="/home">
                    <Button variant="contained">Home</Button>
                </Link>
            </div>
        </div>
    );
}

export default EditGoal;