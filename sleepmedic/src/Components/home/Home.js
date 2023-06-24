/*
 *  Home page for Sleep Medic app
 */
import dayjs from 'dayjs';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Navbar from '../navbar/Navbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, styled } from '@mui/material/styles';

// TODO: grab username from cookies
let username = "User Name";

let now = new Date();
let avgFallAsleepTime = 27.00; // minutes
let avgSleepTime = 7.05;
let avgWokeUpTime = 2;
let avgBedTime = '11:45'; //TODO: temporarily, need to change
let avgUpTime = '07:28'; //TODO: temporarily, need to change
console.log(avgBedTime);


function getCurrentWeek() {
    // start of week (Sunday)
    let startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() + 6) % 7));
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

export default function Home() {
    const currentWeek = getCurrentWeek();

    return (
        <Box>
            <Navbar/>
            <Grid container spacing={2} columns={2} sx={{margin: 0}}>
                {/* LEFT PANEL */}
                <Grid item xs={1}>
                <Grid container space={2} columns={1}>
                    {/* Username Display */}
                    <Grid item xs={1}>
                        <Paper elevation={3} sx={{backgroundColor: '#ba000d'}}>
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
                    <Grid item xs={1} sx={{marginTop: '20pt'}}>
                        <Paper elevation={3}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                Weekly Summary Statistics
                            </Typography>
                            <Typography variant='h6' component='div' textAlign='center'>
                                {currentWeek}
                            </Typography>
                            <Grid container columns={2}>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='10pt'>
                                        Time spent falling asleep: <br/>
                                        Time spent sleeping: <br/>
                                        Woke up in the night: <br/>
                                        Went to bed at: <br/>
                                        Woke up at: <br/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant='body' component='div' textAlign='left' paddingLeft='20pt' paddingBottom='20pt'>
                                        {avgFallAsleepTime}<br/>
                                        {avgSleepTime}<br/>
                                        {avgWokeUpTime}<br/>
                                        {avgBedTime}<br/>
                                        {avgUpTime}<br/>
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>

                    {/* Weekly Advices */}
                    <Grid item xs={1} sx={{marginTop: '20pt'}}>
                        <Paper elevation={3}>
                            <Typography variant='h5' component='div' textAlign='center' paddingTop='10pt' fontWeight='bold'>
                                Weekly Advices
                            </Typography>
                            <Typography variant='body' component='div' textAlign='left' paddingTop='10pt' paddingLeft='20pt' paddingBottom='10pt'>
                                I already want to take a nap tomorrow.
                            </Typography>
                        </Paper>
                    </Grid>
                    

                    {/* Create New Record Button */}
                    <Grid item xs={1} justifyContent='center' display='flex' marginTop='20pt'>
                        {/* TODO: add event listener to create  */}
                        <Button variant='outlined' endIcon={<AddCircleOutlineIcon/>}>New Record</Button>
                    </Grid>

                </Grid>
                </Grid>

                {/* RIGHT PANEL */}
                <Grid item xs={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar views={['day']}/>
                    </LocalizationProvider>            
                </Grid>

            </Grid>

        </Box>
    )
}