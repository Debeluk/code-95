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
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [expireDate, setExpireDate] = useState(dayjs().utc());

  useEffect(() => {
    if (isEdit && user) {
      setName(user.name);
      setLogin(user.credentials?.username || '');
      setPassword('');
      setExpireDate(dayjs.utc(user.expireAt)); // Ensure UTC conversion
    } else {
      setName('');
      setLogin('');
      setPassword('');
      setExpireDate(dayjs().utc()); // Ensure UTC conversion
    }
  }, [user, isEdit]);

  const handleSave = () => {
    const requestData = {
      name,
      expire_at: expireDate.toISOString(), // Convert to ISO format
      credentials: {
        username: login,
        password: password
      }
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
            InputProps={{ readOnly: true }}
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
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </Grid>
        <Grid item sx={gridItemStyle}>
          <Typography variant="subtitle1" gutterBottom>
            Пароль
          </Typography>
          <TextField
            variant="outlined"
            type="password"
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
