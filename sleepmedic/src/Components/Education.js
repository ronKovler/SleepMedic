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
  Paper,
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
          week: t("education.week2.title"),
          days: [
            {
              day: t("education.week2.day4.title"),
              buttons: [
                {
                  button: t("education.week2.day4.lesson10.title"),
                  reading: t("education.week2.day4.lesson10.reading")
                },
                {
                  button: t("education.week2.day4.lesson11.title"),
                  reading: t("education.week2.day4.lesson11.reading")
                },
                {
                  button: t("education.week2.day4.lesson12.title"),
                  reading: t("education.week2.day4.lesson12.reading")
                }
              ]
            },
            {
              day: t("education.week2.day5.title"),
              buttons: [
                {
                  button: t("education.week2.day5.lesson13.title"),
                  reading: t("education.week2.day5.lesson13.reading")
                },
                {
                  button: t("education.week2.day5.lesson14.title"),
                  reading: t("education.week2.day5.lesson14.reading")
                },
                {
                  button: t("education.week2.day5.lesson15.title"),
                  reading: t("education.week2.day5.lesson15.reading")
                }
              ]
            },
            {
              day: t("education.week2.day6.title"),
              buttons: [
                {
                  button: t("education.week2.day6.lesson16.title"),
                  reading: t("education.week2.day6.lesson16.reading")
                },
                {
                  button: t("education.week2.day6.lesson17.title"),
                  reading: t("education.week2.day6.lesson17.reading")
                },
                {
                  button: t("education.week2.day6.lesson18.title"),
                  reading: t("education.week2.day6.lesson18.reading")
                }
              ]
            },
          ],
        },
        {
            week: t("education.week3.title"),
            days: [
              {
                day: t("education.week3.day7.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week3.day7.lesson19.title"), // Incrementing the lesson number
                    reading: t("education.week3.day7.lesson19.reading")
                  },
                  {
                    button: t("education.week3.day7.lesson20.title"),
                    reading: t("education.week3.day7.lesson20.reading")
                  },
                  {
                    button: t("education.week3.day7.lesson21.title"),
                    reading: t("education.week3.day7.lesson21.reading")
                  }
                ]
              },
              {
                day: t("education.week3.day8.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week3.day8.lesson22.title"), // Incrementing the lesson number
                    reading: t("education.week3.day8.lesson22.reading")
                  },
                  {
                    button: t("education.week3.day8.lesson23.title"),
                    reading: t("education.week3.day8.lesson23.reading")
                  },
                  {
                    button: t("education.week3.day8.lesson24.title"),
                    reading: t("education.week3.day8.lesson24.reading")
                  }
                ]
              },
              {
                day: t("education.week3.day9.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week3.day9.lesson25.title"), // Incrementing the lesson number
                    reading: t("education.week3.day9.lesson25.reading")
                  },
                  {
                    button: t("education.week3.day9.lesson26.title"),
                    reading: t("education.week3.day9.lesson26.reading")
                  },
                  {
                    button: t("education.week3.day9.lesson27.title"),
                    reading: t("education.week3.day9.lesson27.reading")
                  }
                ]
              },
            ],
          },
          {
            week: t("education.week4.title"),
            days: [
              {
                day: t("education.week4.day10.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week4.day10.lesson28.title"), // Incrementing the lesson number
                    reading: t("education.week4.day10.lesson28.reading")
                  },
                  {
                    button: t("education.week4.day10.lesson29.title"),
                    reading: t("education.week4.day10.lesson29.reading")
                  },
                  {
                    button: t("education.week4.day10.lesson30.title"),
                    reading: t("education.week4.day10.lesson30.reading")
                  }
                ]
              },
              {
                day: t("education.week4.day11.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week4.day11.lesson31.title"), // Incrementing the lesson number
                    reading: t("education.week4.day11.lesson31.reading")
                  },
                  {
                    button: t("education.week4.day11.lesson32.title"),
                    reading: t("education.week4.day11.lesson32.reading")
                  },
                  {
                    button: t("education.week4.day11.lesson33.title"),
                    reading: t("education.week4.day11.lesson33.reading")
                  }
                ]
              },
              {
                day: t("education.week4.day12.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week4.day12.lesson34.title"), // Incrementing the lesson number
                    reading: t("education.week4.day12.lesson34.reading")
                  },
                  {
                    button: t("education.week4.day12.lesson35.title"),
                    reading: t("education.week4.day12.lesson35.reading")
                  },
                  {
                    button: t("education.week4.day12.lesson36.title"),
                    reading: t("education.week4.day12.lesson36.reading")
                  }
                ]
              },
            ],
        },
        {
            week: t("education.week5.title"),
            days: [
              {
                day: t("education.week5.day13.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week5.day13.lesson37.title"), // Incrementing the lesson number
                    reading: t("education.week5.day13.lesson37.reading")
                  },
                  {
                    button: t("education.week5.day13.lesson38.title"),
                    reading: t("education.week5.day13.lesson38.reading")
                  },
                  {
                    button: t("education.week5.day13.lesson39.title"),
                    reading: t("education.week5.day13.lesson39.reading")
                  }
                ]
              },
              {
                day: t("education.week5.day14.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week5.day14.lesson40.title"), // Incrementing the lesson number
                    reading: t("education.week5.day14.lesson40.reading")
                  },
                  {
                    button: t("education.week5.day14.lesson41.title"),
                    reading: t("education.week5.day14.lesson41.reading")
                  },
                  {
                    button: t("education.week5.day14.lesson42.title"),
                    reading: t("education.week5.day14.lesson42.reading")
                  }
                ]
              },
              {
                day: t("education.week5.day15.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week5.day15.lesson43.title"), // Incrementing the lesson number
                    reading: t("education.week5.day15.lesson43.reading")
                  },
                  {
                    button: t("education.week5.day15.lesson44.title"),
                    reading: t("education.week5.day15.lesson44.reading")
                  },
                  {
                    button: t("education.week5.day15.lesson45.title"),
                    reading: t("education.week5.day15.lesson45.reading")
                  }
                ]
              },
            ],
          },
          {
            week: t("education.week6.title"),
            days: [
              {
                day: t("education.week6.day16.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week6.day16.lesson46.title"), // Incrementing the lesson number
                    reading: t("education.week6.day16.lesson46.reading")
                  },
                  {
                    button: t("education.week6.day16.lesson47.title"),
                    reading: t("education.week6.day16.lesson47.reading")
                  },
                  {
                    button: t("education.week6.day16.lesson48.title"),
                    reading: t("education.week6.day16.lesson48.reading")
                  }
                ]
              },
              {
                day: t("education.week6.day17.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week6.day17.lesson49.title"), // Incrementing the lesson number
                    reading: t("education.week6.day17.lesson49.reading")
                  },
                  {
                    button: t("education.week6.day17.lesson50.title"),
                    reading: t("education.week6.day17.lesson50.reading")
                  },
                  {
                    button: t("education.week6.day17.lesson51.title"),
                    reading: t("education.week6.day17.lesson51.reading")
                  }
                ]
              },
              {
                day: t("education.week6.day18.title"), // Incrementing the day number
                buttons: [
                  {
                    button: t("education.week6.day18.lesson52.title"), // Incrementing the lesson number
                    reading: t("education.week6.day18.lesson52.reading")
                  },
                  {
                    button: t("education.week6.day18.lesson53.title"),
                    reading: t("education.week6.day18.lesson53.reading")
                  },
                  {
                    button: t("education.week6.day18.lesson54.title"),
                    reading: t("education.week6.day18.lesson54.reading")
                  }
                ]
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
      <Paper variant="outlined">
        <Typography variant="h4" style={{ textAlign: "center" }} gutterBottom>
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
        </Paper>
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
