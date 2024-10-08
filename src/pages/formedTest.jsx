import React, { useState, useEffect } from 'react';
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
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useStore } from '../store/store.js';
import { axiosInstance } from '../axiosInterceptor.js';
import { GET_TICKET_QUESTIONS, GET_RANDOM_TICKET_QUESTIONS } from '../constants/ApiURL.js';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/buttons/backButton.jsx';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const FormedTest = () => {
  const customTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 0,
        md: 1280,
        lg: 1440,
        xl: 1920
      }
    }
  });

  const dialogTheme = createTheme({});
  const isMdDown = useMediaQuery(customTheme.breakpoints.down('md'));
  const isMdUp = useMediaQuery(customTheme.breakpoints.up('md'));
  const [showQuestionNumbers, setShowQuestionNumbers] = useState(false);

  const AnswerButton = ({ onClick, backgroundColor, children, selected, disabled }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          minHeight: '75px',
          fontSize: '1rem',
          backgroundColor,
          lineHeight: '1',
          borderTop: '2px solid #ccc',
          borderBottom: '2px solid #ccc',
          borderLeft: 'none',
          borderRight: 'none',
          borderRadius: '0',
          boxShadow: 'none',
          transition: 'background-color 0.3s ease',
          pointerEvents: disabled ? 'none' : 'auto',
          cursor: disabled ? 'default' : 'pointer',
          margin: 0,
          color: 'black',
          textAlign: isMdUp ? 'left' : 'center',
          paddingLeft: isMdUp ? '16px' : '0',
          position: 'relative'
        }}>
        <span
          style={{
            minWidth: '20px',
            width: '20px',
            height: '20px',
            border: '1px solid black',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '8px',
            position: 'relative',
            paddingLeft: '4px',
          }}>
          {selected && (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'black',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
        </span>
        {children}
      </button>
    );
  };

  const [block] = useAutoAnimate();
  const [openDialog, setOpenDialog] = useState(false);
  const [resultsDialog, setResultsDialog] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showEndTestButton, setShowEndTestButton] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [userChoice, setUserChoice] = useState({});
  const [testFailed, setTestFailed] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const {
    selectedCourse,
    selectedQuestionTicket,
    isSelectedRandomQuestions,
    backupLoaded,
    clearSelectedQuestionTicket,
    examOn
  } = useStore((state) => ({
    selectedCourse: state.selectedCourse,
    selectedQuestionTicket: state.selectedQuestionTicket,
    isSelectedRandomQuestions: state.isSelectedRandomQuestions,
    backupLoaded: state.backupLoaded,
    clearSelectedQuestionTicket: state.clearSelectedQuestionTicket,
    examOn: state.examOn
  }));

  const navigate = useNavigate();

  useEffect(() => {
    if (!backupLoaded) return;

    if (!selectedCourse || (!isSelectedRandomQuestions && selectedQuestionTicket === null)) {
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
            setQuestions(response.data);
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
            setQuestions(response.data);
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

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        'Ваш прогрес буде втрачено. Ви впевнені, що хочете перезавантажити сторінку?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEndTest = () => {
    clearSelectedQuestionTicket();
    navigate('/tickets');
    setOpenDialog(false);
    setResultsDialog(false);
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswerSelect = (questionIndex, question, answer) => {
    if (answeredQuestions[questionIndex] !== undefined || testFailed) return;

    setAnsweredQuestions((prevState) => ({
      ...prevState,
      [questionIndex]: answer.isCorrect
    }));
    setUserChoice((prev) => ({
      ...prev,
      [questionIndex]: answer.id
    }));

    setHasAnswered(true);
  };

  useEffect(() => {
    const incorrectAnswersCount =
      Object.values(answeredQuestions).length -
      Object.values(answeredQuestions).reduce((partialSum, a) => partialSum + a, 0);

    if (examOn && incorrectAnswersCount >= (selectedCourse?.maxMistakes ?? 3)) {
      setTestFailed(true);
      setResultsDialog(true);
    } else if (hasAnswered && Object.keys(answeredQuestions).length === questions.length) {
      setResultsDialog(true);
    }
  }, [answeredQuestions, examOn, questions.length, hasAnswered]);

  const getButtonColor = (questionIndex, answer) => {
    if (answeredQuestions[questionIndex] === undefined) return '#FFF';
    if (answeredQuestions[questionIndex] && userChoice[questionIndex] === answer.id) {
      return '#6BC06B';
    } else {
      if (answer.isCorrect) return '#6BC06B';
      if (answer.id === userChoice[questionIndex]) return '#d32f2f';
    }
    return '#FFF';
  };

  const handleReviewQuestions = () => {
    setShowBackButton(true);
    setShowEndTestButton(true);
    setResultsDialog(false);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex < questions.length ? newIndex : prevIndex;
    });
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex >= 0 ? newIndex : prevIndex;
    });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          overflowX: 'hidden',
          minHeight: '70vh',
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
              width: '100%',
              maxWidth: '1220px',
              minWidth: '400px'
            }}
            ref={block}>
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                padding: 4,
                marginBottom: 4,
                borderRadius: 2,
                marginLeft: '16px',
                marginRight: '16px',
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

                  {isMdDown ? (
                    <Box textAlign="center" marginBottom={2}>
                      <Button
                        variant="contained"
                        onClick={() => setShowQuestionNumbers(!showQuestionNumbers)}
                        sx={{
                          textTransform: 'none',
                          backgroundColor: 'white',
                          color: 'black',
                          '&:hover': {
                            backgroundColor: 'white',
                            borderColor: 'black',
                            boxShadow: 'none'
                          },
                          boxShadow: 'none',
                          border: '1px solid black'
                        }}>
                        Показати питання
                      </Button>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {showQuestionNumbers && (
                          <Grid
                            container
                            spacing={1}
                            marginTop={2}
                            gap={'4px'}
                            padding={0}
                            maxWidth={'290px'}
                            marginLeft={0}
                            className="question-grid">
                            {questions.map((_, index) => (
                              <Grid item key={index} className={"questionNumbers"}>
                                <Button
                                  variant="outlined"
                                  onClick={() => handleQuestionSelect(index)}
                                  sx={{
                                    minWidth: '38px',
                                    minHeight: '38px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    padding: '0px',
                                    color:
                                      answeredQuestions[index] === true
                                        ? 'green'
                                        : answeredQuestions[index] === false
                                          ? 'red'
                                          : currentQuestionIndex === index
                                            ? 'black'
                                            : '#ccc',
                                    borderColor:
                                      answeredQuestions[index] === true
                                        ? 'green'
                                        : answeredQuestions[index] === false
                                          ? 'red'
                                          : currentQuestionIndex === index
                                            ? 'black'
                                            : '#ccc',
                                    backgroundColor: 'white',
                                    '&:hover': {
                                      color: 'black',
                                      borderColor: 'black',
                                      backgroundColor: 'white'
                                    }
                                  }}>
                                  {index + 1}
                                </Button>
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Grid
                      container
                      spacing={1}
                      marginBottom={4}
                      justifyContent="center"
                      className="question-grid">
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
                                answeredQuestions[index] === true
                                  ? 'green'
                                  : answeredQuestions[index] === false
                                    ? 'red'
                                    : currentQuestionIndex === index
                                      ? 'black'
                                      : '#ccc',
                              borderColor:
                                answeredQuestions[index] === true
                                  ? 'green'
                                  : answeredQuestions[index] === false
                                    ? 'red'
                                    : currentQuestionIndex === index
                                      ? 'black'
                                      : '#ccc',
                              backgroundColor: 'white',
                              '&:hover': {
                                color: 'black',
                                borderColor: 'black',
                                backgroundColor: 'white'
                              }
                            }}>
                            {index + 1}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {questions.length > 0 && (
                    <>
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          maxHeight: '800px',
                          marginBottom: '20px',
                          borderRadius: '12px',
                          backgroundColor: 'transparent',
                          boxShadow: 0,
                          ...(isMdDown && {
                            flexDirection: 'column',
                            alignItems: 'center'
                          })
                        }}>
                        <Grid
                          item
                          xs={12}
                          sx={{
                            textAlign: isMdUp ? 'left' : 'center',
                            ...(isMdDown && {
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column'
                            })
                          }}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems={isMdUp ? 'flex-start' : 'center'}
                            ref={block}>
                            <Typography variant="h6" gutterBottom sx={{ lineHeight: 1.25 }}>
                              {questions[currentQuestionIndex].question}
                            </Typography>
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: isMdUp ? 'flex-start' : 'center'
                              }}>
                              {questions[currentQuestionIndex]?.image && (
                                <Box
                                  component="img"
                                  sx={{
                                    maxWidth: 300
                                  }}
                                  alt="Question Image"
                                  src={questions[currentQuestionIndex]?.image}
                                />
                              )}
                            </div>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sx={{
                            textAlign: isMdUp ? 'left' : 'center',
                            ...(isMdDown && {
                              width: '100%'
                            })
                          }}>
                          <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <Grid container spacing={2} direction="column" sx={{ height: '100%' }}>
                              {questions[currentQuestionIndex].answers.map((answer, idx) => (
                                <Grid item key={idx} sx={{ width: '100%' }}>
                                  <AnswerButton
                                    onClick={() =>
                                      handleAnswerSelect(
                                        currentQuestionIndex,
                                        questions[currentQuestionIndex],
                                        answer
                                      )
                                    }
                                    backgroundColor={getButtonColor(currentQuestionIndex, answer)}
                                    disabled={
                                      answeredQuestions[currentQuestionIndex] === true ||
                                      answeredQuestions[currentQuestionIndex] === false ||
                                      testFailed
                                    }
                                    selected={userChoice[currentQuestionIndex] === answer?.id}>
                                    {answer.answer}
                                  </AnswerButton>
                                </Grid>
                              ))}
                            </Grid>
                          </FormControl>
                        </Grid>
                      </Grid>
                      {answeredQuestions[currentQuestionIndex] !== undefined &&
                        questions[currentQuestionIndex].hint && (
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
                              border: '1px solid black',
                              textAlign: isMdUp ? 'left' : 'center',
                              ...(isMdDown && {
                                marginTop: 2,
                                padding: 1,
                                fontSize: '0.875rem'
                              })
                            }}>
                            {questions[currentQuestionIndex]?.hint}
                          </Typography>
                        )}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        marginTop={2}
                        sx={{
                          ...(isMdDown && {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%'
                          })
                        }}>
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
                            '&.Mui-disabled': {
                              opacity: 1,
                              color: 'black',
                              borderColor: 'black',
                              '&:hover': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderColor: 'black'
                              },
                              '&:focus': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderColor: 'black'
                              }
                            },
                            '&:hover': {
                              color: 'white',
                              backgroundColor: 'black',
                              borderColor: 'black'
                            },
                            '&:focus': {
                              outline: 'none',
                              boxShadow: 'none'
                            },
                            '&:focus-visible': {
                              outline: 'none',
                              boxShadow: 'none'
                            },
                            '&:active': {
                              outline: 'none',
                              boxShadow: 'none',
                              backgroundColor: 'black',
                              color: 'white',
                              borderColor: 'black'
                            },
                            '@media (hover: none)': {
                              '&:hover': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderColor: 'black'
                              },
                              '&:active': {
                                backgroundColor: 'black',
                                color: 'white',
                                borderColor: 'black'
                              }
                            },
                            ...(isMdDown && {
                              minWidth: '100px',
                              minHeight: '30px',
                              fontSize: '0.875rem'
                            })
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
                            '&.Mui-disabled': {
                              opacity: 1,
                              color: 'black',
                              borderColor: 'black',
                              '&:hover': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderColor: 'black'
                              },
                              '&:focus': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderColor: 'black'
                              }
                            },
                            '&:hover': {
                              color: 'white',
                              backgroundColor: 'black',
                              borderColor: 'black'
                            },
                            '&:focus': {
                              outline: 'none',
                              boxShadow: 'none'
                            },
                            '&:focus-visible': {
                              outline: 'none',
                              boxShadow: 'none'
                            },
                            '&:active': {
                              outline: 'none',
                              boxShadow: 'none',
                              backgroundColor: 'black',
                              color: 'white',
                              borderColor: 'black'
                            },
                            '@media (hover: none)': {
                              '&:hover': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderColor: 'black'
                              },
                              '&:active': {
                                backgroundColor: 'black',
                                color: 'white',
                                borderColor: 'black'
                              }
                            },
                            ...(isMdDown && {
                              minWidth: '100px',
                              minHeight: '30px',
                              fontSize: '0.875rem'
                            })
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
                          minHeight: '40px',
                          ...(isMdDown && {
                            minWidth: '100px',
                            minHeight: '30px',
                            fontSize: '0.875rem'
                          })
                        }}>
                        Завершити тест
                      </Button>
                    </Box>
                  )}
                </>
              )}

              <ThemeProvider theme={dialogTheme}>
                <Dialog
                  open={openDialog}
                  keepMounted
                  onClose={handleCloseDialog}
                  aria-labelledby="confirm-dialog-title"
                  aria-describedby="confirm-dialog-description"
                  fullWidth
                  sx={{
                    maxWidth: '460px',
                    margin: 'auto',
                    '& .MuiDialog-paper': {
                      borderRadius: '16px',
                      minWidth: '370px'
                    }
                  }}
                  ref={block}>
                  <DialogTitle id="confirm-dialog-title">Підтвердити завершення тесту</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                      Ви впевнені, що хочете завершити тест? Результати тесту не будуть збережені
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{ justifyContent: 'center', gap: '6px' }}>
                    <Button
                      onClick={handleCloseDialog}
                      sx={{
                        minWidth: '170px',
                        border: '1px solid black',
                        marginBottom: '8px',
                        color: 'black',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: 'white'
                        },
                        '&:focus': {
                          backgroundColor: 'white'
                        }
                      }}>
                      Скасувати
                    </Button>
                    <Button
                      onClick={handleEndTest}
                      color="error"
                      variant="contained"
                      sx={{
                        minWidth: '170px',
                        marginBottom: '8px',
                        color: '#d32f2f',
                        backgroundColor: 'white',
                        border: '1px solid #d32f2f',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: 'white'
                        },
                        '&:focus': {
                          backgroundColor: 'white'
                        }
                      }}>
                      Завершити тест
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={resultsDialog}
                  ref={block}
                  keepMounted
                  onClose={() => setResultsDialog(false)}
                  aria-labelledby="results-dialog-title"
                  aria-describedby="results-dialog-description"
                  sx={{
                    maxWidth: '590px',
                    margin: 'auto',
                    '& .MuiDialog-paper': {
                      borderRadius: '16px',
                      minWidth: '370px'
                    }
                  }}
                  fullWidth>
                  <DialogTitle id="results-dialog-title">Результати тесту</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="results-dialog-description">
                      {`Правильні відповіді: ${Object.values(answeredQuestions).reduce((partialSum, a) => partialSum + a, 0)}`}
                      <br />
                      {`Неправильні відповіді: ${Object.values(answeredQuestions).length - Object.values(answeredQuestions).reduce((partialSum, a) => partialSum + a, 0)}`}
                      <br />
                      <Typography component="span" fontWeight="bold" fontSize={20} color="black">
                        {Object.values(answeredQuestions).length -
                          Object.values(answeredQuestions).reduce(
                            (partialSum, a) => partialSum + a,
                            0
                          ) >=
                        3
                          ? 'Тест не складений'
                          : 'Тест складений'}
                      </Typography>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{ justifyContent: 'center', gap: '20px' }}>
                    <Button
                      onClick={handleReviewQuestions}
                      sx={{
                        maxWidth: '220px',
                        border: '1px solid black',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        color: 'black',
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: 'white'
                        },
                        '&:focus': {
                          backgroundColor: 'white'
                        }
                      }}>
                      Переглянути запитання
                    </Button>
                    <Button
                      onClick={handleEndTest}
                      color="primary"
                      variant="contained"
                      sx={{
                        maxWidth: '240px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        color: 'blue',
                        backgroundColor: 'white',
                        border: '1px solid blue',
                        '&:hover': {
                          backgroundColor: 'white'
                        },
                        '&:focus': {
                          backgroundColor: 'white'
                        }
                      }}>
                      Повернутися до вибору
                    </Button>
                  </DialogActions>
                </Dialog>
              </ThemeProvider>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
