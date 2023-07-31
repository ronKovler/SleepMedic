import "./CreateReminderPage.css";
import { BrowserRouter as Router, Routes, Link, Route, useNavigate } from 'react-router-dom';
import { InputLabel, FormHelperText, TextField, Select, MenuItem, Button, FormGroup, FormControlLabel } from "@mui/material/";
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from './navbar/Navbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { isMobile } from 'react-device-detect';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from "react-i18next";
import { MobileTimePicker } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from "axios";
import { valueToPercent } from '@mui/base';
import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import AddAlertOutlinedIcon from '@mui/icons-material/AddAlertOutlined';

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
    const [Carrier, setCarrier] = useState("none");
    const [t, i18n] = useTranslation("global");
    const [ReminderType, setRemType] = useState("Bedtime Reminder");
    //const [ReminderTime, setRemTime] = useState('');
    const [ReminderTime, setRemTime] = React.useState(today.set('hour', 22).set('minute', 30).set('second', 0));
    const [Timezone, setTimezone] = useState("Pacific");
    const daysOfWeek = [{ day: t("reminder.sun") }, { day: t("reminder.mon") }, { day: t("reminder.tue") }, { day: t("reminder.wed") }, { day: t("reminder.thu") }, { day: t("reminder.fri") }, { day: t("reminder.sat") }];
    const [checkedState, setCheckedState] = useState(
        [false, false, false, false, false, false, false]
    );
    const [RemTypeErrMsg, setRemTypeErrMsg] = useState("");
    const reminderTypeErrMsg = t("reminder.reminderTypeErrMsg");
    const [daysInputErrMsg, setDaysErrMsg] = useState(false);
    const daysErrMsg = t("reminder.daysErrMsg");
    const [timeErrMsg, setRemTimeErrMsg] = useState("");
    const emptyTimeInputMsg = t("reminder.emptyTimeInputMsg");
    const badTimeInputFormat = t("reminder.badTimeInputFormat");
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
        console.log('clicked ' + position)
        let tempData = [...checkedState];
        console.log('was ' + tempData[position]);
        tempData[position] = !tempData[position];
        console.log('is ' + tempData[position]);
        setCheckedState(tempData);
        tempData.forEach(v => {
            if (v) {
                setDaysErrMsg(false);
            }
        })
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
                setDaysErrMsg(false);
                return true;
            }
        }
        //otherwise setDaysErrMsg("Please select at least one day to complete reminder creation" and return false.
        setDaysErrMsg(true);
        return false;
    };

    //Main input validation function. Calls other specific inputValidation functions.
    const validate = () => {
        if (reminderTypeInputValidation() && daysInputValidation()) {
            return true;
        }
        return false;
    };

    const handleCreateReminder = async (e) => {
        if (validate()) {
            e.preventDefault();
            const cookies = getCookiesDict();
            let tok = cookies._auth;
            console.log('Create button clicked');
            //grabbing the carrier type
            let chosenCarrier;
            if (Carrier == "none") {
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
            else if (Timezone == "Mountain") {
                chosenTimezone = 1;
            }
            else if (Timezone == "Central") {
                chosenTimezone = 2;
            }
            else chosenTimezone = 3;    //Eastern

            //grabbing the days selected by user
            const selectedDays = checkedState
                .map((isChecked, index) => (isChecked ? index : null))
                .filter((day) => day !== null);

            var headers = {
                "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
                "Authorization": 'Bearer ' + tok
            }
            var reminderInfo = {
                carrier: chosenCarrier,
                timezone: chosenTimezone,
                triggerTime: militaryFormat,        //Time at which reminder emails will be triggered on the chosen days
                triggerDays: selectedDays,          //a list of integers where 0 is Sun, 6 is Sat
                message: reminderTypeInt,           //1 or 2; Bedtime or General Sleep Reminder
            }
            try {
                let res = await axios.post("https://api.sleepmedic.me:8443/reminder/create_reminder", reminderInfo, { headers });
                console.log(res);
                navigate("/profilepage");
            }
            catch (err) {
                console.log("Failed to send CreateReminder data.");
            }
        }
    };
    return (
        <Box sx={{
            /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
            background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
            animation: 'animazione 13s ease-in-out infinite alternate-reverse',

            height: '100vh',
            width: '100vw',
            overflowX: 'hidden'


        }}>
            <Navbar />

            <Grid spacing={2} sx={{ marginTop: '5%' }} container justifyContent="center" alignContent={'center'} direction={'column'} alignItems="center" >
                <Grid item xs>

                    <Paper elevation={3} sx={{ backgroundColor: '#D9D3E4', padding: 2, borderRadius: '1rem', minWidth: isMobile ? 300 : 320 }}>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                fontWeight: 'bold',
                                color: 'black',
                                padding: '10px',
                                textAlign: 'center'
                            }}
                        >
                            {t("reminder.title")}
                        </Typography>
                        {/* Carrier Selection */}
                        <Box display="flex" justifyContent="center" alignContent={'center'} >
                            <FormControl
                                sx={{ width: '70%', marginTop: '10pt' }}>
                                <InputLabel sx={{ color: 'black' }} color="secondary" >{t("reminder.carrierPrompt")}</InputLabel>
                                <Select sx={{ backgroundColor: 'white' }} labelId="Carrier Type" id="carrier-type" value={Carrier} label="To enable SMS notifications, please select your carrier" onChange={(e) => handleOnChangeCarrier(e.target.value)}>
                                    <MenuItem value="none">{t("reminder.emailPrefered")}</MenuItem>
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
                            </FormControl>
                        </Box>


                        <Box display="flex" justifyContent="center" alignContent={'center'} >
                            <FormControl
                                sx={{ width: '70%', marginTop: '10pt' }}>
                                <InputLabel sx={{ color: 'black' }} color="secondary" >{t("reminder.reminderTypePrompt")}</InputLabel>
                                <Select sx={{ backgroundColor: 'white' }} labelId="Reminder Type" id="reminder-type" value={ReminderType} label="What type of reminder do you want?" onChange={(e) => handleOnChangeRemType(e.target.value)} >
                                    <MenuItem value="Bedtime Reminder">{t("reminder.bedtimeReminder")}</MenuItem>
                                    <MenuItem value="Sleep Hygiene Reminder">{t("reminder.sleepHygieneReminder")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>


                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,

                                color: 'black',
                                paddingTop: '10px',
                                textAlign: 'center'
                            }}>
                            {t("reminder.triggerDaysPrompt")}
                        </Typography>
                        <Box display="flex" justifyContent="center" alignContent={'center'} >
                            <FormControl error={daysInputErrMsg}>
                                <FormGroup 
                                    sx={{ '& .MuiFormControlLabel-root': { margin: 0 } }} style={{ input: { boxSizing: 'border-box' } }} row={true}>
                                    <FormControlLabel  control={<Checkbox checked={checkedState[0]} onClick={() => handleOnChangeCB(0)} />} labelPlacement={"bottom"} label={t("reminder.sun")} sx={{ m: 1 }} />
                                    <FormControlLabel control={<Checkbox checked={checkedState[1]} onClick={() => handleOnChangeCB(1)} />} labelPlacement={"bottom"} label={t("reminder.mon")} sx={{ m: 1 }} />
                                    <FormControlLabel control={<Checkbox checked={checkedState[2]} onChange={() => handleOnChangeCB(2)} />} labelPlacement={"bottom"} label={t("reminder.tue")} sx={{ m: 1 }} />
                                    <FormControlLabel control={<Checkbox checked={checkedState[3]} onChange={() => handleOnChangeCB(3)} />} labelPlacement={"bottom"} label={t("reminder.wed")} sx={{ m: 1 }} />
                                    <FormControlLabel control={<Checkbox checked={checkedState[4]} onChange={() => handleOnChangeCB(4)} />} labelPlacement={"bottom"} label={t("reminder.thu")} sx={{ m: 1 }} />
                                    <FormControlLabel control={<Checkbox checked={checkedState[5]} onChange={() => handleOnChangeCB(5)} />} labelPlacement={"bottom"} label={t("reminder.fri")} sx={{ m: 1 }} />
                                    <FormControlLabel control={<Checkbox checked={checkedState[6]} onChange={() => handleOnChangeCB(6)} />} labelPlacement={"bottom"} label={t("reminder.sat")} sx={{ m: 1 }} />
                                    
                                </FormGroup>
                                <FormHelperText >{daysInputErrMsg ? t('reminder.daysErrMsg'): null}</FormHelperText>
                            </FormControl>
                            
                        </Box>

                        <Box display="flex" justifyContent="center" alignContent={'center'} >

                        </Box>

                        <Grid container direction={'row'} justifyContent={'center'}>
                            <FormControl
                                sx={{ width: '30%', marginTop: '10pt', marginRight: '5pt' }}>
                                <InputLabel shrink={true} sx={{ color: 'black' }} color="secondary" >{t("reminder.reminder-time")}</InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileTimePicker sx={{ backgroundColor: 'white' }} label={t("reminder.reminder-time")} value={ReminderTime} onChange={(newTime) => setRemTime(newTime)} />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl
                                sx={{ width: '30%', marginTop: '10pt', marginLeft: '5pt' }}>
                                <InputLabel sx={{ color: 'black' }} color="secondary" >{t("reminder.timezone")}</InputLabel>
                                <Select sx={{ backgroundColor: 'white' }} labelId="Timezone" id="Timezone" value={Timezone} label="Timezone" onChange={(e) => handleOnChangeTimezone(e.target.value)}>
                                    <MenuItem value="Pacific">{t("reminder.pacific")}</MenuItem>
                                    <MenuItem value="Mountain">{t("reminder.mountain")}</MenuItem>
                                    <MenuItem value="Central">{t("reminder.central")}</MenuItem>
                                    <MenuItem value="Eastern">{t("reminder.eastern")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>


                        <Typography variant="body" component="div" color="black" fontSize="14pt">
                            {/* Submitting and Canceling */}
                            <Box display="flex" justifyContent="center" paddingTop='20pt'>
                                <Box flexGrow={1} paddingRight="5px">
                                    <Button href="/profilepage" variant='outlined' fullWidth>{t("reminder.cancel")}</Button>
                                </Box>
                                <Box flexGrow={1} paddingLeft="5px">
                                    <Button variant='contained' endIcon={<AddAlertOutlinedIcon />} onClick={handleCreateReminder} fullWidth>{t("reminder.create")}</Button>
                                </Box>
                            </Box>
                        </Typography>
                    </Paper>

                </Grid>
            </Grid>
        </Box>
    );
}

export default CreateRem;