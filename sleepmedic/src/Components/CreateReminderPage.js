import "./CreateReminderPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Select, MenuItem, Button } from "@mui/material/";
import axios from "axios";
import { valueToPercent } from '@mui/base';
import React, { useState } from 'react';
//import React from 'react';


function getCookiesDict() {
    let cookies = document.cookie.split("; ");
    let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
        acc[key] = val.join('=');
        return acc;
    }, {});
    return cookiesDict;
}

//Shaun
function CreateRem() {
    const [ReminderType, changeRemType] = useState("None");
    const [ReminderTime, setRemTime] = useState('');
    const [ReminderName, setRemName] = useState('');
    const daysOfWeek = [{day: "Mon"}, {day:"Tue"}, {day:"Wed"}, {day:"Thu"}, {day:"Fri"}, {day:"Sat"}, {day:"Sun"}];
    const [checkedState, setCheckedState] = useState(
        new Array(daysOfWeek.length).fill(false)
    );
    //handleChange() for checkboxes
    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
          index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    };

    const handleCreateReminder = async(e) => {
        e.preventDefault();
        const cookies = getCookiesDict();
        let tok = cookies._auth;
        console.log('Create button clicked');
        //grabbing reminderType
        let reminderTypeInt;
        if (ReminderType == "Bedtime Reminder") {
            reminderTypeInt = 1;
        } else if (ReminderType === "Sleep Hygiene Reminder") {
            reminderTypeInt = 2;
        } else {
            reminderTypeInt = 0; // Default value when ReminderType is "None"
        }
        //convert ReminderTime to the required format (hr-min)
        const [time, clock] = ReminderTime.split(/(?<=[0-9]{2})(?=[AP]M)/);
        const [hours, minutes] = time.split(":");
        let formattedHours = parseInt(hours, 10); // Parse hours as integer
        if (clock === "PM") {
          if (formattedHours !== 12) {
            formattedHours += 12; // Add 12 hours for PM format (except when it's 12PM)
          }
        } else if (formattedHours === 12) {
          formattedHours = 0; // Convert 12 AM to 0 hours
        }
        const formattedMinutes = minutes.padStart(2, '0'); // Pad minutes with leading zero if necessary
        const formattedReminderTime = `${formattedHours}:${formattedMinutes}:00`;
        //grabbing the days selected by user
        const selectedDays = checkedState
            .map((isChecked, index) => (isChecked ? index + 1 : null))
            .filter((day) => day !== null);
        //headers
        var headers = {
                "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
                "Authorization":'Bearer ' + tok
        }
        var reminderInfo = {
            //time: hr-min
            triggerTime: formattedReminderTime,
            //days - as list of integers where 1 is Monday.
            triggerDays: selectedDays,
            //ReminderType ; 1-2 (Bedtime or General Reminder)
            message: reminderTypeInt,
            /////all in JSON message
        }
        try {
               //this is supposed to be POST right?
               let res = await axios.post("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/reminder/create_reminder", reminderInfo, {headers});
               console.log(res);
        }
       catch (err) {
            console.log("Failed to send CreateReminder data.");
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
            style={{ width: "230px" }} >
             <MenuItem value="None">None</MenuItem>
             <MenuItem value="Bedtime Reminder">Bedtime Reminder</MenuItem>
             <MenuItem value="Sleep Hygiene Reminder">Sleep Hygiene Reminder</MenuItem>
           </Select>
         </div>
         <div className="days-list">
            {daysOfWeek.map(({day}, index) => {
                return(
                <li key={index}>
                <div className="days-list-item">
                    <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={day}
                        value={day}
                        checked={checkedState[index]}
                        onChange={() => handleOnChange(index)}
                    />
                    <label htmlFor={`custom-checkbox-${index}`}>{day}</label>
                </div>
                </li>
                );
            })}
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
            <Button variant="contained" onClick={handleCreateReminder}>Create</Button>
         </div>
       </div>
     </div>
    );
}

export default CreateRem;