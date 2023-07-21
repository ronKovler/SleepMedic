import React from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Card,
  CardContent,
  ListItemIcon,
  Button,
} from '@mui/material';
import { Grid3x3Outlined, ExpandMoreOutlined } from '@mui/icons-material';
import Navbar from './navbar/Navbar';
import "./Education.css"

const EducationPage = () => {
  const weeks = [
    {
      week: 'Week 1',
      days: [
        {
          day: 'Day 1',
          buttons: ['Button 1', 'Button 2', 'Button 3'],
          readings: ['Reading 1', 'Reading 2', 'Reading 3'],
        },
        {
          day: 'Day 2',
          buttons: ['Button 4', 'Button 5', 'Button 6'],
          readings: ['Reading 4', 'Reading 5', 'Reading 6'],
        },
        {
          day: 'Day 3',
          buttons: ['Button 7', 'Button 8', 'Button 9'],
          readings: ['Reading 7', 'Reading 8', 'Reading 9'],
        },
      ],
    },
    {
      week: 'Week 2',
      days: [
        // Add days for Week 2
      ],
    },
    // Add more weeks as needed
  ];

  const handleButtonClick = (button) => {
    // Handle button click for a specific button
    console.log(`Button clicked: ${button}`);
  };

  return (
    <div style={{backgroundColor: "#57118E",           /*#3E4464 10px, #57618E, #717AA8 45%,  #3E4464 10px */
    background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
    animation: 'animazione 13s ease-in-out infinite alternate-reverse',
    height: "100vh" }}>
    <Navbar />
    <Grid container spacing={1} >
      <Grid item xs={3} marginTop={3} style={{ paddingLeft: '1rem', paddingRight: '1rem'}}>
        <Typography className="table-of-contents" gutterBottom >
          Table of Contents
        </Typography>
        <Accordion elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
            <ListItemIcon>
              <Grid3x3Outlined />
            </ListItemIcon>
            <Typography variant="h6">Dashboard</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">Dashboard content goes here.</Typography>
          </AccordionDetails>
        </Accordion>


        {weeks.map((week, weekIndex) => (
          <Accordion key={weekIndex} elevation={0} square>
            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
              <Typography variant="h6">{week.week}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" width="100%">
                {week.days.map((day, dayIndex) => (
                  <Accordion key={dayIndex} elevation={0} square>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                      <Button variant="text" fullWidth>
                        {day.day}
                      </Button>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" flexDirection="column" width="100%">
                        {day.buttons.map((button, buttonIndex) => (
                          <Button
                            key={buttonIndex}
                            variant="outlined"
                            fullWidth
                            onClick={() => handleButtonClick(button)}
                          >
                            {button}
                          </Button>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
      <Grid xs={1.5}>
            {/* Extra Spacing */}
      </Grid>
      <Grid item xs={6}>
        <Box marginTop={8}>
          {/* Box for generated readings */}
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Reading Title
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reading content goes here.
              </Typography>
            </CardContent>
          </Card>

          {/* Next button */}
          <Box textAlign="right" marginTop={2}>
            <Button variant="contained" color="primary">
              Next
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
    </div>
  );
};

export default EducationPage;
