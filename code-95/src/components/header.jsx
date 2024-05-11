import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={3}>
      <Toolbar disableGutters>
        <Box
          sx={{
            mt: 2,
            mb: 2,
            ml: { xs: 2, md: 32 },
            mr: { xs: 2, md: 32 },
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: { xs: '16px', md: '18px' } }}>ADR Online</Typography>
          <Button
            color="inherit"
            onClick={handleClick}
            sx={{
              backgroundColor: 'green',
              color: 'white',
              borderRadius: '24px',
              padding: '8px 16px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle1" mr={1}>Name</Typography>
              <Typography variant="caption">dropdown</Typography>
            </Box>
          </Button>
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          style: {
            maxHeight: 200,
            width: '20ch',
            marginTop: '20px',
          },
        }}
      >
        <MenuItem disabled>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            Доступ до: 17.12.02
          </Box>
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ justifyContent: 'center' }}>Вийти</MenuItem>
      </Menu>
    </AppBar>
  );
};
