import {React} from 'react';
import { useTranslation } from 'react-i18next';
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
import { useState } from 'react';

function EducationPage() {
    const [t, i18n] = useTranslation("global");
    const [readingTitle, setReadingTitle] = useState("Reading Title");
    const [readings, setReadings] = useState("This is a placeholder");
    const weeks = [
    {
      week: t("education.week1.title"),
      days: [
        {
          day: t("education.week1.day1.title"),
          buttons: [
            { 
                button: t("education.week1.day1.lesson1.title"),
                reading: t("education.week1.day1.lesson1.reading")
            }, 
            {
                button: t("education.week1.day1.lesson2.title"),
                reading: t("education.week1.day1.lesson2.reading")
            }, 
            {
                button: t("education.week1.day1.lesson3.title"),
                reading: t("education.week1.day1.lesson3.reading")
            }
          ]
        },
        {
          day: t("education.week1.day2.title"),
          buttons: [
            { 
                button: t("education.week1.day2.lesson4.title"),
                reading: t("education.week1.day2.lesson4.reading")
            }, 
            {
                button: t("education.week1.day2.lesson5.title"),
                reading: t("education.week1.day2.lesson5.reading")
            }, 
            {
                button: t("education.week1.day2.lesson6.title"),
                reading: t("education.week1.day2.lesson6.reading")
            }
          ]
        },
        {
          day: t("education.week1.day3.title"),
          buttons: [
            { 
                button: t("education.week1.day3.lesson7.title"),
                reading: t("education.week1.day3.lesson7.reading")
            }, 
            {
                button: t("education.week1.day3.lesson8.title"),
                reading: t("education.week1.day3.lesson8.reading")
            }, 
            {
                button: t("education.week1.day3.lesson9.title"),
                reading: t("education.week1.day3.lesson9.reading")
            }
          ]
        },
      ],
    },
    {
      week: 'Week 2',
      days: [
        // Add days for Week 2
        {
            day: 'Day 4',
            buttons: ['Button 1', 'Button 2', 'Button 3'],
            readings: ['Reading 1', 'Reading 2', 'Reading 3'],
          },
          {
            day: 'Day 5',
            buttons: ['Button 4', 'Button 5', 'Button 6'],
            readings: ['Reading 4', 'Reading 5', 'Reading 6'],
          },
          {
            day: 'Day 6',
            buttons: ['Button 7', 'Button 8', 'Button 9'],
            readings: ['Reading 7', 'Reading 8', 'Reading 9'],
          },
      ],
    },
    // Add more weeks as needed
  ];

  const handleButtonClick = (lesson) => {
    // Handle button click for a specific button

    setReadingTitle(lesson.button);
    setReadings(lesson.reading);
  };

  return (
    <div className="education-container">
    <Navbar />
    <Grid container spacing={1} >
      <Grid item xs={3} marginTop={3} style={{ paddingLeft: '1rem', paddingRight: '1rem'}}>
        <Typography className="table-of-contents" gutterBottom >
          {t("education.table-of-contents")}
        </Typography>
        <Accordion elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
            <ListItemIcon>
              <Grid3x3Outlined />
            </ListItemIcon>
            <Typography variant="h6">{t("education.dashboard")}</Typography>
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
                        {day.buttons.map((lesson, buttonIndex) => (
                          <Button
                            key={buttonIndex}
                            variant="outlined"
                            fullWidth
                            onClick={() => handleButtonClick(lesson)}
                          >
                            {lesson.button}
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
                {readingTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {readings}
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
