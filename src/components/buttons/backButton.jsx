import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Импортируем иконку стрелки

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
        ...sx
      }}
      {...props}
    >
      <ArrowBackIcon /> {/* Используем иконку стрелки */}
    </Button>
  );
};

export default BackButton;
