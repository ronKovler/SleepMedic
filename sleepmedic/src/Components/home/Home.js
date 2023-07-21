/*
 *  Home page for Sleep Medic app
 */
import dayjs from 'dayjs';
import * as React from 'react';
import axios from "axios";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from '../navbar/Navbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
//import TextField from '@material-ui/core/TextField';
import TextField from '@mui/material/TextField'; // Add this line
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Label } from 'recharts';
import { Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const calendarTheme = createTheme({
    palette: {
        text: {
            primary: '#ffffff',
            secondary: '#ffffff',
        },
    }
});




const MARKS = [
    {value: 1, label: <SentimentVeryDissatisfiedIcon/>},
    {value: 2, label: <SentimentDissatisfiedIcon/>},
    {value: 3, label: <SentimentNeutralIcon/>},
    {value: 4, label: <SentimentSatisfiedIcon/>},
    {value: 5, label: <SentimentVerySatisfiedIcon/>},
]

const FIELDS_SPECIFICATION = `
Fields Explanation: 
Fall asleep is the time you take to fall asleep.
Restlessness is the level of restless you felt when you decide to sleep.
Sleep duration is the amount of time you take for a continous sleep.
Woke up time is the total count of you wake up in the middle of the night.
`;

function getCurrentWeek() {
    let now = new Date();
    // start of week (Sunday)
    let startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    // End of week (Saturday)
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
  
    function formatDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return `${month}/${day}`;
    }
    return `${formatDate(startOfWeek)}-${formatDate(endOfWeek)}`;
}

function getCookiesDict() {
    let cookies = document.cookie.split("; ");
    let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
        acc[key] = val.join('=');
        return acc;
    }, {});
    return cookiesDict;
}

function getGetHeaders() {
    const cookies = getCookiesDict();
    const headers = {
        "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
        "Authorization":'Bearer ' + cookies._auth
    };
    return headers; 
}

function getPostHeaders() {
    const cookies = getCookiesDict();
    const headers = {
        "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
        "Content-Type": 'application/json; charset=utf-8',
        "Authorization":'Bearer ' + cookies._auth
    };
    return headers;
}

var headers = {
    "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
    "Content-Type": 'application/json; charset=utf-8',
}


function makeBooleanCheckbox(title, value, onChangeFunction) {
    return (
        <FormControl sx={{width: '100%', marginTop: '20pt'}}>
            <Grid container columns={2} justify='flex-end' alignItems='center'>
                <Grid item xs={1}>
                    <Box>
                        {title}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                    <Checkbox checked={value} onChange={(e)=>{onChangeFunction(e.target.checked)}}/>
                </Box>
                </Grid>
            </Grid>
        </FormControl>
    )
}

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


export default function Home() {
    const [t, i18n] = useTranslation("global");
    const navigate = useNavigate();
    // Control of popup sleep record window
    const[recordOpen, setRecordOpen] = React.useState(false);
    const [isNewRecord, setIsNewRecord] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    
    // User data
    // INFO
    const[username, setUsername] = React.useState('User Name');
    // AVG STATISTICS
    const[avgFallTime, setAvgFallTime] = React.useState('0');
    const[avgQuality, setAvgQuality] = React.useState('0');
    const[avgWakeTime, setAvgWakeTime] = React.useState('00:00');
    const[avgDownTime, setAvgDownTime] = React.useState('00:00');
    const[avgUpTime, setAvgUpTime] = React.useState('00:00'); 
    const[avgSleepTime, setAvgSleepTime] = React.useState('00:00');
    const[avgAwakeTime, setAvgAwakeTime] = React.useState('0');
    const[avgEfficiency, setAvgEfficiency] = React.useState('0');
    const[effAdvice, setEffAdvice] = React.useState("1");
    const[avgHoursSlept, setAvgHoursSlept] = React.useState(0.0);

    const [width, setWidth]   = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);
    const updateDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }
    React.useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    function makeBooleanCheckbox(title, value, onChangeFunction) {
        return (
            <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                <Grid container columns={2} justify='flex-end' alignItems='center'>
                    <Grid item xs={1}>
                        <Box>
                            {title}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                    <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <Checkbox checked={value} onChange={(e)=>{onChangeFunction(e.target.checked)}}/>
                    </Box>
                    </Grid>
                </Grid>
                {value && title === "Did you have any dreams?" && (
                    <TextField
                      style={{ textAlign: 'left', marginTop: '10pt' }}
                      //label="If so, feel free to jot some notes"
                      multiline
                      rows={2}
                      value={dreams}
                      onChange={(e) => setDreams(e.target.value)}
                    />
                  )}
            </FormControl>
        )
    }

    // New record data
    // Date
    const today = dayjs();
    const[recordDate, setRecordDate] = React.useState(today);
    // Integer
    const[quality, setQuality] = React.useState(0); 
    const[fallTime, setFallTime] = React.useState(0); 
    const[awakeTime, setAwakeTime] = React.useState(0);
    // Time
    const[downTime, setDownTime] = React.useState(today.set('hour', 22).set('minute',  30).set('second', 0)); 
    const[sleepTime, setSleepTime] = React.useState(today.set('hour', 23).set('minute',  30).set('second', 0));
    const[wakeTime, setWakeTime] = React.useState(today.set('hour', 8).set('minute',  30).set('second', 0));
    const[upTime, setUpTime] = React.useState(today.set('hour', 9).set('minute',  30).set('second', 0));
    // Boolean
    const[physicalActivity, setPhysicalActivity] = React.useState(false);
    const[naps, setNaps] = React.useState(false);
    const[caffeineConsumption, setCaffeineConsumption] = React.useState(false);
    const[alcoholConsumption, setAlcoholConsumption] = React.useState(false);
    const[electronics, setElectronics] = React.useState(false);
    const[difficultStayingAsleep, setDifficultStayingAsleep] = React.useState(false);
    const[difficultFallingAsleep, setDifficultFallingAsleep] = React.useState(false);
    const[racingThoughts, setRacingThoughts] = React.useState(false);
    // String: Dream & Description
    const[dreams, setDreams] = React.useState("");
    const[dreamsCB, setDreamsCB] = React.useState(false);


    // Record update
    const[monthRecords, setMonthRecords] = React.useState([]);
    const[editMode, setEditMode] = React.useState(false);
    const[recordId, setRecordID] = React.useState(0);

    function RecordedDays(props) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
      
        let isSelected =
          !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

        var f_date = `${day.get('year')}-${(day.get('month') + 1).toString().padStart(2, '0')}-${day.get('date').toString().padStart(2, '0')}`;
        if (monthRecords.includes(f_date)) {
            isSelected = true;
        }
        else {
            isSelected = false;
        }
      
        return (
          <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? '😴' : undefined}
          >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
          </Badge>
        );
    }

    const handleRestlessnessChange = (e, value) => {
        setQuality(value);
    };

    /*
    * This is meant for getData() only rn, make sure you check what its taking in in getData()
    */
    function getFormattedTime(time) {
        console.log("got time: " + time)
        time = time.slice(0, 5);
        let hours = parseInt(time.slice(0, 2), 10);
        let remainder = time.slice(2);
        if (hours > 21) {
            hours -= 12;
            return hours + remainder;
        } else if (hours > 12) {
            hours -= 12;
            return "0" + hours + remainder;
        } else if (hours > 9) {
            return hours + remainder;
        }
        return "0" + hours + remainder;
    }

    function setPieData(res) {
        setAvgDownTime(getFormattedTime(res.data.downTime));
        setAvgSleepTime(getFormattedTime(res.data.sleepTime));
        console.log(avgSleepTime)
        setAvgWakeTime(getFormattedTime(res.data.wakeTime));
        setAvgUpTime(getFormattedTime(res.data.upTime));
        let downTimeTemp = res.data.downTime.split(":");
        downTimeTemp = {name: 'down', value: parseInt(downTimeTemp[0]) + (parseFloat(downTimeTemp[1]) / 60)};
        let sleepTimeTemp = res.data.sleepTime.split(":");
        sleepTimeTemp = {name: 'sleep', value: parseInt(sleepTimeTemp[0]) + (parseFloat(sleepTimeTemp[1]) / 60)};
        let wakeTimeTemp = res.data.wakeTime.split(":");
        wakeTimeTemp = {name: 'wake', value: parseInt(wakeTimeTemp[0]) + (parseFloat(wakeTimeTemp[1]) / 60)};
        let upTimeTemp = res.data.upTime.split(":");
        upTimeTemp = {name: 'up', value: parseInt(upTimeTemp[0]) + (parseFloat(upTimeTemp[1]) / 60)};
        let times = [downTimeTemp, sleepTimeTemp, wakeTimeTemp, upTimeTemp].sort(function(a,b){return a.value - b.value});
        let tempPM = [];
        let tempAM = [];

        times.forEach(element => {
            if (element.value < 12) {
                tempAM.push(element);
            } else {
                tempPM.push(element);
            }
        })
        
        // tempAM and tempPM should now be sorted.
        let pm = [];
        let am = [];
        let count = 0;
        let tempLabel = "PM\n";
        tempPM.forEach(element => {
            let elapsedTime = 0;
            if (count === 0) {
                elapsedTime = element.value - 12;
            } else {
                elapsedTime = element.value - tempPM[count - 1].value;
                tempLabel += '\n';
            }

            if (element.name === 'down') {
                pm.push({name: 'Out of Bed', value: elapsedTime});
                tempLabel += '🔽@' + avgDownTime;
            } else if (element.name === 'wake') {
                pm.push({name: 'Asleep', value: elapsedTime, fill: '#173e5c'});
                tempLabel += '⏰@' + avgWakeTime;
            } else {
                // Handles both sleep and up
                pm.push({name: 'In Bed', value: elapsedTime, fill: '#82ca9d'});
                if (element.name === 'sleep') {
                    tempLabel += '💤@' + avgSleepTime;
                } else {
                    tempLabel += '🔼@' + avgUpTime;
                }
            }

            if (count === tempPM.length - 1) {
                // This was the last one, extend to the end with what should follow
                elapsedTime = 24 - element.value;
                if (element.name === 'sleep'){
                    pm.push({name: 'Asleep', value: elapsedTime, fill: '#173e5c'});
                } else if (element.name === 'up') {
                    pm.push({name: 'Out of Bed', value: elapsedTime})
                } else {
                    // Handles wake and down
                    pm.push({name: 'In Bed', value: elapsedTime, fill: '#82ca9d'});
                } 
            }
            count += 1;
        })
        count = 0;
        setPiePmLabel(tempLabel);
        tempLabel = "AM\n";
        tempAM.forEach(element => {
            let elapsedTime = 0;
            if (count === 0) {
                elapsedTime = element.value;
            } else {
                elapsedTime = element.value - tempAM[count - 1].value;
                tempLabel += '\n';
            }

            if (element.name === 'down') {
                am.push({name: 'Out of Bed', value: elapsedTime});
                tempLabel += '🔽 : ' + avgDownTime;
            } else if (element.name === 'wake') {
                am.push({name: 'Asleep', value: elapsedTime, fill: '#173e5c'});
                tempLabel += '⏰@' + avgWakeTime;
            } else {
                // Handles both sleep and up
                am.push({name: 'In Bed', value: elapsedTime, fill: '#82ca9d'});
                if (element.name === 'sleep') {
                    tempLabel += '💤@' + avgSleepTime;
                } else {
                    tempLabel += '🔼@' + avgUpTime;
                }
            }

            if (count === tempAM.length - 1) {
                // This was the last one, extend to the end with what should follow
                elapsedTime = 12 - element.value;
                if (element.name === 'sleep'){
                    am.push({name: 'Asleep', value: elapsedTime, fill: '#173e5c'});
                } else if (element.name === 'up') {
                    am.push({name: 'Out of Bed', value: elapsedTime})
                } else {
                    // Handles wake and down
                    am.push({name: 'In Bed', value: elapsedTime, fill: '#82ca9d'});
                } 
            }
            count += 1;
        })
        setPieAmLabel(tempLabel);
        setPieAmData(am.reverse());
        setPiePmData(pm.reverse());
        
        
        setPieEffLabel('🔋' + (res.data.efficiency * 100).toFixed(1) + '%');
        setPieEffData([{name: '0', value: 1 - res.data.efficiency}, {name: '1', value: res.data.efficiency, fill: '#2f875d'}])
    }

    async function getData() {
        const headers = getGetHeaders();
        //console.log(headers);
        
        try {
            // Get user name
            let res = await axios.get("https://api.sleepmedic.me:8443/home/info", {headers});
            let name = res.data.firstName + ' ' + res.data.lastName;
            setUsername(name);

            //Get Calendar
            const date = new Date();
            let currentDate = date.toISOString().slice(0, 10);
            console.log(currentDate);
            res = await axios.get("https://api.sleepmedic.me:8443/home/calendar/" + currentDate, {headers});
            setMonthRecords(res.data);
            console.log(res.data);


            // Get user average sleep data
            res = await axios.get("https://api.sleepmedic.me:8443/home/average", {headers});
            console.log(res.data);
            setAvgFallTime(res.data.fallTime + " min");
            setAvgAwakeTime(res.data.awakeTime + " min");
            setAvgQuality(res.data.quality);
            
            
            setPieData(res);
            setAvgEfficiency(res.data.efficiency);
            setAvgHoursSlept(res.data.hoursSlept + " hrs");

            if (Math.abs(res.data.efficiency * 100 - 90) < 3) {
                setEffAdvice("2");
            }

        }
        catch (err) {
            console.log("Failed to retrieve data.");
        }
    }

    function formateDate(day) {
        let monthFix = day.get('month') + 1; 
        return `${day.get('year')}-${monthFix.toString().padStart(2, '0')}-${day.get('date').toString().padStart(2, '0')}`;
    }

    function formatRecord() {
        // TODO: add the boolean & String values to the record, format them as needed
        let monthFix = recordDate.get('month') + 1; 
        const f_date = `${recordDate.get('year')}-${monthFix.toString().padStart(2, '0')}-${recordDate.get('date').toString().padStart(2, '0')}`;
        const f_downTime = `${downTime.get('hour').toString().padStart(2, '0')}:${downTime.get('minute').toString().padStart(2, '0')}:00`;
        const f_sleepTime = `${sleepTime.get('hour').toString().padStart(2, '0')}:${sleepTime.get('minute').toString().padStart(2, '0')}:00`;
        const f_wakeTime = `${wakeTime.get('hour').toString().padStart(2, '0')}:${wakeTime.get('minute').toString().padStart(2, '0')}:00`;
        const f_upTime = `${upTime.get('hour').toString().padStart(2, '0')}:${upTime.get('minute').toString().padStart(2, '0')}:00`;
        console.log(f_downTime);

        return { 
            date: f_date,
            sleepTime: f_sleepTime,
            wakeTime: f_wakeTime,
            quality: quality,
            downTime: f_downTime,
            fallTime: parseInt(fallTime),
            awakeTime: parseInt(awakeTime),
            upTime: f_upTime,
            //sleep journal data below (qualitative)
            physicalActivity: physicalActivity,
            naps: naps,
            caffeineConsumption: caffeineConsumption,
            alcoholConsumption: alcoholConsumption,
            electronics: electronics,
            difficultStayingAsleep: difficultStayingAsleep,
            difficultFallingAsleep: difficultFallingAsleep,
            racingThoughts: racingThoughts,
            dreams: dreams
        };
    }

    const DreamTextField = ({ value }) => {
      return (
        <TextField
          style={{ textAlign: 'left' }}
          label="Message Field" // Updated prop name
          multiline
          rows={2}
          value={value}
          onChange={(e) => {}}
        />
      );
    };

//handleOnChange function for dream checkbox. Render textfield based on box state.
    const handleOnChangeDreamCB = (checked) => {
        setDreamsCB(checked);
        if (!checked) {
            setDreams(""); // Clear the dreams text field content if the checkbox is unchecked
        }
    };

    const handleSubmit = async (e) => {
        const headers = getPostHeaders();

        // if (recordDate > today) {
        //     alert('You cannot record future data. Please try again.');
        //     setRecordOpen(false);
        //     resetInput();
        //     return;
        // }

        //add a flag/indicator for edit vs create new record.
        if (editMode) {
            try {
                let record = formatRecord();
                let res = await axios.patch("https://api.sleepmedic.me:8443/home/update_record/" + recordId, record, {headers});
            }
            catch (err2) {
                console.log("Failed to update record.");
            }
        }
        else {
            try {
                let record = formatRecord();
                let res = await axios.post("https://api.sleepmedic.me:8443/home/create_record", record, {headers});
            }
            catch (err) {
                alert("You already have a record for this date! Please modify the existing one instead.");
                console.log('Failed to create record.');
            }
        }
        /*try {
            let record = formatRecord();
            let res = await axios.post("https://api.sleepmedic.me:8443/home/create_record", record, {headers});
        }
        catch (err) {
            alert("Already recorded!");
            console.log('Failed to create record.');
        }*/
        setRecordOpen(false);
        setEditMode(false);
        resetInput();
        getData(); // Reload averages and calendar incase update/create changes them.
    }

    // Auto loading
    React.useEffect(() => {
        //Check if not logged in and redirect.
        const cookies = getCookiesDict();
        if (cookies._auth == null) {
            navigate("/")
        }
        //Get Data
        console.log("USED effect");
        getData();
    }, [avgDownTime, avgSleepTime, avgWakeTime, avgUpTime, avgEfficiency]);

    
    // Popup window handlers
    function resetInput() {
        // TODO: reset all booleans to default values (false), String to empty string
        setPage(1);
        setRecordDate(today);
        setQuality(0);
        setFallTime(0);
        setAwakeTime(0);
        setDownTime(today.set('hour', 22).set('minute',  30).set('second', 0));
        setSleepTime(today.set('hour', 23).set('minute',  30).set('second', 0));
        setWakeTime(today.set('hour', 8).set('minute',  30).set('second', 0));
        setUpTime(today.set('hour', 9).set('minute',  30).set('second', 0));
        setDifficultFallingAsleep(false);
        setDifficultStayingAsleep(false);
        setPhysicalActivity(false);
        setNaps(false);
        setAlcoholConsumption(false);
        setCaffeineConsumption(false);
        setElectronics(false);
        setRacingThoughts(false);
        setDreamsCB(false);
        setDreams("");
    }
    const handleClickOpen = () => {
        setIsNewRecord(true);
        setRecordOpen(true);
    };
    const handleClose = () => {
        setRecordOpen(false);
        setEditMode(false);
        resetInput();
    };

    const handleNewCalendarDates = async (newMonthClicked) => {
        console.log('Selected day', newMonthClicked.$d)
        const formattedDate = dayjs(newMonthClicked.$d).format('YYYY-MM-DD');
        const headers  = getGetHeaders();

        let res = await axios.get("https://api.sleepmedic.me:8443/home/calendar/" + formattedDate, {headers});
        setMonthRecords(res.data);
    }

    const handleOpenEditForm = async (dayClicked) => {
        console.log('Selected day', dayClicked.$d)
        const formattedDate = dayjs(dayClicked.$d).format('YYYY-MM-DD');
        console.log('Formatted date', formattedDate);
        const headers = getGetHeaders();
        if (!monthRecords.includes(formattedDate)) {
            alert('No record found for the date ' + formattedDate);
            return;
        }
        setRecordOpen(true);
        setEditMode(true);
        //console.log(res.data);
        try {
            let res = await axios.get("https://api.sleepmedic.me:8443/home/view_record/" + formattedDate, {headers});
            console.log(res.data);
            setRecordID(res.data.recordID);

            //set the calendar field
            setRecordDate(dayClicked);

            // Set the time fields
            setFallTime(res.data.fallTime);
            setAwakeTime(res.data.awakeTime);
            //set time picker fields
            setDownTime(dayjs(res.data.downTime, 'HH:mm'));
            setSleepTime(dayjs(res.data.sleepTime, 'HH:mm'));
            setWakeTime(dayjs(res.data.wakeTime, 'HH:mm'));
            setUpTime(dayjs(res.data.upTime, 'HH:mm'));

            //set the quality slider
            setQuality(res.data.quality);

            //set the boolean fields - journal data
            setPhysicalActivity(res.data.physicalActivity);

            setNaps(res.data.naps);

            setCaffeineConsumption(res.data.caffeineConsumption);

            setAlcoholConsumption(res.data.alcoholConsumption);
            setElectronics(res.data.electronics);
            setDifficultStayingAsleep(res.data.difficultStayingAsleep);
            setDifficultFallingAsleep(res.data.difficultFallingAsleep);
            setRacingThoughts(res.data.racingThoughts);

            setDreams(res.data.dreams);
            /*if (res.data.dreams != "") {
                console.log("res.data.dreams: ", res.data.dreams);
            }
            else if (res.data.dreams === null) {
                console.log("res.data.dreams came back as null");
            }
            else {
                console.log("res.data.dreams is empty string");
            }
            console.log("dreams: ", dreams);    */
            if ((dreams === null) || (dreams === undefined)) {
                setDreamsCB(false);
            }
            else setDreamsCB(true);
            console.log("dreams: ", dreams);        //<--- why is this showing nothing when there is actually dreams text for that record?
        }
        catch (err) {
            console.log("ERROR");
        }
    };

    // function CircularProgressWithLabel(props) {
    //     return (
    //       <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    //         <CircularProgress variant="determinate" {...props} size="8rem" thickness={6}/>
    //         <Box sx={{top: 0,left: 0,bottom: 0,right: 0,position: 'absolute',display: 'flex',alignItems: 'center',justifyContent: 'center',}}>
    //           <Typography variant="h5" component="div" color="text.secondary" fontWeight='bold'>
    //             {`${props.value.toFixed(1)}%`}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     );
    // }

    // CircularProgressWithLabel.propTypes = {
    //     value: PropTypes.number.isRequired,
    // };

    const[piePmData, setPiePmData] = React.useState([{name: 'Asleep', value: 2, fill: '#173e5c'},
                                                     {name: 'In Bed', value: 1, fill: '#82ca9d'},
                                                     {name: 'Out of Bed', value: 9}]);
    const[pieAmData, setPieAmData] = React.useState([{name: 'Out of Bed', value: 6},
                                                     {name: 'In Bed', value: 1, fill: '#82ca9d'},
                                                     {name: 'Asleep', value: 5, fill: '#173e5c'},]);
    const[pieEffData, setPieEffData] = React.useState([{name: 'Efficiency', value: 0.02},
                                                       {name: 'Efficiency', value: 0.98, fill:'#2f875d'}]);
    const[pieAmLabel, setPieAmLabel] = React.useState("");
    const[piePmLabel, setPiePmLabel] = React.useState("");
    const[pieEffLabel, setPieEffLabel] = React.useState("");
    function pieOver(val) {

    }

    function pieExits(val) {

    }

    function AveragePieChart() {
        return (
        <ResponsiveContainer width="100%" height={height / 3} ani>
            <PieChart >
                <Pie animationDuration={400} title={"Efficiency"} startAngle={90} endAngle={450}  data={pieEffData} dataKey="value" nameKey="name" cx="80%" cy="50%" innerRadius={'50%'} outerRadius={'80%'} fill="#a19b8c"> 
                    <Label width={30} position="center" fontSize={'1.9rem'} fontWeight={'bold'}>
                        { `${pieEffLabel}` }
                    </Label>
                </Pie>                 
                <Pie animationDuration={450} title={"AM"} startAngle={90} endAngle={450}  data={pieAmData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={'50%'} outerRadius={'80%'} fill="#a19b8c">
                    <Label width={30} position="center" fontSize={'1.2rem'} fontWeight={'bold'} >
                        { `${pieAmLabel}` }
                    </Label>
                </Pie>
                <Pie animationDuration={500} title={"PM"} startAngle={90} endAngle={450}  data={piePmData} dataKey="value" nameKey="name" cx="20%" cy="50%" innerRadius={'50%'} outerRadius={'80%'} fill="#a19b8c">
                    <Label width={30} position="center" fontSize={'1.2rem'} fontWeight={'bold'}>
                        { `${piePmLabel}` }
                    </Label>
                </Pie>                     
            </PieChart>
        </ResponsiveContainer>
        )
    }

    return (
        <Box sx={{
            backgroundColor: "#57118E",           /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
            background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
            animation: 'animazione 13s ease-in-out infinite alternate-reverse',
        
            height: '200vh' 
            }}>
            <Navbar/>
            <Grid container spacing={2} columns={2} sx={{margin: 0}}>
                {/* LEFT PANEL */}
                <Grid item xs={1}>
                    <Grid container space={2} columns={1}>
                        {/* Username Display */}
                        <Grid item xs={1}>
                            <Paper elevation={3} sx={{backgroundColor: '#7293A0'}}>
                                <Typography variant="h4" component="div"
                                            sx={{flexGrow: 1,
                                                fontWeight: 'bold',
                                                color: 'black', 
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                textAlign: 'center', color: 'white'}}>
                                    {username} 
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Weekly Summary Statistics */}
                        <Grid  item xs={1} sx={{marginTop: '10pt'}}>
                            <Paper elevation={3} sx={{backgroundColor: '#D9D3E4'}}>
                                <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                    {t("home.7-day.title")}
                                </Typography>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <AveragePieChart/>
                                </Box>
                                
                                <Typography variant='body' component='div' textAlign='center' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='14pt'>
                                    {t("home.effAdvice."+effAdvice)}
                                </Typography>
                                {/* <Typography variant='h6' component='div' textAlign='center'>
                                    {getCurrentWeek()}
                                </Typography> */}
                                <Grid container columns={2}>
                                    
                                    <Grid item xs={1}>
                                        
                                        <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='16pt'>
                                            {t("home.7-day.time-spent-falling")} <br/>
                                            {t("home.7-day.time-spent-awake")} <br/>
                                            {t("home.7-day.quality")} <br/>
                                            {t("home.7-day.hours-slept")} <br/>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}> 
                                    
                                        <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='16pt'>
                                            {avgFallTime}<br/>
                                            {avgAwakeTime}<br/>
                                            {avgQuality}<br/>
                                            {avgHoursSlept}<br />
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Box display="flex" alignItems="center" justifyContent="center" paddingBottom='10pt'>
                                    <Button href="/statistics" endIcon={<LegendToggleIcon/>} variant='contained'>View Insights</Button>
                                </Box>
                            </Paper>
                        </Grid>


                        

                    </Grid>
                </Grid>

                {/* RIGHT PANEL CALENDAR */}
                <Grid item xs={1}>
                    <Paper elevation={3} sx={{width: '90%', height:'80%', backgroundColor: '#D9D3E4'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar showDaysOutsideCurrentMonth
                            fixedWeekNumber={6}
                                //sx={{scale: '150%', paddingTop:'50px'}}
                                sx={{scale: '150%', paddingTop:'50px'}}
                               
                                views={['day']} 
                                onChange={(e) => {
                                    console.log(monthRecords);
                                    setIsNewRecord(false);
                                    handleOpenEditForm(e);
                                }}
                                onMonthChange={(e) => {
                                    handleNewCalendarDates(e);
                                }}
                                slots={{day: RecordedDays,}}
                            />
                        </LocalizationProvider>    
                        
                    </Paper>   
                    {/* Weekly Advices */}
                    <Grid item xs={1} sx={{marginTop: '20pt', width: '90%'}}>
                        <Paper elevation={3} sx={{backgroundColor: '#D9D3E4'}}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                {t("home.weekly-advices.title")}
                            </Typography>
                            <Typography variant='body' component='div' textAlign='left' paddingTop='10pt' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='16pt'>
                                {t("home.weekly-advices.1")}
                            </Typography>
                        </Paper>
                    </Grid>
                    

                    {/* Create New Record Button */}
                    <Grid item xs={1} justifyContent='center' display='flex' marginTop='20pt'>
                        {/* TODO: add event listener to create  */}
                        <Button variant='contained' endIcon={<AddCircleOutlineIcon/>} onClick={handleClickOpen}>{t("home.new-record")}</Button>
                        {/* <Button variant='contained' onClick={
                            () => console.log(monthRecords)
                        }>TEST</Button> */}
                    </Grid>   
                </Grid>

            </Grid>

            {/* Record Popup window */}
            <Dialog open={recordOpen} onClose={handleClose}>
                <DialogTitle>
                    <Grid container columns={2} justify='flex-end' alignItems='center'>
                        <Grid item xs={1}>
                            {isNewRecord ? "New Record" : "Edit Record"}
                        </Grid>
                        <Grid item xs={1}>
                        <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                            <Tooltip title={FIELDS_SPECIFICATION} arrow>
                                <IconButton size='small'><InfoIcon/></IconButton>
                            </Tooltip>
                        </Box>
                        </Grid>
                    </Grid>
                </DialogTitle>
                
                {
                    page === 1 ?
                    <DialogContent>
                    <DialogContentText>{isNewRecord? t("home.input-prompt.new-record") : t("home.input-prompt.edit-record")}</DialogContentText>

                    {/* Date Picker */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {isNewRecord ? 
                                    <DatePicker label="Date" value={recordDate} onChange={(newDate) => setRecordDate(newDate)}/>
                                    :
                                    <DatePicker label="Date" value={recordDate} onChange={(newDate) => setRecordDate(newDate)} readOnly/>
                                }
                        </LocalizationProvider>
                    </FormControl>

                    {/* Sleep Duration Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>{t("home.input-prompt.sleep-duration")}</InputLabel>
                        <OutlinedInput
                            value={fallTime}
                            label="fallTime"
                            onChange = {(e)=>
                                setFallTime(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                    {/* Awake Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <InputLabel>{t("home.input-prompt.awake-time")}</InputLabel>
                        <OutlinedInput
                            value={awakeTime}
                            label="wokeUpCount"
                            onChange = {(e)=>
                                setAwakeTime(e.target.value)}
                            type="text"
                        />
                    </FormControl>

                    {/* Down Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label={t("home.input-prompt.down-time")} value={downTime} onChange={(newTime) => setDownTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Sleep Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label={t("home.input-prompt.sleep-time")} value={sleepTime} onChange={(newTime) => setSleepTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Wake Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label={t("home.input-prompt.wake-time")} value={wakeTime} onChange={(newTime) => setWakeTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Up Time Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker label={t("home.input-prompt.up-time")} value={upTime} onChange={(newTime) => setUpTime(newTime)}/>
                        </LocalizationProvider>
                    </FormControl>

                    {/* Restlessness Input */}
                    <FormControl sx={{width: '100%', marginTop: '20pt'}}>
                        <Grid container columns={2} justify='flex-end' alignItems='center'>
                            <Grid item xs={1}>
                                <Box>
                                    {t("home.input-prompt.quality")}
                                </Box>
                            </Grid>
                            <Grid item xs={1}>
                            <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                <Slider aria-label="Restless" value={quality} onChange={handleRestlessnessChange}
                                step={1} marks={MARKS} min={1} max={5} />
                            </Box>
                            </Grid>
                        </Grid>
                    </FormControl>

                    {/* Submit/Cancel */}
                    <Grid container columns={2}>
                        <Grid item xs={1}>
                            {/* <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={handleSubmit}>Submit</Button> */}
                            <Button sx={{marginTop: '20pt', color: 'red'}} onClick={handleClose} variant=''>{t("home.cancel")}</Button>
                        </Grid>
                        
                    </Grid>

                </DialogContent>
                :
                <DialogContent>
                    <DialogContentText>{isNewRecord? t("home.input-prompt.new-record") : t("home.input-prompt.edit-record")}</DialogContentText>
                    {makeBooleanCheckbox(t("home.sleep-journal.physical-activity"), physicalActivity, setPhysicalActivity)}
                    {makeBooleanCheckbox(t("home.sleep-journal.naps"), naps, setNaps)}
                    {makeBooleanCheckbox(t("home.sleep-journal.alchol"), alcoholConsumption, setAlcoholConsumption)}
                    {makeBooleanCheckbox(t("home.sleep-journal.caffine"), caffeineConsumption, setCaffeineConsumption)}
                    {makeBooleanCheckbox(t("home.sleep-journal.electronics"), electronics, setElectronics)}
                    {makeBooleanCheckbox(t("home.sleep-journal.difficulty-falling"), difficultFallingAsleep, setDifficultFallingAsleep)}
                    {makeBooleanCheckbox(t("home.sleep-journal.difficulty-staying"), difficultStayingAsleep, setDifficultStayingAsleep)}
                    {makeBooleanCheckbox(t("home.sleep-journal.racing-thoughts"), racingThoughts, setRacingThoughts)}
                    {makeBooleanCheckbox(t("home.sleep-journal.dreams"), dreamsCB, handleOnChangeDreamCB)}

                    <Grid container columns={2}>
                        <Grid item xs={1}>
                            {/* <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={handleSubmit}>Submit</Button> */}
                            <Button sx={{marginTop: '20pt', color: 'red'}} onClick={handleClose} variant=''>{t("home.cancel")}</Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                                <Button sx={{marginTop: '20pt', color: '#674747'}} onClick={handleSubmit}>
                                    {isNewRecord ? t("home.submit"): t("home.update")}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                }

                <Box alignContent='center' justify="center" display="flex" marginBottom='10pt'>
                    <Pagination count={2} page={page} onChange={handlePageChange} sx={{margin: 'auto'}}/>
                </Box>
                
            </Dialog>

        </Box>
    )
}