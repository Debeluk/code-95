import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  CircularProgress,
  Slide,
  Collapse
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useStore } from '../store/store.js';
import { axiosInstance } from '../axiosInterceptor.js';
import { GET_TICKET_QUESTIONS, GET_RANDOM_TICKET_QUESTIONS } from '../constants/ApiURL.js';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/buttons/backButton.jsx';

// Transition component for dialog
const Transition = forwardRef((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const FormedTest = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resultsDialog, setResultsDialog] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showEndTestButton, setShowEndTestButton] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const {
    selectedCourse,
    selectedQuestionTicket,
    isSelectedRandomQuestions,
    backupLoaded,
    clearSelectedQuestionTicket
  } = useStore((state) => ({
    selectedCourse: state.selectedCourse,
    selectedQuestionTicket: state.selectedQuestionTicket,
    isSelectedRandomQuestions: state.isSelectedRandomQuestions,
    backupLoaded: state.backupLoaded,
    clearSelectedQuestionTicket: state.clearSelectedQuestionTicket
  }));

  const navigate = useNavigate();

  const shuffleQuestions = (questions) => {
    const shuffleArray = (array) => {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }

      return array;
    };

    return questions.map((question) => ({
      ...question,
      answers: shuffleArray(question.answers)
    }));
  };

  useEffect(() => {
    if (!backupLoaded) return;
    if (!selectedCourse) return;

    if (!isSelectedRandomQuestions && selectedQuestionTicket === null) {
      console.log('No questions found, No random found');
      navigate('/courses');
      return;
    }
    const fetchQuestions = () => {
      setQuestions([]);
      setLoadingQuestions(true);
      if (selectedQuestionTicket !== null) {
        axiosInstance
          .get(GET_TICKET_QUESTIONS(selectedCourse.id, selectedQuestionTicket))
          .then((response) => {
            setQuestions(shuffleQuestions(response.data));
          })
          .catch((error) => {
            console.error('Failed to fetch questions for the ticket:', error);
          })
          .finally(() => {
            setLoadingQuestions(false);
          });
      } else if (isSelectedRandomQuestions) {
        axiosInstance
          .get(GET_RANDOM_TICKET_QUESTIONS(selectedCourse.id))
          .then((response) => {
            setQuestions(shuffleQuestions(response.data));
          })
          .catch((error) => {
            console.error('Failed to fetch random questions:', error);
          })
          .finally(() => {
            setLoadingQuestions(false);
          });
      }
    };

    fetchQuestions();
  }, [selectedQuestionTicket, isSelectedRandomQuestions, selectedCourse, backupLoaded, navigate]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEndTest = () => {
    console.log('Тест завершен');
    clearSelectedQuestionTicket();
    navigate('/tickets');
    setOpenDialog(false);
    setResultsDialog(false);
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswerSelect = (questionIndex, question, answer) => {
    const updatedAnswers = {
      ...answeredQuestions,
      [questionIndex]: answer.isCorrect ? 'correct' : 'incorrect',
      [`selected-${questionIndex}`]: answer.id
    };

    if (!answer.isCorrect) {
      question.answers.forEach((ans) => {
        if (ans.isCorrect) {
          updatedAnswers[`correct-${questionIndex}`] = ans.id;
        }
      });
    }

    setAnsweredQuestions(updatedAnswers);

    if (answer.isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }

    if (
      Object.keys(updatedAnswers).filter((key) => key.includes('selected-')).length ===
      questions.length
    ) {
      setResultsDialog(true);
    }
  };

  const getButtonColor = (questionIndex, answer) => {
    if (!answeredQuestions[questionIndex]) return 'white';
    if (answeredQuestions[questionIndex] === 'correct' && answer.isCorrect) return '#71B378';
    if (answeredQuestions[questionIndex] === 'incorrect') {
      if (answer.isCorrect) return '#71B378';
      if (answer.id === answeredQuestions[`selected-${questionIndex}`]) return '#CC4E5C';
    }
    return 'white';
  };

  const handleReviewQuestions = () => {
    setResultsDialog(false);
    setShowBackButton(true);
    setShowEndTestButton(false); // Hide "Завершити тест" button
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '70vh',
        backgroundColor: '#f5f5f5',
        paddingTop: 2,
        display: 'flex',
        justifyContent: 'center'
      }}>
      <Box sx={{ marginLeft: 20, marginRight: 20 }}>
        {showBackButton && (
          <Box sx={{ marginBottom: 2 }}>
            <BackButton />
          </Box>
        )}
        <Box
          sx={{
            marginTop: 2,
            marginBottom: 6,
            fontSize: '0.875rem',
            display: 'flex',
            justifyContent: 'center',
            width: '1220px'
          }}>
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              padding: 4,
              marginBottom: 4,
              borderRadius: 2,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
            {loadingQuestions ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '50vh'
                }}>
                <CircularProgress sx={{ color: '#000000' }} />
              </Box>
            ) : (
              <>
                <Box display="flex" justifyContent="space-between" marginBottom={1}>
                  <Typography variant="h6" gutterBottom>
                    {selectedCourse?.name}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {`${selectedQuestionTicket ? `Білет №${selectedQuestionTicket}` : 'Випадкові питання'}`}
                  </Typography>
                </Box>

                <Grid container spacing={1} marginBottom={4} className="question-grid">
                  {questions.map((_, index) => (
                    <Grid item xs="auto" key={index}>
                      <Button
                        variant="outlined"
                        onClick={() => handleQuestionSelect(index)}
                        sx={{
                          minWidth: '38px',
                          minHeight: '38px',
                          borderRadius: '8px',
                          textTransform: 'none',
                          padding: '0',
                          color:
                            answeredQuestions[index] === 'correct'
                              ? 'green'
                              : answeredQuestions[index] === 'incorrect'
                                ? 'red'
                                : currentQuestionIndex === index
                                  ? 'black'
                                  : '#ccc',
                          borderColor:
                            answeredQuestions[index] === 'correct'
                              ? 'green'
                              : answeredQuestions[index] === 'incorrect'
                                ? 'red'
                                : currentQuestionIndex === index
                                  ? 'black'
                                  : '#ccc',
                          backgroundColor: 'white',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: 'black',
                            borderColor: 'black',
                            backgroundColor: 'white' // Устанавливаем белый цвет фона при наведении
                          }
                        }}>
                        {index + 1}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                {questions.length > 0 && (
                  <>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        maxHeight: '600px',
                        marginBottom: '20px',
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        boxShadow: 0
                      }}>
                      <Grid item md={4}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center">
                          <Typography variant="h6" gutterBottom sx={{ lineHeight: 1.25 }}>
                            {questions[currentQuestionIndex].question}
                          </Typography>

                          {questions[currentQuestionIndex].image && (
                            <Box
                              component="img"
                              sx={{
                                maxHeight: 400,
                                maxWidth: 400
                              }}
                              alt="Question Image"
                              src={questions[currentQuestionIndex].image}
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item md={8}>
                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                          <Grid container spacing={2} direction="column" sx={{ height: '100%' }}>
                            {questions[currentQuestionIndex].answers.map((answer, idx) => (
                              <Grid item key={idx} sx={{ width: '100%' }}>
                                <Button
                                  color="inherit"
                                  fullWidth
                                  sx={{
                                    textTransform: 'none',
                                    height: '75px',
                                    fontSize: '1rem',
                                    backgroundColor: `${getButtonColor(currentQuestionIndex, answer)}99`,
                                    lineHeight: '1',
                                    borderTop: '2px solid #ccc',
                                    borderBottom: '2px solid #ccc',
                                    borderRadius: '0',
                                    boxShadow: 'none',
                                    transition: 'all 0.3s ease',
                                    pointerEvents: answeredQuestions[currentQuestionIndex]
                                      ? 'none'
                                      : 'auto',
                                    '&:hover': {
                                      backgroundColor: '#f5f5f5',
                                      boxShadow: 'none'
                                    },
                                    margin: 0
                                  }}
                                  onClick={() =>
                                    handleAnswerSelect(
                                      currentQuestionIndex,
                                      questions[currentQuestionIndex],
                                      answer
                                    )
                                  }>
                                  {answer.answer}
                                </Button>
                              </Grid>
                            ))}
                          </Grid>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Collapse in={!!answeredQuestions[currentQuestionIndex]}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'black',
                          marginTop: 2,
                          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
                          padding: 2,
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          transition: 'max-height 0.5s ease',
                          border: '1px solid black' // Черный бордер для области подсказки
                        }}>
                        {questions[currentQuestionIndex].hint}
                      </Typography>
                    </Collapse>
                    <Box display="flex" justifyContent="space-between" marginTop={2}>
                      <Button
                        variant="contained"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        sx={{
                          borderRadius: '16px',
                          textTransform: 'none',
                          minWidth: '120px',
                          minHeight: '40px',
                          color: 'black',
                          backgroundColor: 'white',
                          borderColor: 'black',
                          border: '1px solid black',
                          transition: 'all 0.3s ease',
                          pointerEvents: currentQuestionIndex === 0 ? 'none' : 'auto',
                          '&.Mui-disabled': {
                            opacity: 1,
                            color: 'black',
                            borderColor: 'black'
                          },
                          '&:hover': {
                            color: 'white',
                            backgroundColor: 'black',
                            borderColor: 'black'
                          }
                        }}>
                        <ArrowBackIcon />
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        sx={{
                          borderRadius: '16px',
                          textTransform: 'none',
                          minWidth: '120px',
                          minHeight: '40px',
                          color: 'black',
                          backgroundColor: 'white',
                          borderColor: 'black',
                          border: '1px solid black',
                          transition: 'all 0.3s ease',
                          pointerEvents:
                            currentQuestionIndex === questions.length - 1 ? 'none' : 'auto',
                          '&.Mui-disabled': {
                            opacity: 1,
                            color: 'black',
                            borderColor: 'black'
                          },
                          '&:hover': {
                            color: 'white',
                            backgroundColor: 'black',
                            borderColor: 'black'
                          }
                        }}>
                        <ArrowForwardIcon />
                      </Button>
                    </Box>
                  </>
                )}

                {showEndTestButton && (
                  <Box display="flex" justifyContent="center" marginTop={4}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleOpenDialog}
                      sx={{
                        borderRadius: '16px',
                        textTransform: 'none',
                        minWidth: '120px',
                        minHeight: '40px'
                      }}>
                      Завершити тест
                    </Button>
                  </Box>
                )}
              </>
            )}

            <Dialog
              open={openDialog}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleCloseDialog}
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-description"
              fullWidth
              sx={{ maxWidth: '460px', margin: 'auto' }}>
              <DialogTitle id="confirm-dialog-title">Підтвердити завершення тесту</DialogTitle>
              <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                  Ви впевнені, що хочете завершити тест? Результати тесту не будуть збережені
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button
                  onClick={handleCloseDialog}
                  color="primary"
                  sx={{ minWidth: '170px', border: '1px solid lightblue', marginBottom: '8px' }}>
                  Скасувати
                </Button>
                <Button
                  onClick={handleEndTest}
                  color="error"
                  variant="contained"
                  sx={{ minWidth: '170px', marginBottom: '8px' }}>
                  Завершити тест
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={resultsDialog}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setResultsDialog(false)}
              aria-labelledby="results-dialog-title"
              aria-describedby="results-dialog-description"
              sx={{ maxWidth: '620px', margin: 'auto' }}
              fullWidth>
              <DialogTitle id="results-dialog-title">Результати тесту</DialogTitle>
              <DialogContent>
                <DialogContentText id="results-dialog-description">
                  Правильні відповіді: {correctAnswers}
                  <br />
                  Неправильні відповіді: {incorrectAnswers}
                  <br />
                  <Typography component="span" fontWeight="bold" fontSize={20} color="black">
                    {incorrectAnswers >= 3 ? 'Тест не складений' : 'Тест складений'}
                  </Typography>
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center', gap: '50px' }}>
                <Button
                  onClick={handleReviewQuestions}
                  color="primary"
                  sx={{ maxWidth: '220px', border: '1px solid lightblue', marginBottom: '8px' }}>
                  Переглянути запитання
                </Button>
                <Button
                  onClick={handleEndTest}
                  color="primary"
                  variant="contained"
                  sx={{ maxWidth: '240px', marginBottom: '8px' }}>
                  Повернутися до вибору
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
