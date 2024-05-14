import React, {useState, useEffect} from 'react';
import {Box, Typography, Grid, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useStore} from "../store/store.js";
import axios from 'axios';
import {GET_TICKET_QUESTIONS, GET_RANDOM_TICKET_QUESTIONS} from '../constants/ApiURL';
import secureLocalStorage from 'react-secure-storage';

export const TicketsPage = () => {
    const navigate = useNavigate();
    const [ticketNumbers, setTicketNumbers] = useState([]);
    const [courseName, setCourseName] = useState('');
    const {
        selectedCourse,
        backupLoaded,
        setTicket,
        selectRandomQuestions,
        setQuestions,
        resetQuestions,
        isSelectedRandomQuestions,
        selectedQuestionTicket
    } = useStore(state => ({
        selectedCourse: state.selectedCourse,
        backupLoaded: state.backupLoaded,
        setTicket: state.setQuestionTicket,
        selectRandomQuestions: state.selectRandomQuestions,
        setQuestions: state.setQuestions,
        resetQuestions: state.resetQuestions,
        isSelectedRandomQuestions: state.isSelectedRandomQuestions,
        selectedQuestionTicket: state.selectedQuestionTicket,
    }));

    useEffect(() => {
        if (!backupLoaded) return;
        setCourseName(selectedCourse.name);
        setTicketNumbers(Array.from({length: selectedCourse.tickets}, (_, i) => i + 1));
    }, [backupLoaded, selectedCourse]);

    const handleTicketSelection = async (ticketNumber) => {
        resetQuestions();
        setTicket(ticketNumber);
        try {
            const response = await axios.get(GET_TICKET_QUESTIONS(selectedCourse.id, ticketNumber), {
                headers: {
                    Authorization: `Bearer ${secureLocalStorage.getItem('accessToken')}`
                }
            });
            setQuestions(response.data);
            navigate('/test');
        } catch (error) {
            console.error('Failed to fetch questions for the ticket:', error);
        }
    };

    const handleRandomTicket = () => {
        if (ticketNumbers.length > 0) {
            const randomIndex = Math.floor(Math.random() * ticketNumbers.length);
            const randomTicket = ticketNumbers[randomIndex];
            handleTicketSelection(randomTicket);
        }
    };

    const handleRandomQuestions = async () => {
        resetQuestions();
        selectRandomQuestions(true);
        setTicket(null);  // Сбрасываем выбранный билет
        try {
            const response = await axios.get(GET_RANDOM_TICKET_QUESTIONS(selectedCourse.id), {
                headers: {
                    Authorization: `Bearer ${secureLocalStorage.getItem('accessToken')}`
                }
            });
            setQuestions(response.data);
            navigate('/test');
        } catch (error) {
            console.error('Failed to fetch random questions:', error);
        }
    };

    useEffect(() => {
        if (!isSelectedRandomQuestions && selectedQuestionTicket === null) {
            navigate('/course');
        }
    }, [isSelectedRandomQuestions, selectedQuestionTicket, navigate]);

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
                        onClick={handleRandomQuestions}
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
