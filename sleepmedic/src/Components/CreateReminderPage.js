import "./CreateReminderPage.css";
import { BrowserRouter as Router, Routes, Link, Route, useNavigate } from 'react-router-dom';
import {TextField, Select, MenuItem, Button } from "@mui/material/";
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from './navbar/Navbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {isMobile} from 'react-device-detect';
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
                navigate("/profilepage");
            }
            catch (err) {
                console.log("Failed to send CreateReminder data.");
            }
        }
    };
    return (
     <div className="create-rem-container">
     <Navbar />
     <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
             <Grid item xs={12} sm={8} md={6} lg={4}>
               {/* Use xs, sm, md, lg breakpoints to adjust the size of the Paper */}
               <Box textAlign="center">
                 <Paper elevation={3} sx={{ backgroundColor: '#D9D3E4', padding: '20px' }}>
                    <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                        {"Create a Reminder"}
                   </Typography>
                   <Typography variant="body" component="div" color="black" fontSize="14pt">
                                        {"More content"}
                                      </Typography>
                 </Paper>
               </Box>
             </Grid>
           </Grid>
     </div>
    );
}

export default CreateRem;