import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { axiosInstance } from '../axiosInterceptor.js';
import { CREATE_GET_USER, USER_USE } from '../constants/ApiURL.js';

dayjs.extend(utc);

const textFieldStyle = {
  '& .MuiInputBase-root': {
    height: '48px',
    fontSize: '16px',
    maxWidth: '400px'
  }
};

const gridItemStyle = {
  width: '400px'
};

export const UserInfoModal = ({ user, onClose, isEdit, refreshUsers }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [expireDate, setExpireDate] = useState(dayjs().utc());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && user) {
      console.log('User data:', user); // Консоль лог данных о пользователе
      setName(user.name);
      setUsername(user.username || ''); // Предзаполнение логина при редактировании
      setPassword('');
      setExpireDate(dayjs.utc(user.expireAt)); // Ensure UTC conversion
    } else {
      setName('');
      setUsername('');
      setPassword('');
      setExpireDate(dayjs().utc().add(1, 'day')); // Ensure UTC conversion and set default to tomorrow
    }
  }, [user, isEdit]);

  const handleSave = () => {
    if (!name) {
      setError("Ім'я не може бути порожнім.");
      return;
    }

    if (username.length < 6) {
      setError('Логін повинен містити мінімум 6 знаків.');
      return;
    }

    if (password.length < 6) {
      setError('Пароль повинен містити мінімум 6 знаків.');
      return;
    }

    if (!isEdit && expireDate.isBefore(dayjs().utc().add(1, 'day'))) {
      setError('Дата закінчення повинна бути як мінімум на день вперед.');
      return;
    }

    const requestData = {
      name,
      expire_at: expireDate.toISOString(), // Convert to ISO format
      username: username,
      password: password
    };

    const requestPromise =
      isEdit && user
        ? axiosInstance.put(USER_USE.replace('{user_id}', user.id), requestData)
        : axiosInstance.post(CREATE_GET_USER, requestData);

    requestPromise
      .then((response) => {
        console.log('User saved:', response.data);
        refreshUsers();
        onClose();
      })
      .catch((error) => {
        console.error('Error saving user:', error);
      });
  };

  const handleDateChange = (newDate) => {
    setExpireDate(newDate.utc()); // Ensure UTC conversion
  };

  const addDays = (days) => {
    setExpireDate(expireDate.add(days, 'day').utc());
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* First Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h5">
          {isEdit ? 'Змінити користувача' : 'Додати користувача'}
        </Typography>
        <IconButton color="error" sx={{ padding: 0 }} onClick={onClose}>
          <Box
            sx={{
              width: '24px',
              height: '24px',
              backgroundColor: 'grey',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <CloseIcon sx={{ color: 'white', fontSize: '18px' }} />
          </Box>
        </IconButton>
      </Box>

      {/* Second Row */}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            {`Ім'я користувача`}
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={textFieldStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            ID
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            InputProps={{ readOnly: true, style: { pointerEvents: 'none' } }}
            value={user?.id || ''}
            sx={textFieldStyle}
          />
        </Grid>
      </Grid>

      {/* Third Row */}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Логін
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={textFieldStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Пароль
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={textFieldStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Fourth Row */}
      <Grid container spacing={2} justifyContent="space-between" alignItems="end">
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Термін доступу
          </Typography>
          <Box display="flex" alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="DD/MM/YYYY"
                value={expireDate}
                onChange={handleDateChange}
                slots={{
                  textField: (params) => (
                    <TextField {...params} variant="outlined" fullWidth sx={textFieldStyle} />
                  )
                }}
              />
            </LocalizationProvider>
            <Button onClick={() => addDays(14)} variant="outlined" sx={{ marginLeft: 1 }}>
              +14
            </Button>
            <Button onClick={() => addDays(30)} variant="outlined" sx={{ marginLeft: 1 }}>
              +30
            </Button>
          </Box>
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </Grid>
        <Grid item sx={gridItemStyle}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-end"
            height="100%">
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none', minWidth: '120px', height: '56px' }}
              onClick={handleSave}>
              Зберегти
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
