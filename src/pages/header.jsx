import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStore } from '../store/store.js';
import { useNavigate } from 'react-router-dom';
import { logout } from '../axiosInterceptor.js';

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const open = Boolean(anchorEl);
  const { user } = useStore((state) => ({
    user: state.currentUser
  }));
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/');
    setOpenDialog(false);
  };

  return (
    <AppBar position="sticky" color="default" elevation={3}>
      <Toolbar disableGutters>
        <Box
          sx={{
            marginTop: 2,
            marginBottom: 2,
            marginLeft: 32,
            marginRight: 32,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>ADR test</Typography>
          <Button
            color="inherit"
            onClick={handleClick}
            sx={{
              backgroundColor: 'orange',
              color: 'white',
              borderRadius: '24px',
              padding: '8px 16px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'orange',
                transform: 'scale(1.02)'
              }
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                {user.name ?? 'Name'}
              </Typography>
              <ExpandMoreIcon />
            </Box>
          </Button>
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          elevation: 3,
          style: {
            maxHeight: 180,
            width: '200px',
            marginTop: '20px',
            backgroundColor: 'white'
          }
        }}
      >
        <Collapse in={open}>
          <MenuItem disabled sx={{ padding: '0px', backgroundColor: 'white', color: 'black' }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px',
                backgroundColor: 'white',
                color: 'black'
              }}
            >
              Доступ до: {new Date(user.expireAt).toLocaleDateString('uk-UA') ?? 'дата не вказана'}
            </Box>
          </MenuItem>
          <MenuItem
            onClick={handleOpenDialog}
            sx={{
              justifyContent: 'center',
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
                transform: 'scale(1.02)'
              }
            }}
          >
            Вийти
          </MenuItem>
        </Collapse>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Підтвердіть вихід'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ви впевнені, що хочете вийти?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: 'black' }}>
            Скасувати
          </Button>
          <Button onClick={handleConfirmLogout} sx={{ color: 'black' }} autoFocus>
            Вийти
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};
