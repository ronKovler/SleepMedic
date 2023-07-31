import { React, useEffect } from 'react';
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
  List,
  Collapse,
  ListItemButton,
  ListItemText,
  ListSubheader
} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { Grid3x3Outlined, ExpandMoreOutlined } from '@mui/icons-material';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'; //week icon
import BookOutlinedIcon from '@mui/icons-material/BookOutlined'; //day icon
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'; //lesson icon
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'; // next icon
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'; //back icon
import Navbar from './navbar/Navbar';
import {isMobile} from 'react-device-detect';
import "./Education.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EducationPage() {
  const [t, i18n] = useTranslation("global");
  const navigate = useNavigate();
  const [readingTitle, setReadingTitle] = useState(t("education.week1.day1.lesson1.title"));
  const [readings, setReadings] = useState(t("education.week1.day1.lesson1.reading"));
  const [weekOpen, setWeekOpen] = useState(0);
  const [dayOpen, setDayOpen] = useState(0);
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
            },
            {
            title: t("education.week1.day1.lesson4.title"),
                reading: t("education.week1.day1.lesson4.reading")
            },
            {
            title: t("education.week1.day1.lesson5.title"),
                reading: t("education.week1.day1.lesson5.reading")
            },
            {
            title: t("education.week1.day1.lesson6.title"),
                reading: t("education.week1.day1.lesson6.reading")
            },
            {
            title: t("education.week1.day1.lesson7.title"),
                reading: t("education.week1.day1.lesson7.reading")
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
            },
            {
                title: t("education.week1.day2.lesson6.title"),
                reading: t("education.week1.day2.lesson6.reading")
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
            },
            {
              title: t("education.week1.day3.lesson3.title"),
              reading: t("education.week1.day3.lesson3.reading")
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
            },
            {
              title: t("education.week1.day4.lesson4.title"),
              reading: t("education.week1.day4.lesson4.reading")
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
            },
            {
                title: t("education.week1.day5.lesson4.title"),
                reading: t("education.week1.day5.lesson4.reading")
            },
            {
                title: t("education.week1.day5.lesson5.title"),
                reading: t("education.week1.day5.lesson5.reading")
            },
            {
                title: t("education.week1.day5.lesson6.title"),
                reading: t("education.week1.day5.lesson6.reading")
            },
            {
                title: t("education.week1.day5.lesson7.title"),
                reading: t("education.week1.day5.lesson7.reading")
            },
            {
                title: t("education.week1.day5.lesson8.title"),
                reading: t("education.week1.day5.lesson8.reading")
            },
            {
                title: t("education.week1.day5.lesson9.title"),
                reading: t("education.week1.day5.lesson9.reading")
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
            },
            {
                title: t("education.week1.day6.lesson5.title"),
                reading: t("education.week1.day6.lesson5.reading")
            },
            {
                title: t("education.week1.day6.lesson6.title"),
                reading: t("education.week1.day6.lesson6.reading")
            },
            {
                title: t("education.week1.day6.lesson7.title"),
                reading: t("education.week1.day6.lesson7.reading")
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

  function getCookiesDict() {
    let cookies = document.cookie.split("; ");
    let cookiesDict = cookies.map(cookie => cookie.split('=')).reduce((acc, [key, ...val]) => {
        acc[key] = val.join('=');
        return acc;
    }, {});
    return cookiesDict;
  }
  
  useEffect(() => {
    //Check if not logged in and redirect.
    const cookies = getCookiesDict();
    if (cookies._auth == null) {
        navigate("/")
    }
    
  }, []);



  const handleButtonClick = (lesson) => {
    // Handle button click for a specific button

    setReadingTitle(lesson.title);
    setReadings(lesson.reading);
  };

  return (
    <Box sx={{
      background: 'repeating-radial-gradient(circle at -10% -10%, #717AA8 10px, #57618E, #3E4464 50% )',
      animation: 'animazione 13s ease-in-out infinite alternate-reverse',

      height: '100vh',
      width: '100vw',
      maxHeight: '100vh',
      overflowX: 'hidden',
      // overflow: 'hidden',
      display: 'flex', // Make it a flex container
      flexDirection: 'column', // Stack children vertically
    }}>
      <Navbar />

      <Grid container direction={isMobile ? 'column' : 'row'} spacing={1} sx={{flexGrow: 1}}>
        <Grid item xs={isMobile ? true : 3} sx={{flexGrow: 1}} height={'100%'}>
          <List
            sx={{ flexGrow: 1, width: '100%', maxWidth: isMobile ? '100%' : 360, bgcolor: '#D9D3E4',  overflowY: 'auto', height: '100%' , maxHeight: 'calc(100vh - 76px)'}}
            component="nav"

            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader disableGutters component="div" id="nested-list-subheader" bgcolor='#D9D3E4'>
                <Typography paddingTop={1} paddingBottom={1} textAlign={'center'} color={'black'} variant="h5" fontWeight={'bold'} bgcolor={'#D9D3E4'} >
                  Table of Contents
                </Typography>
              </ListSubheader>
            }
          >

            {lessonPlan.map((week, weekIndex) => (
              <div>
                <ListItemButton onClick={() => {
                  if (Object.is(weekOpen, weekIndex)) {
                    setDayOpen(-1)
                    setWeekOpen(-1);
                  } else {
                    setWeekOpen(weekIndex)
                  }
                }}>
                  <ListItemIcon>
                    <DateRangeOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary={week.week} />
                  {(weekOpen === weekIndex) ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={(weekOpen === weekIndex)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>


                    {week.days.map((day, dayIndex) => (
                      <div>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => {
                          if (Object.is(dayOpen, dayIndex)) {
                            setDayOpen(-1)
                          } else {
                            setDayOpen(dayIndex)
                          }
                        }}>
                          <ListItemIcon>
                            <BookOutlinedIcon />
                          </ListItemIcon>
                          <ListItemText primary={day.day} />
                          {(dayOpen === dayIndex) ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={(dayOpen === dayIndex)} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>


                            {day.lessons.map((lesson, buttonIndex) => (
                              <ListItemButton key={buttonIndex} sx={{ pl: 6 }} onClick={() => handleButtonClick(lesson)} >
                                <ListItemIcon>
                                  <FormatListBulletedOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={lesson.title} />
                              </ListItemButton>
                            ))}


                          </List>
                        </Collapse>
                      </div>


                    ))}
                  </List>
                </Collapse>
              </div>


            ))}
          </List>
        </Grid>

        <Grid item xs={true} >
          <Grid container direction={'column'} paddingRight={isMobile? 0 : '2%'} paddingTop={2} justifyContent={'center'} alignContent={'center'}>
            <Grid item xs >
              <Box display={'flex'} justifyContent={'center'} alignContent={'center'} >
                <Card style={{backgroundColor: '#D9D3E4'}} square={false}>
                  <CardContent>
                    <Typography textAlign={'center'} variant="h4" component="div" color={'#2d2e2e'} fontWeight={'bold'}>
                      {readingTitle}
                    </Typography>
                    <Typography fontSize={'1.4rem'} color="#3d3d3d">
                      <div dangerouslySetInnerHTML={{ __html: readings.replace(/\n/g, '<br />') }} />
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid container direction={'row'} xs spacing={2} paddingTop={1}>
              <Grid item xs textAlign={'right'} >
              <Button startIcon={<ArrowBackOutlinedIcon/>} variant="contained" color="primary" sx={{textAlign:'right'}}>
                  {t("education.back")}
                </Button>
              </Grid>
              <Grid item xs textAlign={'left'}>
              <Button endIcon={<ArrowForwardOutlinedIcon/>} variant="contained" color="primary" sx={{textAlign:'right'}}>
                  {t("education.next")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>

  );
};

export default EducationPage;
