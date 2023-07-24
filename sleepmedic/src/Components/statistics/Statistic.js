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
import { LineChart,
         Line,
         CartesianGrid, 
         XAxis, YAxis, 
         Tooltip, 
         ReferenceLine, 
         Legend, 
         BarChart, Bar, 
         ResponsiveContainer,
         ScatterChart, Scatter
        } from 'recharts';


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
        
            <Paper sx={{width: '100%'}} style={{color:'white', background: 'linear-gradient(to top, #3E4464, #222740)'}} elevation={3}> 
                <Grid container spacing={2} columns={1} >
                    <Grid item xs={1}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <ResponsiveContainer aspect={2.8}>
                            <LineChart data={data} margin={{ top: 15, right: 50, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey={y} stroke="#c4c1f7" strokeWidth={3} />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis stroke={'white'} dataKey={x}/>
                                <YAxis stroke={'white'} domain={scale} interval="preserveStartEnd" tickCount={ytick}/>
                                <Tooltip />
                                {isRefLine ? <ReferenceLine y={avg} stroke="red"/> : undefined}
                            </LineChart> 
                        </ResponsiveContainer>
                        </Box>
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

    const SleepShape = (props) => {
        const { cx, cy, payload } = props;
        const emoji = '💤'
        const offset = 7;
        return (<g> <text x={cx} y={cy + offset} textAnchor="middle" fontSize={16} fill="#666">{emoji}</text> </g>);
    }
    const WakeShape = (props) => {
        const { cx, cy, payload } = props;
        const emoji = '⏰'
        const offset = 7;
        return (<g> <text x={cx} y={cy + offset} textAnchor="middle" fontSize={16} fill="#666">{emoji}</text> </g>);
    }
    const DownShape = (props) => {
        const { cx, cy, payload } = props;
        const emoji = '🔽'
        const offset = 7;
        return (<g> <text x={cx} y={cy + offset} textAnchor="middle" fontSize={16} fill="#666">{emoji}</text> </g>);
    }
    const UpShape = (props) => {
        const { cx, cy, payload } = props;
        const emoji = '🔼'
        const offset = 7;
        return (<g> <text x={cx} y={cy + offset} textAnchor="middle" fontSize={16} fill="#666">{emoji}</text> </g>);
    }

    if (monthRecords === []) return (<div>HI</div>)
    else return (
        <Box  sx={{
            backgroundColor: "#57118E",           /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
            background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
            animation: 'animazione 13s ease-in-out infinite alternate-reverse',
        
            height: '100vh' ,
            width: '100vw',
            overflow: 'hidden',
            overflowY: 'scroll'
            
        }}>
            <Navbar/>
            <Grid container spacing={2} columns={3} sx={{margin: 0, paddingRight: 4}}>
                <Grid item xs={3}>
                    {/* {makeLineGraph(monthRecords, "date", 'quality', 'Monthly Quality', [0,5], 6)} */}
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Paper sx={{ width: '100%', backgroundColor: '#D9D3E4'}}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Monthly Quality" {...a11yProps(0)} />
                                <Tab label="Monthly Efficiency" {...a11yProps(1)} />
                                <Tab label="Monthly Falling Asleep Time" {...a11yProps(2)} />
                                <Tab label="Times" {...a11yProps(3)} />
                                </Tabs>
                            </Paper>
                            
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
                            <Paper sx={{ width: '100%'}} style={{color:'white', background: 'linear-gradient(to top, #3E4464, #222740)'}} elevation={3} >
                                <Grid container spacing={2} columns={1}  >
                                    <Grid item xs={1}>
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <ResponsiveContainer aspect={2.8}>
                                                
                                                <ScatterChart margin={{ top: 15, right: 50, bottom: 5, left: 0 }}>
                                                    <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                                                    <XAxis stroke={'white'} type="category" dataKey={"date"} allowDuplicatedCategory={false}/>
                                                    <YAxis yAxisId='upT' stroke={'white'} type="number" dataKey={"upTime"} domain={[0,24]} interval="preserveStartEnd" tickCount={4}/>
                                                    <YAxis hide={true} yAxisId='downT' stroke={'white'} type="number" dataKey={"downTime"} domain={[0,24]} interval="preserveStartEnd" tickCount={4}/>
                                                    <YAxis hide={true} yAxisId='wakeT' stroke={'white'} type="number" dataKey={"wakeTime"} domain={[0,24]} interval="preserveStartEnd" tickCount={4}/>
                                                    <YAxis hide={true} yAxisId='sleepT' stroke={'white'} type="number" dataKey={"sleepTime"} domain={[0,24]} interval="preserveStartEnd" tickCount={4}/>
                                                    <Tooltip/>
                                                    <Scatter yAxisId='upT' name="Up Time" data={monthRecords} shape={<UpShape />}/>
                                                    <Scatter yAxisId='downT' name="Down Time" data={monthRecords} shape={<DownShape />}/>
                                                    <Scatter yAxisId='wakeT' name="Wake Time" data={monthRecords} shape={<WakeShape />}/>
                                                    <Scatter yAxisId='sleepT' name="Sleep Time" data={monthRecords} shape={<SleepShape />}/>
                                                </ScatterChart>
                                            </ResponsiveContainer>
                                            
                                        </Box>
                                        
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