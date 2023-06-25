import "./CreateReminderPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Select, MenuItem, Button } from "@mui/material/";
import axios from "axios";
import { valueToPercent } from '@mui/base';
import { useState } from 'react';
import React from 'react';

//Shaun
function CreateRem() {
    const [ReminderType, changeRemType] = useState("None");
    const [ReminderTime, setRemTime] = useState('');
    const [ReminderName, setRemName] = useState('');
    //implement logic for collecting parameters
    const handleCreate = () => {
        console.log('Create button clicked');
        // Handle create button click behavior here
        //headers
        var headers = {
            "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
            "Content-Type": 'application/json; charset=utf-8',
        }
        //reminder Information - Type, Reminder
        var reminderInfo = {
            //time - hr:hr:-min-min
            //days - as list of integers where 1 is Monday.
            //msg

            /////all in JSON message

        }
        try {

        }
        catch {

        }
    };



    return (
     <div className="sleep-medic-container">
       <div className="create-rem-form">
<h1>Create a Reminder</h1>
         <div className="form-group">
           <label htmlFor="reminder-type">Reminder Type:</label>
           &nbsp;
           <Select
             labelId="Reminder Type"
             id="reminder-type"
             value={ReminderType}
             label="Reminder Type"
             onChange={(e) => changeRemType(e.target.value)}   //do onChange={(e) => stuff
            style={{ width: "230px" }} // Set the width of the Select component
           >
             <MenuItem value="None">None</MenuItem>
             <MenuItem value="Bedtime Reminder">Bedtime Reminder</MenuItem>
             <MenuItem value="Sleep Hygiene Reminder">Sleep Hygiene Reminder</MenuItem>
           </Select>
         </div>
         <div className="form-group">
           <label htmlFor="reminder-time">Reminder Time:</label>
           <input
             id="reminder-time"
             value={ReminderTime}
             onChange={(e) => setRemTime(e.target.value)}
           />
         </div>

         <div className="button-group">
            <Link to="/editgoal">
            <Button variant="contained">Cancel</Button>
            </Link>
            <Button variant="contained" onClick={handleCreate}>Create</Button>
         </div>
       </div>
     </div>
    );
}

export default CreateRem;