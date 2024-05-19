import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';
import { FixedSizeList as FList } from 'react-window';
import { useStore } from '../store/store.js';
import { axiosInstance } from '../axiosInterceptor.js';
import { CREATE_GET_USER } from '../constants/ApiURL.js';

const renderRow = ({ index, style, data }) => {
  const item = data[index];
  const expireDate = new Date(item.expireAt).toLocaleDateString(); // Получение только даты без времени
  return (
    <Box
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderBottom: '1px solid #ddd',
        padding: 2
      }}>
      <Box sx={{ width: '10%', textAlign: 'center' }}>{item.id}</Box>
      <Box sx={{ width: '30%', textAlign: 'center' }}>{item.name}</Box>
      <Box sx={{ width: '30%', textAlign: 'center' }}>{expireDate}</Box>
      <Box sx={{ width: '20%', textAlign: 'center' }}>
        <Button variant="contained" size="small" sx={{ marginRight: 1 }}>
          Edit
        </Button>
        <Button variant="contained" size="small" color="error">
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export const Admin = () => {
  const [users, setUsers] = useState([]);
  const { sessionId, accessToken } = useStore((state) => ({
    sessionId: state.sessionId,
    accessToken: state.accessToken
  }));

  useEffect(() => {
    if (sessionId && accessToken) {
      axiosInstance
        .get(CREATE_GET_USER)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    }
  }, [sessionId, accessToken]);

  return (
    <Box
      sx={{
        marginTop: 4,
        marginBottom: 6,
        marginLeft: 32,
        marginRight: 32,
        display: 'flex',
        flexDirection: 'column'
      }}>
      {/* First Section */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        sx={{ minHeight: '80px', marginBottom: 4 }}>
        {/* Left Part */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          sx={{ width: '70%', gap: '4px' }}>
          <Typography sx={{ fontSize: '18px' }}>Фільтр</Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '48px',
                fontSize: '16px',
                width: '256px'
              }
            }}
          />
        </Box>

        {/* Add Button */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          sx={{ width: '256px' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              width: '100%',
              height: '48px',
              fontSize: '1rem',
              padding: '10px 20px',
              borderRadius: '8px'
            }}>
            Додати
          </Button>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: 4 }} />

      {/* List using react-window */}
      <Box flex={1}>
        <FList height={500} itemCount={users.length} itemSize={50} width="100%" itemData={users}>
          {renderRow}
        </FList>
      </Box>
    </Box>
  );
};
