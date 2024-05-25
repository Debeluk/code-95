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
        boxShadow: 1,
        height: '58px'
      }}
    >
      <Typography variant="body1">Phone: +1 234 567 890</Typography>
      <Button
        variant="contained"
        color="inherit"
        backgroundColor="white"
        onClick={() => {
          console.log('Feedback button clicked');
        }}
      >
        Feedback
      </Button>
    </Box>
  );
};
