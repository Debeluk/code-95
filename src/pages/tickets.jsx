import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.js';

export const TicketsPage = () => {
  const navigate = useNavigate();
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [courseName, setCourseName] = useState('');
  const {
    selectedCourse,
    backupLoaded,
    setTicket,
    selectRandomQuestions,
  } = useStore((state) => ({
    selectedCourse: state.selectedCourse,
    backupLoaded: state.backupLoaded,
    setTicket: state.setQuestionTicket,
    selectRandomQuestions: state.selectRandomQuestions,
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
    <Box sx={{ pb: 50, mt: 4, mb: 6, ml: 32, mr: 32 }}> {/* rewrite sx using normal words */}
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
                textTransform: 'none'
              }}>
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
              mr: 2
            }}>
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
              textTransform: 'none'
            }}>
            Випадкові питання
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
