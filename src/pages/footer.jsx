import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        bgcolor: 'orange',
        boxShadow: 1
      }}
    >
      <Typography variant="body1">Phone: +1 234 567 890</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // Handle the feedback action here
          console.log('Feedback button clicked');
        }}
      >
        Feedback
      </Button>
    </Box>
  );
};