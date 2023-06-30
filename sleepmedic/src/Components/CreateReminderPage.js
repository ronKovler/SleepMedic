import "./CreateReminderPage.css";
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import {TextField, Select, MenuItem, Button } from "@mui/material/";
import axios from "axios";
import { valueToPercent } from '@mui/base';
import React, { useState } from 'react';


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
    const [ReminderType, setRemType] = useState("None");
    const [ReminderTime, setRemTime] = useState('');
    const daysOfWeek = [{day: "Sun"}, {day:"Mon"}, {day:"Tues"}, {day:"Wed"}, {day:"Thu"}, {day:"Fri"}, {day:"Sat"}];
    const [checkedState, setCheckedState] = useState(
        new Array(daysOfWeek.length).fill(false)
    );
    const [RemTypeErrMsg, setRemTypeErrMsg] = useState("");
    const reminderTypeErrMsg = "Please specify a type of reminder to complete creation.";
    const [daysInputErrMsg, setDaysErrMsg] = useState("");
    const daysErrMsg = "You must select at least one day for your reminder.";
    const [timeErrMsg, setRemTimeErrMsg] = useState("");
    const emptyTimeInputMsg = "You must input a time to trigger the reminder.";
    const badTimeInputFormat = "Please input time in the following format; e.g. 10:45PM, 8:00AM"

    //handleChange() method for reminderType
    const handleOnChangeRemType = (value) => {
        setRemType(value);
        if (value != "None") {
            setRemTypeErrMsg("");
        }
    };

    //handleChange() method for checkboxes: maintains which days are selected by the user
    const handleOnChangeCB = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
          index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
        //if the updated position's value is true, then we know at least one box is checked, make sure errMsg is empty.
        if (updatedCheckedState[position] == true) {
            setDaysErrMsg("");
        }
    };

    const reminderTypeInputValidation = () => {
        if (ReminderType == "None") {
            //invoke state function
            setRemTypeErrMsg(reminderTypeErrMsg);
            return false;
        }
        return true;
    };

    const daysInputValidation = () => {
        //if there is at least one box selected, reset errMsg and return true
        let len = checkedState.length;
        for (let i = 0; i < len; i++) {
            if (checkedState[i] == true) {
                setDaysErrMsg("");
                return true;
            }
        }
        //otherwise setDaysErrMsg("Please select at least one day to complete reminder creation" and return false.
        setDaysErrMsg(daysErrMsg);
        return false;
    };

    /* Time input validation, set error message accordingly
        Should be in format: 00:00PM or AM
        if input is empty, prompt error message
        if input does not contain :, prompt error message
        if input does not have hours and minute in format of 00:00, prompt error message
        if input does not end in PM or AM, prompt error message.
    */
    const timeInputValidation = () => {
        if (ReminderTime === "") {
            setRemTimeErrMsg(emptyTimeInputMsg);
            return false;
        }
        const timePattern = /^(1[0-2]|0?[1-9]):[0-5][0-9](AM|PM)$/;
        if (!timePattern.test(ReminderTime)) {
            setRemTimeErrMsg(badTimeInputFormat);
            return false;
        }
        setRemTimeErrMsg("");
        return true;
    };

    //Main input validation function. Calls other specific inputValidation functions.
    const validate = () => {
        if (reminderTypeInputValidation() && daysInputValidation() && timeInputValidation()) {
            return true;
        }
        return false;
    };

    const handleCreateReminder = async(e) => {
        if (validate()) {
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
                reminderTypeInt = 0;
            }
            //grab ReminderTime and convert to the required format (hr:min:sec) (military)
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
                .map((isChecked, index) => (isChecked ? index : null))
                .filter((day) => day !== null);

            var headers = {
                "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
                "Authorization":'Bearer ' + tok
            }
            var reminderInfo = {
                triggerTime: formattedReminderTime, //Time at which reminder emails will be triggered on the chosen days
                triggerDays: selectedDays,          //a list of integers where 0 is Sun, 6 is Sat
                message: reminderTypeInt,           //1 or 2; Bedtime or General Sleep Reminder
            }
            try {
                let res = await axios.post("http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/reminder/create_reminder", reminderInfo, {headers});
                console.log(res);
            }
            catch (err) {
                console.log("Failed to send CreateReminder data.");
            }
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
             onChange={(e) => handleOnChangeRemType(e.target.value)}
            style={{ width: "230px" }} >
             <MenuItem value="None">None</MenuItem>
             <MenuItem value="Bedtime Reminder">Bedtime Reminder</MenuItem>
             <MenuItem value="Sleep Hygiene Reminder">Sleep Hygiene Reminder</MenuItem>
           </Select>
           <br/>
           <br/>
         <label htmlFor="reminder-type-err-msg">{RemTypeErrMsg}</label>
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
                        onChange={() => handleOnChangeCB(index)}
                    />
                    <label htmlFor={`custom-checkbox-${index}`}>{day}</label>
                </div>
                </li>
                );
            })}
         </div>
         <label htmlFor="days-input-err-msg">{daysInputErrMsg}</label>
         <div className="form-group">
           <label htmlFor="reminder-time">Reminder Time:</label>
           <input
             id="reminder-time"
             value={ReminderTime}
             onChange={(e) => setRemTime(e.target.value)}
           />
         </div>
         <label htmlFor="reminder-time-err-msg">{timeErrMsg}</label>
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