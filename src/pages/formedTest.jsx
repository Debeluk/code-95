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
  DialogTitle
} from '@mui/material';
import { useStore } from '../store/store.js';
import { axiosInstance } from '../components/Interceptor/axiosInterceptor.js';
import { GET_TICKET_QUESTIONS, GET_RANDOM_TICKET_QUESTIONS } from '../constants/ApiURL.js';
import { useNavigate } from 'react-router-dom';

export const FormedTest = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resultsDialog, setResultsDialog] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

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
  }

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
      if (selectedQuestionTicket !== null) {
        axiosInstance
          .get(GET_TICKET_QUESTIONS(selectedCourse.id, selectedQuestionTicket))
          .then((response) => {
            setQuestions(shuffleQuestions(response.data));
          })
          .catch((error) => {
            console.error('Failed to fetch questions for the ticket:', error);
          });
      } else if (isSelectedRandomQuestions) {
        axiosInstance
          .get(GET_RANDOM_TICKET_QUESTIONS(selectedCourse.id))
          .then((response) => {
            setQuestions(shuffleQuestions(response.data));
          })
          .catch((error) => {
            console.error('Failed to fetch random questions:', error);
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
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionIndex]: answer.isCorrect ? 'correct' : 'incorrect'
    }));

    if (answer.isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }

    console.log({
      questionId: question.id,
      questionText: question.question,
      selectedAnswerId: answer.id,
      selectedAnswerText: answer.answer,
      isCorrect: answer.isCorrect,
      correctAnswers: answer.isCorrect ? correctAnswers + 1 : correctAnswers,
      incorrectAnswers: !answer.isCorrect ? incorrectAnswers + 1 : incorrectAnswers
    });

    // Automatically navigate to the next question after answering
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setCurrentQuestionIndex(questionIndex + 1);
      } else {
        setResultsDialog(true);
      }
    }, 250);
  };

  return (
    <Box sx={{ mt: 4, mb: 6, ml: 32, mr: 32 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h4" gutterBottom>
          {selectedCourse?.name}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {`${selectedQuestionTicket ? `Білет №${selectedQuestionTicket}` : 'Випадкові питання'}`}
        </Typography>
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
                backgroundColor:
                  answeredQuestions[index] === 'correct'
                    ? 'green'
                    : answeredQuestions[index] === 'incorrect'
                      ? 'red'
                      : currentQuestionIndex === index
                        ? '#4caf50'
                        : undefined
              }}>
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
          sx={{ borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom>
            {questions[currentQuestionIndex].question}
          </Typography>
          <FormControl component="fieldset" sx={{ mt: 4 }}>
            <Grid container spacing={2} justifyContent="center">
              {questions[currentQuestionIndex].answers.map((answer, idx) => (
                <Grid item xs={12} sm={4} key={idx}>
                  <Button
                    variant="contained"
                    color="inherit"
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      maxHeight: '42px',
                      backgroundColor: 'lightblue'
                    }}
                    onClick={() =>
                      handleAnswerSelect(
                        currentQuestionIndex,
                        questions[currentQuestionIndex],
                        answer
                      )
                    }
                    disabled={!!answeredQuestions[currentQuestionIndex]}>
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
            minHeight: '40px'
          }}>
          Завершити тест
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description">
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

      <Dialog
        open={resultsDialog}
        onClose={() => setResultsDialog(false)}
        aria-labelledby="results-dialog-title"
        aria-describedby="results-dialog-description">
        <DialogTitle id="results-dialog-title">Результати тесту</DialogTitle>
        <DialogContent>
          <DialogContentText id="results-dialog-description">
            Правильні відповіді: {correctAnswers}
            <br />
            Неправильні відповіді: {incorrectAnswers}
            <br />
            {incorrectAnswers >= 3 ? 'Тест не складений' : 'Тест складений'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEndTest} color="primary" variant="contained">
            Повернутися до вибору білетів
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
