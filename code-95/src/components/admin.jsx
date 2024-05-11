import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { FixedSizeList as FList } from 'react-window';

const sampleData = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

const renderRow = ({ index, style }) => (
  <Box
    style={style}
    sx={{
      boxSizing: 'border-box',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      pl: 2,
      height: '100%',
    }}
  >
    {sampleData[index]}
  </Box>
);

export const Admin = () => {
  return (
    <Box sx={{ mt: 4, mb: 6,ml: 32, mr: 32, display:'flex', flexDirection: 'column', }}>
      {/* First Section */}
      <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ minHeight: '80px', mb: 4 }}>
        {/* Left Part */}
        <Box display="flex" flexDirection="column" justifyContent="flex-end" sx={{ width: '70%', gap: '4px' }}>
          <Typography sx={{fontSize: '18px'}}>
            Фільтр
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '48px',
                fontSize: '16px',
                width: '256px',
              },
            }}
          />
        </Box>

        {/* Add Button */}
        <Box display="flex" flexDirection="column" justifyContent="flex-end" sx={{ width: '256px' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              width: '100%',
              height: '48px',
              fontSize: '1rem',
              padding: '10px 20px',
              borderRadius: '8px',
            }}
          >
            Додати
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* List using react-window */}
      <Box flex={1}>
        <FList
          height={500}
          itemCount={sampleData.length}
          itemSize={50}
          width="100%"
        >
          {renderRow}
        </FList>
      </Box>
    </Box>
  );
};
