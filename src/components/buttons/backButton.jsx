import React from 'react';
import { Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const BackButton = ({ sx, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === '/test') {
      navigate('/tickets');
    } else if (location.pathname === '/tickets') {
      navigate('/courses');
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      onClick={handleBack}
      disableRipple
      sx={{
        textTransform: 'none',
        backgroundColor: 'transparent',
        color: 'lightgray',
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
          backgroundColor: 'transparent',
          color: 'black'
        },
        '&:focus': {
          backgroundColor: 'transparent'
        },
        ...sx
      }}
      {...props}>
      <KeyboardBackspaceIcon sx={{ fontSize: '2.5rem' }} />
    </Button>
  );
};

export default BackButton;
