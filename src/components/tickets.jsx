import React, {useState, useEffect} from 'react';
import {Box, Typography, Grid, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import {GetQuestionsFromTicket} from "./req/axios.jsx";

export const TicketsPage = () => {
    const navigate = useNavigate();
    const [ticketNumbers, setTicketNumbers] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [chosenCourseId, setChosenCourseId] = useState('');

    useEffect(() => {
        const storedChosenCourseId = parseInt(secureLocalStorage.getItem('chosenCourseId'), 10);
        setChosenCourseId(storedChosenCourseId);
        const courses = secureLocalStorage.getItem('courses') ? JSON.parse(secureLocalStorage.getItem('courses')) : [];
        const chosenCourse = courses.find(course => course.id === storedChosenCourseId);

        if (chosenCourse) {
            setCourseName(chosenCourse.name);
            setTicketNumbers(Array.from({length: chosenCourse.tickets}, (_, i) => i + 1));
        }
    }, []);

    const handleTicketSelection = (ticketNumber) => {
        secureLocalStorage.removeItem('chosenTicket');
        secureLocalStorage.removeItem('ticketQuestions');
        GetQuestionsFromTicket(chosenCourseId, ticketNumber);
        secureLocalStorage.setItem('chosenTicket', ticketNumber.toString());
        navigate('/test');
    };

    const handleRandomTicket = () => {
        if (ticketNumbers.length > 0) {
            const randomIndex = Math.floor(Math.random() * ticketNumbers.length);
            const randomTicket = ticketNumbers[randomIndex];
            handleTicketSelection(randomTicket);
        }
    };

    return (
        <Box sx={{pb: 50, mt: 4, mb: 6, ml: 32, mr: 32}}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" gutterBottom>
                    {courseName}
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Білети
                </Typography>
            </Box>

            <Grid container spacing={2} justifyContent="center" mb={4}>
                {ticketNumbers.map((number) => (
                    <Grid item key={number}>
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={() => handleTicketSelection(number)}
                            sx={{
                                minWidth: '40px',
                                minHeight: '40px',
                                borderRadius: '8px',
                                textTransform: 'none',
                            }}
                        >
                            {number}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            <Grid container justifyContent="center" mb={4}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={handleRandomTicket}
                        sx={{
                            minWidth: '270px',
                            minHeight: '50px',
                            borderRadius: '16px',
                            textTransform: 'none',
                            mr: 2,
                        }}
                    >
                        Випадковий білет
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="inherit"
                        sx={{
                            minWidth: '270px',
                            minHeight: '50px',
                            borderRadius: '16px',
                            textTransform: 'none',
                        }}
                    >
                        Випадкові питання
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
