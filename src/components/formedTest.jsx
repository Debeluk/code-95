import React, {useState, useEffect} from 'react';
import {
    Box, Typography, Grid, Button, FormControl, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle
} from '@mui/material';
import {useStore} from "../store/store.js";
import axios from 'axios';
import {GET_TICKET_QUESTIONS, GET_RANDOM_TICKET_QUESTIONS} from '../constants/ApiURL';
import secureLocalStorage from 'react-secure-storage';
import {useNavigate} from 'react-router-dom';

export const FormedTest = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const {
        selectedCourse,
        selectedQuestionTicket,
        isSelectedRandomQuestions,
        questions,
        setQuestions,
        resetQuestions,
        backupLoaded
    } = useStore(state => ({
        selectedCourse: state.selectedCourse,
        selectedQuestionTicket: state.selectedQuestionTicket,
        isSelectedRandomQuestions: state.isSelectedRandomQuestions,
        questions: state.questions,
        setQuestions: state.setQuestions,
        resetQuestions: state.resetQuestions,
        backupLoaded: state.backupLoaded,
    }));
    const navigate = useNavigate();

    useEffect(() => {
        if (!backupLoaded) {
            navigate('/course');  // Перенаправление, если данные не загружены
            return;
        }

        const fetchQuestions = async () => {
            resetQuestions(); // Очищаем состояние вопросов при монтировании компонента
            if (selectedQuestionTicket !== null) {
                try {
                    const response = await axios.get(GET_TICKET_QUESTIONS(selectedCourse.id, selectedQuestionTicket), {
                        headers: {
                            Authorization: `Bearer ${secureLocalStorage.getItem('accessToken')}`
                        }
                    });
                    setQuestions(response.data);
                } catch (error) {
                    console.error('Failed to fetch questions for the ticket:', error);
                }
            } else if (isSelectedRandomQuestions) {
                try {
                    const response = await axios.get(GET_RANDOM_TICKET_QUESTIONS(selectedCourse.id), {
                        headers: {
                            Authorization: `Bearer ${secureLocalStorage.getItem('accessToken')}`
                        }
                    });
                    setQuestions(response.data);
                } catch (error) {
                    console.error('Failed to fetch random questions:', error);
                }
            }
        };

        fetchQuestions();
    }, [selectedQuestionTicket, isSelectedRandomQuestions, selectedCourse, setQuestions, resetQuestions, backupLoaded, navigate]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleEndTest = () => {
        console.log('Тест завершен');
        setOpenDialog(false);
    };

    const handleQuestionSelect = (index) => {
        setCurrentQuestionIndex(index);
    };

    return (
        <Box sx={{mt: 4, mb: 6, ml: 32, mr: 32}}>
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="h4" gutterBottom>{selectedCourse.name}</Typography>
                <Typography variant="h5" gutterBottom>Білет
                    № {selectedQuestionTicket ?? 'Випадкові питання'}</Typography>
            </Box>

            <Grid container spacing={1} mb={2}>
                {questions.map((_, index) => (
                    <Grid item xs="auto" key={index}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleQuestionSelect(index)}
                            sx={{
                                minWidth: '38px',
                                minHeight: '38px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                padding: '0',
                                backgroundColor: currentQuestionIndex === index ? '#4caf50' : undefined
                            }}
                        >
                            {index + 1}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            {questions.length > 0 && (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    minHeight="200px"
                    maxHeight="400px"
                    marginBottom="20px"
                    p={4}
                    sx={{borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: 2}}
                >
                    <Typography variant="h6" gutterBottom>{questions[currentQuestionIndex].question}</Typography>
                    <FormControl component="fieldset" sx={{mt: 4}}>
                        <Grid container spacing={2} justifyContent="center">
                            {questions[currentQuestionIndex].answers.map((answer, idx) => (
                                <Grid item xs={12} sm={4} key={idx}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{textTransform: 'none', maxHeight: '42px'}}
                                    >
                                        {answer.answer}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </FormControl>
                </Box>
            )}

            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleOpenDialog}
                    sx={{
                        borderRadius: '16px',
                        textTransform: 'none',
                        minWidth: '120px',
                        minHeight: '40px',
                    }}
                >
                    Завершити тест
                </Button>
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Підтвердити завершення тесту</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Ви впевнені, що хочете завершити тест?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Відміна
                    </Button>
                    <Button onClick={handleEndTest} color="error" variant="contained">
                        Завершити тест
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
