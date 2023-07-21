import axios from "axios";
import * as React from 'react';
import dayjs from 'dayjs';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from '../navbar/Navbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Legend, BarChart, Bar } from 'recharts';


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

function makeLineGraph(data, x, y, scale=[0,10], ytick, isRefLine, avg) {
    return (
        <Paper sx={{width: '80%'}} elevation={0}>
            <Grid container spacing={2} columns={1} margin={0} >
                <Grid item xs={1}>
                    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey={y} stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey={x}/>
                        <YAxis domain={scale} interval="preserveStartEnd" tickCount={ytick}/>
                        <Tooltip />
                        {isRefLine ? <ReferenceLine y={avg} stroke="red"/> : undefined}
                    </LineChart>
                </Grid>
            </Grid>
        </Paper>
    );
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function makeBooleansRadialBar(data) {

}

export default function Statistics() {
    const[monthRecords, setMonthRecords] = React.useState([]);
    const[allAvgs, setAllAvgs] = React.useState({});
    const[showAvg, setShowAvg] = React.useState(false);
    


    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    async function getRecords() {
        const headers = getGetHeaders();
        try {
            let res = await axios.get("https://api.sleepmedic.me:8443/home/month", {headers});
            console.log(res);
            res.data.forEach(element => {
                element.date = element.date.substring(5);
            });
            setMonthRecords(res.data);

            res = await axios.get("https://api.sleepmedic.me:8443/home/average", {headers});
            setAllAvgs(res.data);
        }
        catch (err) {
            console.log('Failed to get records.');
        }
    }

    React.useEffect(() => {
        getRecords();
    }, []);

    if (monthRecords === []) return (<div>HI</div>)
    else return (
        <Box>
            <Navbar/>
            <Grid container spacing={2} columns={3} sx={{margin: 0}}>
                <Grid item xs={3}>
                    {/* {makeLineGraph(monthRecords, "date", 'quality', 'Monthly Quality', [0,5], 6)} */}
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Monthly Quality" {...a11yProps(0)} />
                            <Tab label="Monthly Efficiency" {...a11yProps(1)} />
                            <Tab label="Monthly Falling Asleep Time" {...a11yProps(2)} />
                            <Tab label="Times" {...a11yProps(3)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            {makeLineGraph(monthRecords, "date", 'quality', [0,5], 6, showAvg, allAvgs.quality)}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            {makeLineGraph(monthRecords, "date", 'efficiency', [0,1], 6, showAvg, allAvgs.efficiency)}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            {makeLineGraph(monthRecords, "date", 'fallTime', [0,30], 6, showAvg, allAvgs.fallTime)}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                            {/* {makeLineGraph(monthRecords, "date", 'upTime', [0,24], 4, showAvg)} */}
                            <Paper sx={{width: '80%'}} elevation={0}>
                                <Grid container spacing={2} columns={1} margin={0} >
                                    <Grid item xs={1}>
                                        <LineChart width={1000} height={400} data={monthRecords} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                                            <XAxis dataKey={"date"}/>
                                            <YAxis domain={[0,24]} interval="preserveStartEnd" tickCount={4}/>
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey={"upTime"} stroke="#F3C98B" />
                                            <Line type="monotone" dataKey={"wakeTime"} stroke="#8884d8" />
                                            <Line type="monotone" dataKey={"downTime"} stroke="#0F084B" />
                                            <Line type="monotone" dataKey={"sleepTime"} stroke="#869D96" />
                                            {/* #525B76, #869D96 */}
                                        </LineChart>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </CustomTabPanel>
                    </Box>
                </Grid>
            </Grid>
            <Checkbox checked={showAvg} onChange={(e)=>{setShowAvg(e.target.checked)}}/>
            <Button onClick={(e)=> {console.log(allAvgs)}}>TEST</Button>
            
        </Box>
    )
}