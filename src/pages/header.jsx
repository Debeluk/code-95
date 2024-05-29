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
  Collapse,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStore } from '../store/store.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../axiosInterceptor.js';
import { TEST_PATH } from '../constants/PathURL.js';

const COURSES_PATH = '/courses';

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const open = Boolean(anchorEl);
  const { user } = useStore((state) => ({
    user: state.currentUser
  }));
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isSticky = location.pathname !== TEST_PATH;

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

  const handleLogoClick = () => {
    navigate(COURSES_PATH);
  };

  return (
    <AppBar
      position={isSticky ? 'sticky' : 'static'}
      color="default"
      elevation={3}
      sx={{
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        boxShadow: isSticky
          ? '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)'
          : 'none',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0,
        zIndex: 1100,
        top: 0,
        left: 'auto',
        right: 0
      }}>
      <Toolbar
        sx={{
          backgroundColor: '#fff',
          boxShadow: !isSticky
            ? '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)'
            : 'none',
          zIndex: 1100
        }}>
        <Box
          sx={{
            marginTop: 2,
            marginBottom: 2,
            marginX: { xs: 2, sm: 4, md: 8, lg: 32 },
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Button
            onClick={handleLogoClick}
            sx={{
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
            disableRipple
            disableElevation>
            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>
              ADR test
            </Typography>
          </Button>
          <Button
            color="inherit"
            onClick={handleClick}
            sx={{
              backgroundColor: 'orange',
              color: 'white',
              borderRadius: '24px',
              padding: { xs: '4px 8px', sm: '8px 16px' },
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'orange',
                transform: 'scale(1.02)'
              }
            }}>
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
        }}>
        <Collapse in={open}>
          <MenuItem
            disabled
            disableRipple
            sx={{ padding: '0px', backgroundColor: 'white', color: 'black' }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px',
                backgroundColor: 'white',
                color: 'black'
              }}>
              Доступ до: {new Date(user.expireAt).toLocaleDateString('uk-UA') ?? 'дата не вказана'}
            </Box>
          </MenuItem>
          <MenuItem
            disableRipple
            sx={{
              justifyContent: 'center',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'white',
                cursor: 'auto'
              }
            }}>
            <Box
              onClick={handleOpenDialog}
              sx={{
                backgroundColor: isMobile ? 'orange' : 'white',
                color: isMobile ? 'white' : 'black',
                padding: '8px 24px',
                borderRadius: '24px',
                '&:hover': {
                  backgroundColor: 'orange',
                  color: 'white',
                  cursor: 'pointer'
                }
              }}>
              Вийти
            </Box>
          </MenuItem>
        </Collapse>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px'
          }
        }}>
        <DialogTitle id="alert-dialog-title">{'Підтвердіть вихід'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ви впевнені, що хочете вийти?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid black',
              borderRadius: '8px',
              minWidth: '110px',
              minHeight: '36px',
              '&:hover': {
                backgroundColor: 'white'
              }
            }}>
            Скасувати
          </Button>
          <Button
            onClick={handleConfirmLogout}
            sx={{
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid black',
              borderRadius: '8px',
              minWidth: '110px',
              minHeight: '36px',
              '&:hover': {
                backgroundColor: 'white',
                color: 'black'
              }
            }}
            autoFocus
            disableRipple>
            Вийти
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};
