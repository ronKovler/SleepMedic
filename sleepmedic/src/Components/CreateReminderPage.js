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
    <Box  sx={{
                /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
            background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
            animation: 'animazione 13s ease-in-out infinite alternate-reverse',

            height: '100vh' ,
            width: '100vw',
            overflowX: 'hidden'


    }}>
        <Navbar />
        <Grid container spacing={2} columns={1} sx={{margin: 0, paddingRight: 4, paddingTop: 0, justifyContent: 'center', alignContent: 'center'}}>
                        <Grid item sx>
                            <Paper elevation={3} sx={{backgroundColor: '#7293A0'}}>
                                <Typography
                                variant="h4"
                                component="div"
                                sx={{flexGrow: 1,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    padding: '10px',
                                    textAlign: 'center'}}
                                    >
                                    Create a Reminder
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
        <Grid container justifyContent="center" direction={'row'} alignItems="center" sx={{ height: '70vh' }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Box textAlign="center">
                    <Paper elevation={10} sx={{ backgroundColor: '#D9D3E4', padding: '10px'}}>
                        <Typography variant="body" component="div" color="black" fontSize="14pt">
                            {/* Carrier Selection */}
                            <Box display="flex" justifyContent="center">
                                <label htmlFor="reminder-method">To enable SMS notifications, please select your carrier:</label>
                            </Box>
                            <Select labelId="Carrier Type" id="carrier-type" value={Carrier} label="Carrier Type" onChange={(e) => handleOnChangeCarrier(e.target.value)}
                            style={{ width: "230px", marginTop: '10pt' }}>
                                <MenuItem value="No, email it">No, email it</MenuItem>
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
                        </Typography>

                        <Typography variant="body" component="div" color="black" fontSize="14pt">
                            {/* Reminder Type Selection */}
                            <Box display="flex" justifyContent="center">
                                <label htmlFor="reminder-type" sx={{ marginBottom: '10px', textAlign: 'center' }}>Reminder Type:</label>
                            </Box>
                            <Select labelId="Reminder Type" id="reminder-type" value={ReminderType} label="Reminder Type" onChange={(e) => handleOnChangeRemType(e.target.value)} style={{ width: "230px", marginTop: '10pt' }} >
                                <MenuItem value="None">None</MenuItem>
                                <MenuItem value="Bedtime Reminder">Bedtime Reminder</MenuItem>
                                <MenuItem value="Sleep Hygiene Reminder">Sleep Hygiene Reminder</MenuItem>
                            </Select>
                            <Box display="flex" justifyContent="center">
                                <label htmlFor="reminder-type-err-msg" style={{ color: 'crimson' }}>{RemTypeErrMsg}</label>
                            </Box>
                            <br/>
                        </Typography>

                        <Typography variant="body" component="div" color="black" fontSize="14pt" justifyContent="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            {/* Choosing the days of the week */}
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
                            <Box display="flex" justifyContent="center">
                                <label htmlFor="days-input-err-msg" style={{ color: 'crimson' }}>{daysInputErrMsg}</label>
                            </Box>
                            <br/>
                        </Typography>

                        <Typography variant="body" component="div" color="black" fontSize="14pt" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Picking the time for the reminder */}
                            <label htmlFor="reminder-time" sx={{textAlign: 'center' }}>Reminder Time:</label>

                            <FormControl sx={{display: 'flex', flexDirection: 'row', marginTop: '10pt'}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker value={ReminderTime} onChange={(newTime) => setRemTime(newTime)}/>
                                        </LocalizationProvider>
                            </FormControl>
                            <br/>
                        </Typography>

                        <Typography variant="body" component="div" color="black" fontSize="14pt">
                            {/* Picking the timezone */}
                            <Box display="flex" justifyContent="center">
                                <label htmlFor="Timezone" sx={{ marginBottom: '10px', textAlign: 'center' }}>Timezone:</label>
                            </Box>
                            <Select labelId="Timezone" id="Timezone" value={Timezone} label="Timezone" onChange={(e) => handleOnChangeTimezone(e.target.value)} style={{ width: "230px", marginTop: '10pt'}} >
                                <MenuItem value="Pacific">Pacific</MenuItem>
                                <MenuItem value="Mountain">Mountain</MenuItem>
                                <MenuItem value="Central">Central</MenuItem>
                                <MenuItem value="Eastern">Eastern</MenuItem>
                            </Select>
                        </Typography>

                        <Typography variant="body" component="div" color="black" fontSize="14pt">
                            {/* Submitting and Canceling */}
                          <Box display="flex" justifyContent="center" paddingTop='20pt'>
                            <Box flexGrow={1} paddingRight="5px">
                              <Button href="/profilepage" variant='contained' fullWidth>Cancel</Button>
                            </Box>
                            <Box flexGrow={1} paddingLeft="5px">
                              <Button variant='contained' onClick={handleCreateReminder} fullWidth>Create</Button>
                            </Box>
                          </Box>
                        </Typography>
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    </Box>
    );
}

export default CreateRem;