/*
 *  Home page for Sleep Medic app
 */
// import dayjs from 'dayjs';
import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Navbar from '../navbar/Navbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, styled } from '@mui/material/styles';

// TODO: grab username from cookies
let username = "User Name";

export default function Home() {
    // const [value, setValue] = React.useState(dayjs());

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
                            Weekly Summary Statistics
                        </Paper>
                    </Grid>

                    {/* Weekly Advices */}
                    {/* Create New Record Button */}

                </Grid>
                </Grid>

                {/* RIGHT PANEL */}
                <Grid item xs={1}>

                </Grid>

            </Grid>

        </Box>
    )
}