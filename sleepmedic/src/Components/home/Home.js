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
import SchoolIcon from '@mui/icons-material/School';
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
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { isMobile } from 'react-device-detect';
import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
//import TextField from '@material-ui/core/TextField';
import TextField from '@mui/material/TextField'; // Add this line
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'; // next icon
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'; //back icon
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, styled } from '@mui/material/styles';
import { IconButton, FormGroup, FormControlLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Label } from 'recharts';
import { Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import es from 'dayjs/locale/es';
import en from 'dayjs/locale/en';

import Stack from '@mui/material/Stack';
const calendarTheme = createTheme({
    components: {
        MuiDateCalendar: {
            styleOverrides: {
                root: {
                    aspect: 3
                }
            }
        }
    }
});




const MARKS = [
    { value: 1, label: <SentimentVeryDissatisfiedIcon /> },
    { value: 2, label: <SentimentDissatisfiedIcon /> },
    { value: 3, label: <SentimentNeutralIcon /> },
    { value: 4, label: <SentimentSatisfiedIcon /> },
    { value: 5, label: <SentimentVerySatisfiedIcon /> },
]

const FIELDS_SPECIFICATION = `
Enter the data to the best of your knowledge. For all the questions, it is important
you answer honestly. 
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
        "Authorization": 'Bearer ' + cookies._auth
    };
    return headers;
}

function getPostHeaders() {
    const cookies = getCookiesDict();
    const headers = {
        "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
        "Content-Type": 'application/json; charset=utf-8',
        "Authorization": 'Bearer ' + cookies._auth
    };
    return headers;
}

var headers = {
    "Access-Control-Allow-Origin": "https://api.sleepmedic.me:8443/",
    "Content-Type": 'application/json; charset=utf-8',
}


function makeBooleanCheckbox(title, value, onChangeFunction) {
    return (
        <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
            <Grid container columns={2} justify='flex-end' alignItems='center'>
                <Grid item xs={1}>
                    <Box>
                        {title}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <Checkbox checked={value} onChange={(e) => { onChangeFunction(e.target.checked) }} />
                    </Box>
                </Grid>
            </Grid>
        </FormControl>
    )
}

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


export default function Home() {
    const initialLoad = React.useRef(false);
    const [t, i18n] = useTranslation("global");
    const [isLoading, setIsLoading] = React.useState(true);
    const [pieAnimate, setPieAnimate] = React.useState(true);
    const navigate = useNavigate();
    // Control of popup sleep record window
    const [recordOpen, setRecordOpen] = React.useState(false);
    const [isNewRecord, setIsNewRecord] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const [piePmData, setPiePmData] = React.useState([{ name: 'Asleep', value: 2, fill: '#173e5c' },
    { name: 'In Bed', value: 1, fill: '#82ca9d' },
    { name: 'Out of Bed', value: 9 }]);
    const [pieAmData, setPieAmData] = React.useState([{ name: 'Out of Bed', value: 6 },
    { name: 'In Bed', value: 1, fill: '#82ca9d' },
    { name: 'Asleep', value: 5, fill: '#173e5c' },]);
    const [pieEffData, setPieEffData] = React.useState([{ name: 'Efficiency', value: 0.02 },
    { name: 'Efficiency', value: 0.98, fill: '#2f875d' }]);
    const [pieAmLabel, setPieAmLabel] = React.useState("");
    const [piePmLabel, setPiePmLabel] = React.useState("");
    const [pieEffLabel, setPieEffLabel] = React.useState("");

    // User data
    // INFO
    const[username, setUsername] = React.useState('User Name');
    const [homeWeeklyAdvice, setHomeWeeklyAdvice] = React.useState("");
    //const[advices, setAdvices] = React.useState([]);
    // AVG STATISTICS
    const [avgFallTime, setAvgFallTime] = React.useState('0');
    const [avgQuality, setAvgQuality] = React.useState('0');
    const [avgWakeTime, setAvgWakeTime] = React.useState('00:00');
    const [avgDownTime, setAvgDownTime] = React.useState('00:00');
    const [avgUpTime, setAvgUpTime] = React.useState('00:00');
    const [avgSleepTime, setAvgSleepTime] = React.useState('00:00');
    const [avgAwakeTime, setAvgAwakeTime] = React.useState('0');
    const [avgEfficiency, setAvgEfficiency] = React.useState('0');
    const [effAdvice, setEffAdvice] = React.useState("1");
    const [avgHoursSlept, setAvgHoursSlept] = React.useState(0.0);


    function makeBooleanCheckbox(title, value, onChangeFunction) {
        return (
            <FormGroup>
                <FormControlLabel control={
                    <Checkbox
                        checked={value}
                        onChange={(e) => { onChangeFunction(e.target.checked) }}
                    />
                }
                    labelPlacement={"end"}
                    label={title}
                // sx={{ m: 2 }}
                />
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

            </FormGroup>
        )
    }

    // New record data
    // Date
    const today = dayjs();
    const [recordDate, setRecordDate] = React.useState(today);
    // Integer
    const [quality, setQuality] = React.useState(0);
    const [fallTime, setFallTime] = React.useState(0);
    const [awakeTime, setAwakeTime] = React.useState(0);
    // Time
    const [downTime, setDownTime] = React.useState(today.set('hour', 22).set('minute', 30).set('second', 0));
    const [sleepTime, setSleepTime] = React.useState(today.set('hour', 23).set('minute', 30).set('second', 0));
    const [wakeTime, setWakeTime] = React.useState(today.set('hour', 8).set('minute', 30).set('second', 0));
    const [upTime, setUpTime] = React.useState(today.set('hour', 9).set('minute', 30).set('second', 0));
    // Boolean
    const [physicalActivity, setPhysicalActivity] = React.useState(false);
    const [naps, setNaps] = React.useState(false);
    const [caffeineConsumption, setCaffeineConsumption] = React.useState(false);
    const [alcoholConsumption, setAlcoholConsumption] = React.useState(false);
    const [electronics, setElectronics] = React.useState(false);
    const [difficultStayingAsleep, setDifficultStayingAsleep] = React.useState(false);
    const [difficultFallingAsleep, setDifficultFallingAsleep] = React.useState(false);
    const [racingThoughts, setRacingThoughts] = React.useState(false);
    // String: Dream & Description
    const [dreams, setDreams] = React.useState("");
    const [dreamsCB, setDreamsCB] = React.useState(false);


    // Record update
    const [monthRecords, setMonthRecords] = React.useState([]);
    const [editMode, setEditMode] = React.useState(false);
    const [recordId, setRecordID] = React.useState(0);

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
        if (hours > 21) {       //PM
            hours -= 12;
            return hours + remainder;
        } else if (hours > 12) {    //PM
            hours -= 12;
            return "0" + hours + remainder;
        } else if (hours > 9) {     //AM
            return hours + remainder;
        } else if (hours === 0) {   //AM
            return '12' + remainder;
        }
        return "0" + hours + remainder;     //AM
    }

    function setPieData(res) {
        let avgDown = getFormattedTime(res.data.downTime);
        let avgSleep = getFormattedTime(res.data.sleepTime)
        let avgWake = getFormattedTime(res.data.wakeTime);
        let avgUp = getFormattedTime(res.data.upTime);
        setAvgDownTime(avgDown);
        setAvgSleepTime(avgSleep);
        // console.log(avgSleepTime)
        setAvgWakeTime(avgWake);
        setAvgUpTime(avgUp);
        let downTimeTemp = res.data.downTime.split(":");
        downTimeTemp = { name: 'down', value: parseInt(downTimeTemp[0]) + (parseFloat(downTimeTemp[1]) / 60) };
        let sleepTimeTemp = res.data.sleepTime.split(":");
        sleepTimeTemp = { name: 'sleep', value: parseInt(sleepTimeTemp[0]) + (parseFloat(sleepTimeTemp[1]) / 60) };
        let wakeTimeTemp = res.data.wakeTime.split(":");
        wakeTimeTemp = { name: 'wake', value: parseInt(wakeTimeTemp[0]) + (parseFloat(wakeTimeTemp[1]) / 60) };
        let upTimeTemp = res.data.upTime.split(":");
        upTimeTemp = { name: 'up', value: parseInt(upTimeTemp[0]) + (parseFloat(upTimeTemp[1]) / 60) };
        let times = [downTimeTemp, sleepTimeTemp, wakeTimeTemp, upTimeTemp].sort(function (a, b) { return a.value - b.value });
        let tempPM = [];
        let tempAM = [];
        console.log('times unsorted ' + times);
        times.forEach(element => {
            if (element.value < 12) {
                tempAM.push(element);
            } else {
                tempPM.push(element);
            }
        })
        console.log('times sorted ' + times);

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
                pm.push({ name: 'Out of Bed', value: elapsedTime });
                tempLabel += '🔽@' + avgDown;
            } else if (element.name === 'wake') {
                pm.push({ name: 'Asleep', value: elapsedTime, fill: '#173e5c' });
                tempLabel += '⏰@' + avgWake;
            } else {
                // Handles both sleep and up
                pm.push({ name: 'In Bed', value: elapsedTime, fill: '#82ca9d' });
                if (element.name === 'sleep') {
                    tempLabel += '💤@' + avgSleep;
                } else {
                    tempLabel += '🔼@' + avgUp;
                }
            }

            if (count === tempPM.length - 1) {
                // This was the last one, extend to the end with what should follow
                elapsedTime = 24 - element.value;
                if (element.name === 'sleep') {
                    pm.push({ name: 'Asleep', value: elapsedTime, fill: '#173e5c' });
                } else if (element.name === 'up') {
                    pm.push({ name: 'Out of Bed', value: elapsedTime })
                } else {
                    // Handles wake and down
                    pm.push({ name: 'In Bed', value: elapsedTime, fill: '#82ca9d' });
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
                am.push({ name: 'Out of Bed', value: elapsedTime });
                tempLabel += '🔽@' + avgDown;
            } else if (element.name === 'wake') {
                am.push({ name: 'Asleep', value: elapsedTime, fill: '#173e5c' });
                tempLabel += '⏰@' + avgWake;
            } else {
                // Handles both sleep and up
                am.push({ name: 'In Bed', value: elapsedTime, fill: '#82ca9d' });
                if (element.name === 'sleep') {
                    tempLabel += '💤@' + avgSleep;
                } else {
                    tempLabel += '🔼@' + avgUp;
                }
            }

            if (count === tempAM.length - 1) {
                // This was the last one, extend to the end with what should follow
                elapsedTime = 12 - element.value;
                if (element.name === 'sleep') {
                    am.push({ name: 'Asleep', value: elapsedTime, fill: '#173e5c' });
                } else if (element.name === 'up') {
                    am.push({ name: 'Out of Bed', value: elapsedTime })
                } else {
                    // Handles wake and down
                    am.push({ name: 'In Bed', value: elapsedTime, fill: '#82ca9d' });
                }
            }
            count += 1;
        })
        console.log("label: " + tempLabel);
        setPieAmLabel(tempLabel);
        if (am.length > 0) {
            setPieAmData(am.reverse());
        } else {
            setPieAmData([{ name: 'Out of Bed', value: 12 }])
        }

        if (pm.length > 0) {
            setPiePmData(pm.reverse());
        } else {
            setPiePmData([{ name: 'Out of Bed', value: 12 }])
        }


        setPieEffLabel('🔋' + (res.data.efficiency).toFixed(1) + '%');
        setPieEffData([{ name: '0', value: 100 - res.data.efficiency }, { name: '1', value: res.data.efficiency, fill: '#2f875d' }])
    }


    function getFormattedTimeForAdvice(time) {
        console.log("got time: " + time)
        time = time.slice(0, 5);
        let hours = parseInt(time.slice(0, 2), 10);
        let remainder = time.slice(2);
        let am = "AM";
        let pm = "PM";
            if (hours > 21) {       //PM
                hours -= 12;
                return hours + remainder + pm;
            } else if (hours > 12) {    //PM
                hours -= 12;
                return "0" + hours + remainder + pm;
            } else if (hours > 9) {     //AM
                return hours + remainder + am;
            } else if (hours === 0) {   //AM
                return '12' + remainder + am;
            }
            return "0" + hours + remainder + am;     //AM
    }

    function setWeeklyAdvices(advices) {
        console.log("Inside setWeeklyAdvices");
        console.log("advice from /info:", advices);
        const helperStr = "home.weekly-advices.";
        let tempAdvices = "";
        for (var i = 0; i < advices.length; i++) {
            //if var is not null, we need to do .replace() for <VAR> for the string according to adviceID.
            console.log(t(helperStr + advices[i].adviceID.toString()));
            if (advices[i].var != null) {
                var time = getFormattedTimeForAdvice(advices[i].var);
                tempAdvices += " - " + t(helperStr + advices[i].adviceID.toString(), {VAR:time}) + "\n";
                setHomeWeeklyAdvice(tempAdvices);
                console.log(tempAdvices);
            }
            //else if var is null, simply set the string according to adviceID.
            else {
                tempAdvices += " - " + t(helperStr + advices[i].adviceID.toString()) + "\n";
                setHomeWeeklyAdvice(tempAdvices);
            }
            console.log("homeWeeklyAdvice" + homeWeeklyAdvice);
            console.log(tempAdvices);
        }
    }

    async function getData() {

        const headers = getGetHeaders();

        try {
            // Get user name
            setIsLoading(true);
            let res = await axios.get("https://api.sleepmedic.me:8443/home/info", { headers });
            let name = res.data.firstName + ' ' + res.data.lastName;
            setUsername(name);
            setEduBarLabel((res.data.progress * 100).toFixed(1) + "%");
            setEduBarValue(res.data.progress * 100);

            //get advices for the user?
            //setAdvices(res.data.advice);
            console.log("Res.data.advices:", res.data.advice);
            //console.log("my advice object:", advices);
            setWeeklyAdvices(res.data.advice);


            //Get Calendar
            const date = new Date();
            let currentDate = date.toISOString().slice(0, 10);
            console.log(currentDate);
            let res1 = await axios.get("https://api.sleepmedic.me:8443/home/calendar/" + currentDate, { headers });
            setMonthRecords(res1.data);
            console.log(res1.data);


            // Get user average sleep data
            let res2 = await axios.get("https://api.sleepmedic.me:8443/home/average", { headers });
            console.log('average');
            console.log(res2.data)
            setAvgFallTime(res2.data.fallTime + " min");
            setAvgAwakeTime(res2.data.awakeTime + " min");
            setAvgQuality((res2.data.quality).toFixed(1));


            setPieData(res2);

            setAvgHoursSlept((res2.data.hoursSlept).toFixed(1) + " hrs");


        }
        catch (err) {
            console.log("Failed to retrieve data.");
        }

        setIsLoading(false);

    }

    function formateDate(day) {
        let monthFix = day.get('month') + 1;
        return `${day.get('year')}-${monthFix.toString().padStart(2, '0')}-${day.get('date').toString().padStart(2, '0')}`;
    }

    function formatRecord() {
        //add boolean & String values to the record, format them as needed
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
                onChange={(e) => { }}
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

        //add a flag/indicator for edit vs create new record.
        if (editMode) {
            try {
                let record = formatRecord();
                let res = await axios.patch("https://api.sleepmedic.me:8443/home/update_record/" + recordId, record, { headers });
            }
            catch (err2) {
                console.log("Failed to update record.");
            }
        }
        else {
            try {
                let record = formatRecord();
                let res = await axios.post("https://api.sleepmedic.me:8443/home/create_record", record, { headers });
            }
            catch (err) {
                alert("You already have a record for this date! Please modify the existing one instead.");
                console.log('Failed to create record.');
            }
        }

        setRecordOpen(false);
        setEditMode(false);
        resetInput();
        getData(); // Reload averages and calendar incase update/create changes them.
    }

    // Auto loading
    React.useEffect(() => {
        if (initialLoad.current) return;

        //Check if not logged in and redirect.
        const cookies = getCookiesDict();
        if (cookies._auth == null) {
            navigate("/")
        }
        getData();
        initialLoad.current = true;
        setPieAnimate(false);

        //Get Data
        console.log("USED effect");
    }, []);


    // Popup window handlers
    function resetInput() {
        // reset all booleans to default values (false), String to empty string
        setPage(1);
        setRecordDate(today);
        setQuality(0);
        setFallTime(0);
        setAwakeTime(0);
        setDownTime(today.set('hour', 22).set('minute', 30).set('second', 0));
        setSleepTime(today.set('hour', 23).set('minute', 30).set('second', 0));
        setWakeTime(today.set('hour', 8).set('minute', 30).set('second', 0));
        setUpTime(today.set('hour', 9).set('minute', 30).set('second', 0));
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
        const headers = getGetHeaders();

        let res = await axios.get("https://api.sleepmedic.me:8443/home/calendar/" + formattedDate, { headers });
        setMonthRecords(res.data);
    }

    const handleOpenEditForm = async (dayClicked) => {
        console.log('Selected day', dayClicked.$d)
        const formattedDate = dayjs(dayClicked.$d).format('YYYY-MM-DD');
        console.log('Formatted date', formattedDate);
        const headers = getGetHeaders();
        
        if (!monthRecords.includes(formattedDate)) {
            setIsNewRecord(true);
            console.log('EYO')
        } else {
            setIsNewRecord(false)
        }
        
        //console.log(res.data);
        try {
            let res = await axios.get("https://api.sleepmedic.me:8443/home/view_record/" + formattedDate, { headers });
            setRecordOpen(true);
            setEditMode(true);
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

            if ((dreams === null) || (dreams === undefined)) {
                setDreamsCB(false);
            }
            else setDreamsCB(true);
            console.log("dreams: ", dreams);        //<--- why is this showing nothing when there is actually dreams text for that record?
        }
        catch (err) {
            console.log("clicked on day without record, make a new one");
            setEditMode(false);  
            setRecordOpen(true);
              
            setRecordDate(dayClicked)
        }

    };

    function AveragePieChart() {
        return isLoading ? (
            <Box sx={{ width: '90%', padding: '15%' }}>
                <LinearProgress sx={{ height: 20 }} />
            </Box>
        ) : (
            <ResponsiveContainer aspect={3}>
                <PieChart >
                    <Pie isAnimationActive={pieAnimate} animationDuration={400} title={"Efficiency"} startAngle={90} endAngle={450} data={pieEffData} dataKey="value" nameKey="name" cx={isMobile ? "83%" : "80%"} cy="50%" innerRadius={isMobile ? '68%' : '50%'} outerRadius={isMobile ? '98%' : '80%'} fill="#a19b8c">
                        <Label width={30} position="center" fontSize={isMobile ? '1.2rem' : '1.9rem'} fontWeight={'bold'}>
                            {`${pieEffLabel}`}
                        </Label>
                    </Pie>
                    <Pie isAnimationActive={pieAnimate} animationDuration={400} title={"AM"} startAngle={90} endAngle={450} data={pieAmData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={isMobile ? '68%' : '50%'} outerRadius={isMobile ? '98%' : '80%'} fill="#a19b8c">
                        <Label width={30} position="center" fontSize={isMobile ? '0.8rem' : '1.2rem'} fontWeight={'bold'} >
                            {`${pieAmLabel}`}
                        </Label>
                    </Pie>
                    <Pie isAnimationActive={pieAnimate} animationDuration={400} title={"PM"} startAngle={90} endAngle={450} data={piePmData} dataKey="value" nameKey="name" cx={isMobile ? "17%" : "20%"} cy="50%" innerRadius={isMobile ? '68%' : '50%'} outerRadius={isMobile ? '98%' : '80%'} fill="#a19b8c">
                        <Label width={30} position="center" fontSize={isMobile ? '0.8rem' : '1.2rem'} fontWeight={'bold'}>
                            {`${piePmLabel}`}
                        </Label>
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        )
    }


    const [eduBarValue, setEduBarValue] = React.useState(0);
    const [eduBarLabel, setEduBarLabel] = React.useState("0%");
    function EducationProgressBar() {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} padding={'5% 5% 5% 0%'}>
                <Box width="100%" display="flex" alignItems="center" justifyContent="center">
                    <LinearProgress sx={{
                        height: 20, width: '95%', background: '#a19b8c', '& .MuiLinearProgress-bar': {
                            backgroundColor: '#57618E', // Set the progress bar color here
                        }
                    }} value={eduBarValue} variant={isLoading ? "indeterminate" : "determinate"} />
                </Box>
                <Box >
                    <Typography variant="body2" color="text.secondary">{`${eduBarLabel}`}
                    </Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{
            backgroundColor: "#57118E",           /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
            background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
            animation: 'animazione 13s ease-in-out infinite alternate-reverse',

            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            overflowY: 'auto'

        }}>
            <Navbar />
            <Grid container spacing={2} columns={2} sx={{ margin: 0, paddingRight: 4 }}>
                {/* LEFT PANEL */}
                <Grid item xs sx={{ minWidth: isMobile ? 300 : 320 }}>
                    <Grid container space={2} columns={1} sx={{ minWidth: isMobile ? 300 : 320 }}>
                        {/* Username Display */}
                        <Grid item xs={1}>
                            <Paper elevation={3} sx={{ backgroundColor: '#7293A0', minWidth: isMobile ? 300 : 320 }}>
                                <Typography variant="h4" component="div"
                                    sx={{
                                        flexGrow: 1,
                                        fontWeight: 'bold',
                                        color: 'white',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        textAlign: 'center'
                                    }}>
                                    {username}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Weekly Summary Statistics */}
                        <Grid item xs={1} sx={{ marginTop: '10pt' }}>
                            <Paper elevation={3} sx={{ backgroundColor: '#D9D3E4' }}>
                                <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                    {t("home.7-day.title")}
                                </Typography>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <AveragePieChart />
                                </Box>

                                <Typography variant='body' component='div' textAlign='center' paddingLeft='2%' paddingRight='2%' paddingBottom='10pt' color='black' fontSize='14pt'>
                                    {t("home.effAdvice." + effAdvice)}
                                </Typography>
                                {/* <Typography variant='h6' component='div' textAlign='center'>
                                    {getCurrentWeek()}
                                </Typography> */}
                                <Grid container columns={2}>

                                    <Grid item xs={1}>

                                        <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='16pt'>
                                            {t("home.7-day.time-spent-falling")} <br />
                                            {t("home.7-day.time-spent-awake")} <br />
                                            {t("home.7-day.quality")} <br />
                                            {t("home.7-day.hours-slept")} <br />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>

                                        <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt' color='black' fontSize='16pt'>
                                            {avgFallTime}<br />
                                            {avgAwakeTime}<br />
                                            {avgQuality}<br />
                                            {avgHoursSlept}<br />
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Box display="flex" alignItems="center" justifyContent="center" paddingBottom='10pt'>
                                    <Button onClick={() => navigate('/createreminder')} endIcon={<NotificationAddOutlinedIcon />} variant="contained">{t("home.createReminder")}</Button>
                                </Box>
                            </Paper>
                        </Grid>




                    </Grid>
                </Grid>

                {/* RIGHT PANEL CALENDAR */}
                <Grid item xs>
                    <Grid container columns={3} spacing={1}>
                        <Grid item xs={3} sx={{ minWidth: isMobile ? 300 : 320 }}>
                            <Paper elevation={3} sx={{ backgroundColor: '#D9D3E4',  minWidth: isMobile ? 300 : 320 }}>
                                <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                    {t("home.weekly-advices.title")}
                                </Typography>

                                <Typography sx={{minHeight: 80}} variant='body' component='div' textAlign='left' paddingTop='5pt' paddingLeft='20pt' paddingRight='20pt' paddingBottom='20pt' color='black' fontSize='16pt'>
                                    {/*t("home.weekly-advices.-1")*/}
                                    {/*homeWeeklyAdvice*/}
                                    {homeWeeklyAdvice.split('\n').map((ad, id)=>(
                                        <div>
                                            {ad} <br/>
                                        </div>

                                    ))}

                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs sx={{ minWidth: isMobile ? 300 : 320 }}>
                            <Paper elevation={3} sx={{ backgroundColor: '#D9D3E4', minWidth: isMobile ? 300 : 320 }}>
                                <Grid container columns={1} >
                                    <Grid item xs={12} md={6} lg={4} sx={{ minWidth: isMobile ? 300 : 320 }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language} >
                                            <Box sx={{ minWidth: isMobile ? 300 : 320 }}>
                                                
                                                <DateCalendar
                                                    
                                                    reduceAnimations={true}
                                                    // theme={calendarTheme} 
                                                    showDaysOutsideCurrentMonth
                                                    fixedWeekNumber={6}
                                                    //sx={{scale: '150%', paddingTop:'50px'}}
                                                    // sx={{scale: '95%'}}
                                                    sx={{ flexGrow: 1, minWidth: isMobile ? 300 : 320 }}
                                                    views={['day']}
                                                    onChange={(e) => {
                                                        console.log(monthRecords);

                                                        handleOpenEditForm(e);
                                                    }}
                                                    onMonthChange={(e) => {
                                                        handleNewCalendarDates(e);
                                                    }}
                                                    slots={{ day: RecordedDays, }}
                                                />
                                            </Box>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Box display="flex" alignItems="center" justifyContent="center" paddingBottom='10pt'>
                                            <Button variant='contained' endIcon={<NoteAddOutlinedIcon />} onClick={handleClickOpen}>
                                                {t("home.new-record")}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs sx={{ minWidth: isMobile ? 300 : 320 }}>
                            <Grid container columns={1} spacing={1}>
                                <Grid item xs={1}>
                                    <Paper elevation={3} sx={{ backgroundColor: '#D9D3E4', minWidth: isMobile ? 300 : 320 }}>
                                        <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                            {t("home.education-progress")}
                                        </Typography>
                                        <EducationProgressBar />
                                        <Box display="flex" alignItems="center" justifyContent="center" paddingBottom='10pt'>
                                            <Button href="/education" endIcon={<SchoolIcon />} variant='contained'>{t("home.viewLessons")}</Button>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={1}>
                                    <Paper elevation={3} sx={{ backgroundColor: '#D9D3E4', minWidth: isMobile ? 300 : 320 }}>
                                        <Grid container columns={1}>
                                            <Grid item xs={1}>

                                                <Typography variant='h6' component='div' textAlign='center' paddingTop='10pt' paddingBottom={'5%'} fontWeight='bold'>
                                                    {t("home.insightMessage")}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1} sx={{ paddingTop: '10px' }}>
                                                <Box display="flex" alignItems="center" justifyContent="center" paddingBottom='10pt'>
                                                    <Button href="/statistics" endIcon={<LegendToggleIcon />} variant='contained'>{t("home.viewInsight")}</Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

            {/* Record Popup window */}
            <Dialog PaperProps={{
                style: {
                    backgroundColor: '#e8e4f2', // Replace this with your desired background color
                },
            }} open={recordOpen} onClose={handleClose}>
                <DialogTitle>
                    <Grid container columns={2} justify='flex-end' alignItems='center'>
                        <Grid item xs={1}>
                            {isNewRecord ? t("home.input-prompt.new-record") : t("home.input-prompt.edit-record")}
                        </Grid>
                        <Grid item xs={1}>
                            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <Tooltip title={FIELDS_SPECIFICATION} arrow>
                                    <IconButton size='small'><InfoIcon /></IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogTitle>

                {
                    page === 1 ?
                        <DialogContent>
                            <DialogContentText>{isNewRecord ? t("home.input-prompt.new-record") : t("home.input-prompt.edit-record")}</DialogContentText>

                            {/* Date Picker */}
                            <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {isNewRecord ?
                                        <DatePicker label="Date" value={recordDate} onChange={(newDate) => setRecordDate(newDate)} />
                                        :
                                        <DatePicker label="Date" value={recordDate} onChange={(newDate) => setRecordDate(newDate)} readOnly />
                                    }
                                </LocalizationProvider>
                            </FormControl>

                            {/* Sleep Duration Input */}
                            <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
                                <InputLabel>{t("home.input-prompt.fall-time")}</InputLabel>
                                <OutlinedInput
                                    value={fallTime}
                                    label={t("home.input-prompt.fall-time")}
                                    onChange={(e) =>
                                        setFallTime(e.target.value)}
                                    type="text"
                                />
                            </FormControl>

                            {/* Awake Time Input */}
                            <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
                                <InputLabel>{t("home.input-prompt.awake-time")}</InputLabel>
                                <OutlinedInput
                                    value={awakeTime}
                                    label={t("home.input-prompt.awake-time")}
                                    onChange={(e) =>
                                        setAwakeTime(e.target.value)}
                                    type="text"
                                />
                            </FormControl>

                            {/* Down Time Input */}
                            <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker label={t("home.input-prompt.down-time")} value={downTime} onChange={(newTime) => setDownTime(newTime)} />
                                </LocalizationProvider>
                            </FormControl>

                            {/* Sleep Time Input */}
                            <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker label={t("home.input-prompt.sleep-time")} value={sleepTime} onChange={(newTime) => setSleepTime(newTime)} />
                                </LocalizationProvider>
                            </FormControl>

                            {/* Wake Time Input */}
                            <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker label={t("home.input-prompt.wake-time")} value={wakeTime} onChange={(newTime) => setWakeTime(newTime)} />
                                </LocalizationProvider>
                            </FormControl>

                            {/* Up Time Input */}
                            <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker label={t("home.input-prompt.up-time")} value={upTime} onChange={(newTime) => setUpTime(newTime)} />
                                </LocalizationProvider>
                            </FormControl>

                            {/* Restlessness Input */}
                            <FormControl sx={{ width: '100%', marginTop: '20pt' }}>
                                <Grid container columns={2} justify='flex-end' alignItems='center'>
                                    <Grid item xs={1}>
                                        <Box>
                                            {t("home.input-prompt.quality")}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                            <Slider aria-label="Restless" value={quality} onChange={handleRestlessnessChange}
                                                step={1} marks={MARKS} min={1} max={5} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </FormControl>

                        </DialogContent>
                        :
                        <DialogContent>
                            <DialogContentText>{isNewRecord ? t("home.input-prompt.new-record") : t("home.input-prompt.edit-record")}</DialogContentText>
                            {makeBooleanCheckbox(t("home.sleep-journal.physical-activity"), physicalActivity, setPhysicalActivity)}
                            {makeBooleanCheckbox(t("home.sleep-journal.naps"), naps, setNaps)}
                            {makeBooleanCheckbox(t("home.sleep-journal.alcohol"), alcoholConsumption, setAlcoholConsumption)}
                            {makeBooleanCheckbox(t("home.sleep-journal.caffeine"), caffeineConsumption, setCaffeineConsumption)}
                            {makeBooleanCheckbox(t("home.sleep-journal.electronics"), electronics, setElectronics)}
                            {makeBooleanCheckbox(t("home.sleep-journal.difficulty-falling"), difficultFallingAsleep, setDifficultFallingAsleep)}
                            {makeBooleanCheckbox(t("home.sleep-journal.difficulty-staying"), difficultStayingAsleep, setDifficultStayingAsleep)}
                            {makeBooleanCheckbox(t("home.sleep-journal.racing-thoughts"), racingThoughts, setRacingThoughts)}
                            {makeBooleanCheckbox(t("home.sleep-journal.dreams"), dreamsCB, handleOnChangeDreamCB)}


                        </DialogContent>
                }

                <Grid container columns={3} direction={'row'}>
                    <Grid item xs={1}>
                        <Box alignContent='center' justifyContent="center" display="flex" marginBottom='10pt' marginTop='10pt'>
                            {page === 1 ? (
                                <Button sx={{ color: 'red' }} onClick={handleClose} variant='outlined'>{t("home.cancel")}</Button>
                            ) : (
                                <Button startIcon={<ArrowBackOutlinedIcon/>} onClick={() => setPage(1)} variant='outlined'>{t("home.back")}</Button>
                            )}
                            
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box alignContent='center' justify="center" display="flex" marginBottom='10pt' marginTop='10pt'>
                            <Pagination count={2} page={page} onChange={handlePageChange} sx={{ margin: 'auto' }} />
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box alignContent='center' justifyContent="center" display="flex" marginBottom='10pt' marginTop='10pt'>
                            {page === 1 ? (
                                <Button variant='contained' endIcon={<ArrowForwardOutlinedIcon/>} onClick={() => setPage(2)}>
                                    {t("home.next")}
                                </Button>
                            ) : (
                                <Button endIcon={<NoteAddOutlinedIcon />} variant='contained' onClick={handleSubmit}>
                                    {isNewRecord ? t("home.create") : t("home.update")}
                                </Button>
                            )}

                        </Box>
                    </Grid>
                </Grid>


            </Dialog>
            <Grid item xs >
                <Typography marginBottom={'10px'} variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                    SLEEP MEDIC ALPHA 0.3.0
                </Typography>
            </Grid>

        </Box>
    )
}