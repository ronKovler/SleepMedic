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
    //const [ReminderName, setRemName] = useState('');
    const daysOfWeek = [{day: "Sun"}, {day:"Mon"}, {day:"Tues"}, {day:"Wed"}, {day:"Thu"}, {day:"Fri"}, {day:"Sat"}];
    const [checkedState, setCheckedState] = useState(
        new Array(daysOfWeek.length).fill(false)
    );
    //state-set function for setRemTypeErrMsg
    const [RemTypeErrMsg, setRemTypeErrMsg] = useState("");
    //state-set function for setDaysErrMsg
    //state-set function for setRemTimeErrMsg

    //handleChange() method for checkboxes: maintains which days are selected by the user
    const handleOnChangeCB = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
          index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
        //if the checkedState.get(position) is true, then remove the setDaysErrMsg
    };

    /* reminderTypeInputValidation, set error message accordingly
        The drop-down MUST be set to something besides "None"
    */
    const reminderTypeInputValidation = () => {
        if (ReminderType == "None") {
            //invoke state function
            setRemTypeErrMsg("Please choose a reminder type to complete reminder creation.")
            return false;
        }
        return true;
    }

    /* daysInputValidation, set error message accordingly
        at least one day (checkbox) should be selected.
    */
    const daysInputValidation = () => {

        return true;
    }

    /* Time input validation, set error message accordingly
        Should be in format: 00:00PM or AM
        if input is empty, prompt error message
        if input does not contain :, prompt error message
        if input does not have hours and minute in format of 00:00, prompt error message
        if input does not end in PM or AM, prompt error message.
    */
    const timeInputValidation = () => {

        return true;
    }

    //TODO: input validation - are days selected? is there a time specified? Has it been inputted in the correct format?
    /* Main input validation
        call reminderTypeInputValidation, set error message accordingly
        call daysInputValidation, set error message accordingly
        call timeInputValidation, set error message accordingly
        Error messages should be displayed on the right side of their respective component
    */
    const validate = () => {
        //call your specific input functions here.
        if (reminderTypeInputValidation() || daysInputValidation() || timeInputValidation()) {
            return false;
        }
        return true;
    }

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
                reminderTypeInt = 0; // Default value when ReminderType is "None" <-- comment this line out when input validation is finished.
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
             onChange={(e) => setRemType(e.target.value)}    //TODO: implement informational box rendering.
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