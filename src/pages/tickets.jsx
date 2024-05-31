import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Switch, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.js';
import BackButton from '../components/buttons/backButton.jsx';

export const TicketsPage = () => {
  const navigate = useNavigate();
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [courseName, setCourseName] = useState('');
  const examMode = useStore((state) => state.examOn);
  const setExamMode = useStore((state) => state.setExamOn);
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

  const handleToggleChange = (event) => {
    setExamMode(event.target.checked);
  };

  return (
    <Box
      sx={{
        paddingBottom: 10,
        marginTop: 4,
        marginBottom: 6,
        marginLeft: { xs: 2, md: "auto"},
        marginRight: { xs: 2, md: "auto"},
        borderRadius: 4,
        backgroundColor: 'white',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        padding: 4,
        maxWidth: "1080px",
        minHeight: "560px",
      }}>
      <Box
        sx={{
          marginBottom: 4,
          display: 'flex',
          justifyContent: 'flex-start',
          backgroundColor: 'transparent',
          paddingLeft: { xs: 0, md: '0px' }
        }}>
        <BackButton sx={{ marginRight: 2 }} />
      </Box>

      <Box textAlign="center" marginBottom={4} sx={{ paddingLeft: '32px', paddingRight: '32px' }}>
        <Typography variant="h5" gutterBottom>
          {courseName}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Білети
        </Typography>
      </Box>

      <Grid
        container
        gap={2}
        justifyContent="center"
        alignItems="center"
        marginBottom={4}
        sx={{ maxWidth: { xs: '290px', md: '620px' }, margin: '0 auto 16px', padding: 0 }}>
        {ticketNumbers.map((number) => (
          <Grid item key={number} sx={{ width: 'auto', padding: 0 }}>
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
                transition: 'box-shadow 0.3s ease-in-out, border 0.3s ease-in-out',
                border: '2px solid transparent',
                '&:hover': {
                  backgroundColor: 'white',
                  borderColor: 'black',
                  borderWidth: '2px',
                  borderStyle: 'solid'
                }
              }}>
              {number}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        marginBottom={4}
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ padding: 0 }}>
        <Grid item sx={{ width: 'auto', padding: 0 }}>
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
              transition: 'border-color 0.3s',
              '&:hover': {
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: '2px',
                borderStyle: 'solid'
              }
            }}>
            Випадковий білет
          </Button>
        </Grid>
        <Grid item sx={{ width: 'auto', padding: 0 }}>
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
              transition: 'border-color 0.3s',
              '&:hover': {
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: '2px',
                borderStyle: 'solid'
              }
            }}>
            Випадкові питання
          </Button>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 4
        }}>
        <FormControlLabel
          labelPlacement="start"
          control={
            <Switch
              checked={examMode}
              onChange={handleToggleChange}
              color="default"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'orange'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'orange'
                }
              }}
            />
          }
          label={
            <Typography variant="h6" color={examMode ? 'orange' : 'textSecondary'}>
              Режим Екзамену
            </Typography>
          }
        />
      </Box>
    </Box>
  );
};
