import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'; // Импортируем иконку с длинной стрелкой

const BackButton = ({ sx, ...props }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Вернуться на одну страницу назад
  };

  return (
    <Button
      onClick={handleBack}
      sx={{
        textTransform: 'none',
        backgroundColor: 'transparent',
        color: 'lightgray',
        display: 'flex',
        alignItems: 'center',
        ...sx
      }}
      {...props}
    >
      <KeyboardBackspaceIcon sx={{ fontSize: '2.5rem' }} /> {/* Увеличиваем размер иконки */}
    </Button>
  );
};

export default BackButton;
