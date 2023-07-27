import "./CreateReminderPage.css";
import { BrowserRouter as Router, Routes, Link, Route, useNavigate } from 'react-router-dom';
import {TextField, Select, MenuItem, Button } from "@mui/material/";
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
    const today = dayjs();
    const [Carrier, setCarrier] = useState("No, email it");
    const [ReminderType, setRemType] = useState("None");
    //const [ReminderTime, setRemTime] = useState('');
    const[ReminderTime, setRemTime] = React.useState(today.set('hour', 22).set('minute',  30).set('second', 0));
    const [Timezone, setTimezone] = useState("Pacific");
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
    const navigate = useNavigate();

    //handleChange() method for Carrier
    const handleOnChangeCarrier = (value) => {
        setCarrier(value);
    };

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

    //handleChange() method for Timezone
        const handleOnChangeTimezone = (value) => {
            setTimezone(value);
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

    //Main input validation function. Calls other specific inputValidation functions.
    const validate = () => {
        if (reminderTypeInputValidation() && daysInputValidation()) {
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
            //grabbing the carrier type
            let chosenCarrier;
            if (Carrier == "No, email it") {
                chosenCarrier = null;
            }
            else chosenCarrier = Carrier;

            //grabbing reminderType
            let reminderTypeInt;
            if (ReminderType == "Bedtime Reminder") {
                reminderTypeInt = 1;
            } else if (ReminderType === "Sleep Hygiene Reminder") {
                reminderTypeInt = 2;
            } else {
                reminderTypeInt = 0;
            }

            console.log("ReminderTime is: " + ReminderTime)
            //grab ReminderTime and convert to the required format (hr:min:sec) (military)
            const militaryFormat = dayjs(ReminderTime).format('HH:mm:ss');
            console.log("military format of ReminderTime is: " + militaryFormat)

            //grabbing the timezone selected by user
            let chosenTimezone;
            if (Timezone == "Pacific") {
                chosenTimezone = 0;
            }
            else if (Timezone == "Mountain")    {
                chosenTimezone = 1;
            }
            else if (Timezone == "Central")    {
                chosenTimezone = 2;
            }
            else chosenTimezone = 3;    //Eastern

            //grabbing the days selected by user
            const selectedDays = checkedState
                .map((isChecked, index) => (isChecked ? index : null))
                .filter((day) => day !== null);

            var headers = {
                "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
                "Authorization":'Bearer ' + tok
            }
            var reminderInfo = {
                carrier: chosenCarrier,
                timezone: chosenTimezone,
                triggerTime: militaryFormat,        //Time at which reminder emails will be triggered on the chosen days
                triggerDays: selectedDays,          //a list of integers where 0 is Sun, 6 is Sat
                message: reminderTypeInt,           //1 or 2; Bedtime or General Sleep Reminder
            }
            try {
                let res = await axios.post("https://api.sleepmedic.me:8443/reminder/create_reminder", reminderInfo, {headers});
                console.log(res);
                navigate("/editgoal");
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
           <label htmlFor="reminder-method">To enable SMS notifications, please select your carrier:</label>
           <br/>
           &nbsp;
           <Select
                labelId="Carrier Type"
                id="carrier-type"
                value={Carrier}
                label="Carrier Type"
                onChange={(e) => handleOnChangeCarrier(e.target.value)}
                style={{ width: "230px" }} >
                <MenuItem value="No, email it">No, email it </MenuItem>
                <MenuItem value="AT&T">AT&T</MenuItem>
                <MenuItem value="Boost Mobile">Boost Mobile</MenuItem>
                <MenuItem value="Consumer Cellular">Consumer Cellular</MenuItem>
                <MenuItem value="Cricket Wireless">Cricket Wireless</MenuItem>
                <MenuItem value="Google Fi Wireless">Google Fi Wireless</MenuItem>
                <MenuItem value="MetroPCS">MetroPCS</MenuItem>
                <MenuItem value="Sprint">Sprint</MenuItem>
                <MenuItem value="T-Mobile">T-Mobile</MenuItem>
                <MenuItem value="U.S. Cellular">U.S. Cellular</MenuItem>
                <MenuItem value="Verizon">Verizon</MenuItem>
                <MenuItem value="Xfinity Mobile">Xfinity Mobile</MenuItem>
           </Select>
           <br/>
           <br/>
           <br/>
           <label htmlFor="reminder-type">Reminder Type:</label>
           <br/>
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

         {/* Time Input */}
         <FormControl sx={{width: '30%', marginTop: '20pt'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker label="Reminder Time" value={ReminderTime} onChange={(newTime) => setRemTime(newTime)}/>
            </LocalizationProvider>
         </FormControl>

         <label htmlFor="Timezone">Timezone:
         <Select
                         labelId="Timezone"
                         id="Timezone"
                         value={Timezone}
                         label="Timezone"
                         onChange={(e) => handleOnChangeTimezone(e.target.value)}
                         style={{ width: "230px" }} >
                         <MenuItem value="Pacific">Pacific</MenuItem>
                         <MenuItem value="Mountain">Mountain</MenuItem>
                         <MenuItem value="Central">Central</MenuItem>
                         <MenuItem value="Eastern">Eastern</MenuItem>
                    </Select>
                    </label>
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