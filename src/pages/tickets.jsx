import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.js';
import BackButton from '../components/buttons/backButton.jsx';

export const TicketsPage = () => {
  const navigate = useNavigate();
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [courseName, setCourseName] = useState('');
  const { selectedCourse, backupLoaded, setTicket, selectRandomQuestions } = useStore((state) => ({
    selectedCourse: state.selectedCourse,
    backupLoaded: state.backupLoaded,
    setTicket: state.setQuestionTicket,
    selectRandomQuestions: state.selectRandomQuestions
  }));

  useEffect(() => {
    if (!backupLoaded || !selectedCourse) return;
    setCourseName(selectedCourse.name);
    setTicketNumbers(Array.from({ length: selectedCourse.tickets }, (_, i) => i + 1));
  }, [backupLoaded, selectedCourse]);

  const handleTicketSelection = (ticketNumber) => {
    setTicket(ticketNumber);
    selectRandomQuestions(null);
    navigate('/test');
  };

  const handleRandomTicket = () => {
    if (ticketNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * ticketNumbers.length);
      const randomTicket = ticketNumbers[randomIndex];
      handleTicketSelection(randomTicket);
    }
  };

  const handleRandomQuestions = () => {
    selectRandomQuestions(true);
    setTicket(null);
    navigate('/test');
  };

  return (
    <Box
      sx={{
        height: '70vh', // Установлено 70vh для основного Box элемента
        paddingBottom: 50,
        marginTop: 4,
        marginBottom: 6,
        marginLeft: 32,
        marginRight: 32
      }}>
      <Box
        sx={{
          marginBottom: 4,
          display: 'flex',
          justifyContent: 'flex-start',
          backgroundColor: 'transparent'
        }}>
        <BackButton sx={{ marginRight: 2 }} /> {/* Кнопка "Назад" */}
      </Box>

      <Box textAlign="center" marginBottom={4}>
        <Typography variant="h5" gutterBottom>
          {courseName}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Білети
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center" marginBottom={4}>
        {ticketNumbers.map((number) => (
          <Grid item key={number}>
            <Button
              variant="contained"
              onClick={() => handleTicketSelection(number)}
              sx={{
                minWidth: '40px',
                minHeight: '40px',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: 'white',
                color: 'black',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              }}>
              {number}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Grid container justifyContent="center" marginBottom={4}>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleRandomTicket}
            sx={{
              minWidth: '270px',
              minHeight: '50px',
              borderRadius: '16px',
              textTransform: 'none',
              backgroundColor: 'white',
              color: 'black',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#f0f0f0'
              },
              marginRight: 2
            }}>
            Випадковий білет
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleRandomQuestions}
            sx={{
              minWidth: '270px',
              minHeight: '50px',
              borderRadius: '16px',
              textTransform: 'none',
              backgroundColor: 'white',
              color: 'black',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#f0f0f0'
              }
            }}>
            Випадкові питання
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
