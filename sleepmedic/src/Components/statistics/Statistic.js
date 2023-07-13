import axios from "axios";
import * as React from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from '../navbar/Navbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';


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
        "Access-Control-Allow-Origin": "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/",
        "Authorization":'Bearer ' + cookies._auth
    };
    return headers; 
}

function makeLineGraph(data, x, y, title, scale=[0,10], ytick) {
    return (
        <Paper sx={{width: '80%'}}>
            <Grid container spacing={2} columns={1} margin={0} >
                <Grid item xs={1}>
                    <Typography variant="h5" textAlign='center'>{title}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey={y} stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey={x}/>
                        <YAxis domain={scale} interval="preserveStartEnd" tickCount={ytick}/>
                        <Tooltip />
                    </LineChart>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default function Statistics() {
    const[monthRecords, setMonthRecords] = React.useState([]);

    async function getRecords() {
        const headers = getGetHeaders();
        try {
            let res = await axios.get("http://18.224.194.235:8080/api/home/month", {headers});
            setMonthRecords(res.data);
            console.log(monthRecords);
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
            <Grid container spacing={2} columns={2} sx={{margin: 0}}>
                <Grid item xs={1}>
                    {makeLineGraph(monthRecords, "date", 'quality', 'Monthly Quality', [0,5], 6)}
                </Grid>
                <Grid item xs={1}>
                    {makeLineGraph(monthRecords, "date", 'efficiency', 'Monthly Efficiency', [0,1], 6)}
                </Grid>
                <Grid item xs={1}>
                    {makeLineGraph(monthRecords, "date", 'fallTime', 'Monthly Falling Asleep Time', [0,100], 6)}
                </Grid>
            </Grid>
            
            
        </Box>
    )
}