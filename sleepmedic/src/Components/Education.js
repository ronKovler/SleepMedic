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
    const lessonPlan = [
      {
        week: t("education.week1.title"),
        days: [
          {
            day: t("education.week1.day1.title"),
            lessons: [
              {
                title: t("education.week1.day1.lesson1.title"),
                reading: t("education.week1.day1.lesson1.reading")
              },
              {
                title: t("education.week1.day1.lesson2.title"),
                reading: t("education.week1.day1.lesson2.reading")
              },
              {
                title: t("education.week1.day1.lesson3.title"),
                reading: t("education.week1.day1.lesson3.reading")
              }
            ]
          },
          {
            day: t("education.week1.day2.title"),
            lessons: [
              {
                title: t("education.week1.day2.lesson1.title"),
                reading: t("education.week1.day2.lesson1.reading")
              },
              {
                title: t("education.week1.day2.lesson2.title"),
                reading: t("education.week1.day2.lesson2.reading")
              },
              {
                title: t("education.week1.day2.lesson3.title"),
                reading: t("education.week1.day2.lesson3.reading")
              },
              {
                title: t("education.week1.day2.lesson4.title"),
                reading: t("education.week1.day2.lesson4.reading")
              },
              {
                title: t("education.week1.day2.lesson5.title"),
                reading: t("education.week1.day2.lesson5.reading")
              }
            ]
          },
          {
            day: t("education.week1.day3.title"),
            lessons: [
              {
                title: t("education.week1.day3.lesson1.title"),
                reading: t("education.week1.day3.lesson1.reading")
              },
              {
                title: t("education.week1.day3.lesson2.title"),
                reading: t("education.week1.day3.lesson2.reading")
              }
            ]
          },
          {
            day: t("education.week1.day4.title"),
            lessons: [
              {
                title: t("education.week1.day4.lesson1.title"),
                reading: t("education.week1.day4.lesson1.reading")
              },
              {
                title: t("education.week1.day4.lesson2.title"),
                reading: t("education.week1.day4.lesson2.reading")
              },
              {
                title: t("education.week1.day4.lesson3.title"),
                reading: t("education.week1.day4.lesson3.reading")
              }
            ]
          },
          {
            day: t("education.week1.day5.title"),
            lessons: [
              {
                title: t("education.week1.day5.lesson1.title"),
                reading: t("education.week1.day5.lesson1.reading")
              },
              {
                title: t("education.week1.day5.lesson2.title"),
                reading: t("education.week1.day5.lesson2.reading")
              },
              {
                title: t("education.week1.day5.lesson3.title"),
                reading: t("education.week1.day5.lesson3.reading")
              }
            ]
          },
          {
            day: t("education.week1.day6.title"),
            lessons: [
              {
                title: t("education.week1.day6.lesson1.title"),
                reading: t("education.week1.day6.lesson1.reading")
              },
              {
                title: t("education.week1.day6.lesson2.title"),
                reading: t("education.week1.day6.lesson2.reading")
              },
              {
                title: t("education.week1.day6.lesson3.title"),
                reading: t("education.week1.day6.lesson3.reading")
              },
              {
                title: t("education.week1.day6.lesson4.title"),
                reading: t("education.week1.day6.lesson4.reading")
              }
            ]
          },
          {
            day: t("education.week1.day7.title"),
            lessons: [
              {
                title: t("education.week1.day7.lesson1.title"),
                reading: t("education.week1.day7.lesson1.reading")
              },
              {
                title: t("education.week1.day7.lesson2.title"),
                reading: t("education.week1.day7.lesson2.reading")
              }
            ]
          }
        ]
      },
      {
        week: t("education.week2.title"),
        days: [
          {
            day: t("education.week2.day1.title"),
            lessons: [
              {
                title: t("education.week2.day1.lesson1.title"),
                reading: t("education.week2.day1.lesson1.reading")
              },
              {
                title: t("education.week2.day1.lesson2.title"),
                reading: t("education.week2.day1.lesson2.reading")
              },
              {
                title: t("education.week2.day1.lesson3.title"),
                reading: t("education.week2.day1.lesson3.reading")
              },
              {
                title: t("education.week2.day1.lesson4.title"),
                reading: t("education.week2.day1.lesson4.reading")
              }
            ]
          },
          {
            day: t("education.week2.day2.title"),
            lessons: [
              {
                title: t("education.week2.day2.lesson1.title"),
                reading: t("education.week2.day2.lesson1.reading")
              },
              {
                title: t("education.week2.day2.lesson2.title"),
                reading: t("education.week2.day2.lesson2.reading")
              }
            ]
          },
          {
            day: t("education.week2.day3.title"),
            lessons: [
              {
                title: t("education.week2.day3.lesson1.title"),
                reading: t("education.week2.day3.lesson1.reading")
              },
              {
                title: t("education.week2.day3.lesson2.title"),
                reading: t("education.week2.day3.lesson2.reading")
              },
              {
                title: t("education.week2.day3.lesson3.title"),
                reading: t("education.week2.day3.lesson3.reading")
              },
              {
                title: t("education.week2.day3.lesson4.title"),
                reading: t("education.week2.day3.lesson4.reading")
              }
            ]
          },
          {
            day: t("education.week2.day4.title"),
            lessons: [
              {
                title: t("education.week2.day4.lesson1.title"),
                reading: t("education.week2.day4.lesson1.reading")
              },
              {
                title: t("education.week2.day4.lesson2.title"),
                reading: t("education.week2.day4.lesson2.reading")
              }
            ]
          },
          {
            day: t("education.week2.day5.title"),
            lessons: [
              {
                title: t("education.week2.day5.lesson1.title"),
                reading: t("education.week2.day5.lesson1.reading")
              },
              {
                title: t("education.week2.day5.lesson2.title"),
                reading: t("education.week2.day5.lesson2.reading")
              },
              {
                title: t("education.week2.day5.lesson3.title"),
                reading: t("education.week2.day5.lesson3.reading")
              },
              {
                title: t("education.week2.day5.lesson4.title"),
                reading: t("education.week2.day5.lesson4.reading")
              },
              {
                title: t("education.week2.day5.lesson5.title"),
                reading: t("education.week2.day5.lesson5.reading")
              }
            ]
          },
          {
            day: t("education.week2.day6.title"),
            lessons: [
              {
                title: t("education.week2.day6.lesson1.title"),
                reading: t("education.week2.day6.lesson1.reading")
              }
            ]
          },
          {
            day: t("education.week2.day7.title"),
            lessons: [
              {
                title: t("education.week2.day7.lesson1.title"),
                reading: t("education.week2.day7.lesson1.reading")
              }
            ]
          },
          // Continue adding days and lessons for Week 2
        ]
      },
      {
        week: t("education.week3.title"),
        days: [
          {
            day: t("education.week3.day1.title"),
            lessons: [
              {
                title: t("education.week3.day1.lesson1.title"),
                reading: t("education.week3.day1.lesson1.reading")
              },
              {
                title: t("education.week3.day1.lesson2.title"),
                reading: t("education.week3.day1.lesson2.reading")
              },
              // Add more lessons for Week 3, Day 1 if needed
            ]
          },
          {
            day: t("education.week3.day2.title"),
            lessons: [
              {
                title: t("education.week3.day2.lesson1.title"),
                reading: t("education.week3.day2.lesson1.reading")
              },
              {
                title: t("education.week3.day2.lesson2.title"),
                reading: t("education.week3.day2.lesson2.reading")
              },
              // Add more lessons for Week 3, Day 2 if needed
            ]
          },
          // Continue adding days and lessons for Week 3
    
          // Day 3
          {
            day: t("education.week3.day3.title"),
            lessons: [
              {
                title: t("education.week3.day3.lesson1.title"),
                reading: t("education.week3.day3.lesson1.reading")
              }
              // Add more lessons for Week 3, Day 3 if needed
            ]
          },
    
          // Day 4
          {
            day: t("education.week3.day4.title"),
            lessons: [
              {
                title: t("education.week3.day4.lesson1.title"),
                reading: t("education.week3.day4.lesson1.reading")
              },
              {
                title: t("education.week3.day4.lesson2.title"),
                reading: t("education.week3.day4.lesson2.reading")
              },
              // Add more lessons for Week 3, Day 4 if needed
            ]
          },
    
          // Day 5
          {
            day: t("education.week3.day5.title"),
            lessons: [
              {
                title: t("education.week3.day5.lesson1.title"),
                reading: t("education.week3.day5.lesson1.reading")
              }
              // Add more lessons for Week 3, Day 5 if needed
            ]
          },
    
          // Day 6
          {
            day: t("education.week3.day6.title"),
            lessons: [
              {
                title: t("education.week3.day6.lesson1.title"),
                reading: t("education.week3.day6.lesson1.reading")
              }
              // Add more lessons for Week 3, Day 6 if needed
            ]
          },
    
          // Day 7
          {
            day: t("education.week3.day7.title"),
            lessons: [
              {
                title: t("education.week3.day7.lesson1.title"),
                reading: t("education.week3.day7.lesson1.reading")
              }
              // Add more lessons for Week 3, Day 7 if needed
            ]
          },
        ]
      },
      {
        week: t("education.week4.title"),
        days: [
          // Day 1
          {
            day: t("education.week4.day1.title"),
            lessons: [
              {
                title: t("education.week4.day1.lesson1.title"),
                reading: t("education.week4.day1.lesson1.reading")
              },
              {
                title: t("education.week4.day1.lesson2.title"),
                reading: t("education.week4.day1.lesson2.reading")
              }
              // Add more lessons for Week 4, Day 1 if needed
            ]
          },
    
          // Day 2
          {
            day: t("education.week4.day2.title"),
            lessons: [
              {
                title: t("education.week4.day2.lesson1.title"),
                reading: t("education.week4.day2.lesson1.reading")
              },
              {
                title: t("education.week4.day2.lesson2.title"),
                reading: t("education.week4.day2.lesson2.reading")
              }
              // Add more lessons for Week 4, Day 2 if needed
            ]
          },
    
          // Day 3
          {
            day: t("education.week4.day3.title"),
            lessons: [
              {
                title: t("education.week4.day3.lesson1.title"),
                reading: t("education.week4.day3.lesson1.reading")
              }
              // Add more lessons for Week 4, Day 3 if needed
            ]
          },
    
          // Day 4
          {
            day: t("education.week4.day4.title"),
            lessons: [
              {
                title: t("education.week4.day4.lesson1.title"),
                reading: t("education.week4.day4.lesson1.reading")
              }
              // Add more lessons for Week 4, Day 4 if needed
            ]
          },
    
          // Day 5
          {
            day: t("education.week4.day5.title"),
            lessons: [
              {
                title: t("education.week4.day5.lesson1.title"),
                reading: t("education.week4.day5.lesson1.reading")
              }
              // Add more lessons for Week 4, Day 5 if needed
            ]
          },
    
          // Day 6
          {
            day: t("education.week4.day6.title"),
            lessons: [
              {
                title: t("education.week4.day6.lesson1.title"),
                reading: t("education.week4.day6.lesson1.reading")
              }
              // Add more lessons for Week 4, Day 6 if needed
            ]
          },
    
          // Day 7
          {
            day: t("education.week4.day7.title"),
            lessons: [
              {
                title: t("education.week4.day7.lesson1.title"),
                reading: t("education.week4.day7.lesson1.reading")
              }
              // Add more lessons for Week 4, Day 7 if needed
            ]
          },
        ]
      },
      {
        week: t("education.week5.title"),
        days: [
          // Day 1
          {
            day: t("education.week5.day1.title"),
            lessons: [
              {
                title: t("education.week5.day1.lesson1.title"),
                reading: t("education.week5.day1.lesson1.reading")
              },
              {
                title: t("education.week5.day1.lesson2.title"),
                reading: t("education.week5.day1.lesson2.reading")
              }
              // Add more lessons for Week 5, Day 1 if needed
            ]
          },
    
          // Day 2
          {
            day: t("education.week5.day2.title"),
            lessons: [
              {
                title: t("education.week5.day2.lesson1.title"),
                reading: t("education.week5.day2.lesson1.reading")
              },
              {
                title: t("education.week5.day2.lesson2.title"),
                reading: t("education.week5.day2.lesson2.reading")
              }
              // Add more lessons for Week 5, Day 2 if needed
            ]
          },
    
          // Day 3
          {
            day: t("education.week5.day3.title"),
            lessons: [
              {
                title: t("education.week5.day3.lesson1.title"),
                reading: t("education.week5.day3.lesson1.reading")
              }
              // Add more lessons for Week 5, Day 3 if needed
            ]
          },
    
          // Day 4
          {
            day: t("education.week5.day4.title"),
            lessons: [
              {
                title: t("education.week5.day4.lesson1.title"),
                reading: t("education.week5.day4.lesson1.reading")
              }
              // Add more lessons for Week 5, Day 4 if needed
            ]
          },
    
          // Day 5
          {
            day: t("education.week5.day5.title"),
            lessons: [
              {
                title: t("education.week5.day5.lesson1.title"),
                reading: t("education.week5.day5.lesson1.reading")
              }
              // Add more lessons for Week 5, Day 5 if needed
            ]
          },
    
          // Day 6
          {
            day: t("education.week5.day6.title"),
            lessons: [
              {
                title: t("education.week5.day6.lesson1.title"),
                reading: t("education.week5.day6.lesson1.reading")
              }
              // Add more lessons for Week 5, Day 6 if needed
            ]
          },
    
          // Day 7
          {
            day: t("education.week5.day7.title"),
            lessons: [
              {
                title: t("education.week5.day7.lesson1.title"),
                reading: t("education.week5.day7.lesson1.reading")
              }
              // Add more lessons for Week 5, Day 7 if needed
            ]
          },
        ]
      },
      {
        week: t("education.week6.title"),
        days: [
          // Day 1
          {
            day: t("education.week6.day1.title"),
            lessons: [
              {
                title: t("education.week6.day1.lesson1.title"),
                reading: t("education.week6.day1.lesson1.reading")
              },
              {
                title: t("education.week6.day1.lesson2.title"),
                reading: t("education.week6.day1.lesson2.reading")
              }
              // Add more lessons for Week 6, Day 1 if needed
            ]
          },
    
          // Day 2
          {
            day: t("education.week6.day2.title"),
            lessons: [
              {
                title: t("education.week6.day2.lesson1.title"),
                reading: t("education.week6.day2.lesson1.reading")
              },
              {
                title: t("education.week6.day2.lesson2.title"),
                reading: t("education.week6.day2.lesson2.reading")
              }
              // Add more lessons for Week 6, Day 2 if needed
            ]
          },
    
          // Day 3
          {
            day: t("education.week6.day3.title"),
            lessons: [
              {
                title: t("education.week6.day3.lesson1.title"),
                reading: t("education.week6.day3.lesson1.reading")
              },
              {
                title: t("education.week6.day3.lesson2.title"),
                reading: t("education.week6.day3.lesson2.reading")
              }
              // Add more lessons for Week 6, Day 3 if needed
            ]
          },
    
          // Day 4
          {
            day: t("education.week6.day4.title"),
            lessons: [
              {
                title: t("education.week6.day4.lesson1.title"),
                reading: t("education.week6.day4.lesson1.reading")
              }
              // Add more lessons for Week 6, Day 4 if needed
            ]
          },
    
          // Day 5
          {
            day: t("education.week6.day5.title"),
            lessons: [
              {
                title: t("education.week6.day5.lesson1.title"),
                reading: t("education.week6.day5.lesson1.reading")
              },
              {
                title: t("education.week6.day5.lesson2.title"),
                reading: t("education.week6.day5.lesson2.reading")
              }
              // Add more lessons for Week 6, Day 5 if needed
            ]
          },
    
          // Day 6
          {
            day: t("education.week6.day6.title"),
            lessons: [
              {
                title: t("education.week6.day6.lesson1.title"),
                reading: t("education.week6.day6.lesson1.reading")
              },
              {
                title: t("education.week6.day6.lesson2.title"),
                reading: t("education.week6.day6.lesson2.reading")
              }
              // Add more lessons for Week 6, Day 6 if needed
            ]
          },
    
          // Day 7
          {
            day: t("education.week6.day7.title"),
            lessons: [
              {
                title: t("education.week6.day7.lesson1.title"),
                reading: t("education.week6.day7.lesson1.reading")
              }
              // Add more lessons for Week 6, Day 7 if needed
            ]
          },
        ]
      }
    ];
    
      

  const handleButtonClick = (lesson) => {
    // Handle button click for a specific button

    setReadingTitle(lesson.title);
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


        {lessonPlan.map((week, weekIndex) => (
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
                        {day.lessons.map((lesson, buttonIndex) => (
                          <Button
                            key={buttonIndex}
                            variant="outlined"
                            fullWidth
                            onClick={() => handleButtonClick(lesson)}
                          >
                            {lesson.title}
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
