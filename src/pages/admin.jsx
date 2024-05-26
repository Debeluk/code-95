import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress
} from '@mui/material';
import { FixedSizeList as FList } from 'react-window';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '../store/store.js';
import { axiosInstance } from '../axiosInterceptor.js';
import {
  CREATE_GET_USER,
  GET_COURSE,
  CREATE_COURSE,
  DELETE_COURSE,
  USER_USE
} from '../constants/ApiURL.js';
import { UserInfoModal } from './userInfo.jsx';
import { Loader } from '../components/Loader/Loader.jsx';

const renderRow = ({ index, style, data, onEdit, onDelete }) => {
  const item = data[index];
  const expireDate = new Date(item.expireAt).toLocaleDateString();
  return (
    <Box
      style={style}
      sx={{
        display: 'grid',
        gridTemplateColumns: '100px 300px 200px 150px',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderBottom: '1px solid #ddd',
        padding: 2,
        gap: '4px'
      }}>
      <Box
        sx={{
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
        {item.id}
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
        {item.name}
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
        {expireDate}
      </Box>
      <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            marginRight: 1,
            borderRadius: '4px',
            minWidth: { xs: '24px', md: '30px' },
            minHeight: { xs: '24px', md: '30px' },
            borderColor: 'black',
            color: 'black',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              transform: 'scale(1.02)',
              backgroundColor: 'white',
              borderColor: 'black'
            },
            '&:active': {
              backgroundColor: 'white',
              borderColor: 'black'
            }
          }}
          onClick={() => onEdit(item, true)}>
          <EditIcon fontSize="small" />
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: '4px',
            minWidth: { xs: '24px', md: '30px' },
            minHeight: { xs: '24px', md: '30px' },
            borderColor: 'black',
            color: 'black',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              transform: 'scale(1.02)',
              backgroundColor: 'white',
              borderColor: 'black'
            },
            '&:active': {
              backgroundColor: 'white',
              borderColor: 'black'
            }
          }}
          onClick={() => onDelete(item)}>
          <DeleteIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const { sessionId, accessToken } = useStore((state) => ({
    sessionId: state.sessionId,
    accessToken: state.accessToken
  }));

  const { courses, setCourses } = useStore((state) => ({
    courses: state.courses || [],
    setCourses: state.setCourses
  }));

  useEffect(() => {
    if (sessionId && accessToken) {
      setIsLoadingUsers(true);
      axiosInstance
        .get(CREATE_GET_USER)
        .then((response) => {
          console.log('Users data:', response.data); // Log the data to check the structure
          setUsers(response.data);
          setFilteredUsers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        })
        .finally(() => {
          setIsLoadingUsers(false);
        });
    }
  }, [sessionId, accessToken]);

  useEffect(() => {
    if (courses.length === 0) {
      setIsLoadingCourses(true);
      axiosInstance
        .get(GET_COURSE)
        .then((res) => {
          setCourses(res.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoadingCourses(false);
        });
    }
  }, [courses.length, setCourses]);

  const handleEdit = (user, isEdit) => {
    setSelectedUser(user);
    setIsEdit(isEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsEdit(false);
  };

  const handleOpenCourseModal = () => {
    setIsCourseModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (courseId) => {
    setIsLoadingCourses(true);
    axiosInstance
      .delete(DELETE_COURSE.replace('{course_id}', courseId))
      .then(() => {
        axiosInstance
          .get(GET_COURSE)
          .then((res) => {
            setCourses(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
      })
      .finally(() => {
        setIsLoadingCourses(false);
      });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoadingCourses(true);
      const formData = new FormData();
      formData.append('file', file);

      axiosInstance
        .post(CREATE_COURSE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          axiosInstance
            .get(GET_COURSE)
            .then((res) => {
              setCourses(res.data);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((error) => {
          console.error('Error uploading course:', error);
        })
        .finally(() => {
          setIsLoadingCourses(false);
        });
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    setIsLoadingUsers(true);
    axiosInstance
      .delete(USER_USE.replace('{user_id}', userToDelete.id))
      .then(() => {
        refreshUsers();
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      })
      .finally(() => {
        setIsLoadingUsers(false);
      });
  };

  const refreshUsers = () => {
    setIsLoadingUsers(true);
    axiosInstance
      .get(CREATE_GET_USER)
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setIsLoadingUsers(false);
      });
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setFilter(value);
    setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    <Box
      sx={{
        minHeight: '70vh',
        paddingBottom: 10,
        marginTop: 1,
        marginBottom: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1120px',
        padding: '0 8px'
      }}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        sx={{ minHeight: '80px', marginBottom: 4, flexWrap: 'wrap' }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          sx={{ width: { xs: '100%', md: '70%' }, gap: '4px', padding: '0 8px' }}>
          <Typography sx={{ fontSize: '18px' }}>Фільтр</Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={filter}
            onChange={handleFilterChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black'
                },
                '&:hover fieldset': {
                  borderColor: 'black'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black'
                }
              },
              '& .MuiInputBase-root': {
                height: '42px',
                fontSize: '16px'
              }
            }}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          sx={{
            width: { xs: '100%', md: '256px' },
            marginTop: { xs: 2, md: 0 },
            padding: '0 8px'
          }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              textTransform: 'none',
              width: '100%',
              height: '42px',
              fontSize: '1rem',
              padding: '10px 20px',
              borderRadius: '8px',
              borderColor: 'black',
              color: 'black',
              backgroundColor: 'white',
              '&:hover': {
                transform: 'scale(1.02)',
                backgroundColor: 'white',
                borderColor: 'black'
              },
              '&:active': {
                backgroundColor: 'white',
                borderColor: 'black'
              }
            }}
            onClick={() => handleEdit(null, false)}>
            Додати
          </Button>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: 4 }} />

      <Box
        flex={1}
        sx={{
          border: '1px solid black',
          borderRadius: 2,
          padding: 2,
          overflowX: 'auto',
          overflowY: 'auto'
        }}>
        {isLoadingUsers ? (
          <Loader />
        ) : (
          <FList
            height={360}
            itemCount={filteredUsers.length}
            itemSize={50}
            width="100%"
            itemData={filteredUsers}
            itemKey={(index, data) => data[index].id}>
            {({ index, style, data }) =>
              renderRow({
                index,
                style,
                data,
                onEdit: handleEdit,
                onDelete: handleDeleteUser
              })
            }
          </FList>
        )}
      </Box>

      <Box sx={{ marginTop: 4, padding: '0 8px' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpenCourseModal}
          sx={{
            textTransform: 'none',
            minWidth: '200px',
            height: '48px',
            borderColor: 'black',
            color: 'black',
            backgroundColor: 'white',
            marginBottom: '8px',
            '&:hover': {
              transform: 'scale(1.02)',
              backgroundColor: 'white',
              borderColor: 'black'
            },
            '&:active': {
              backgroundColor: 'white',
              borderColor: 'black'
            }
          }}>
          Додати курс
        </Button>
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: '412px', // Fixed width for the modal
            margin: 'auto' // Center the modal horizontally
          }
        }}>
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px'
          }}>
          <UserInfoModal
            user={selectedUser}
            onClose={handleCloseModal}
            isEdit={isEdit}
            refreshUsers={refreshUsers}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCourseModalOpen} onClose={handleCloseCourseModal} fullWidth maxWidth="md">
        <Box sx={{ padding: 4 }}>
          <Box textAlign="center" sx={{ marginBottom: 6 }}>
            <Typography variant="h4" gutterBottom>
              Курси
            </Typography>
          </Box>
          {isLoadingCourses ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px'
              }}>
              <CircularProgress sx={{ color: '#000000' }} />
            </Box>
          ) : (
            <List>
              {Array.isArray(courses) &&
                courses.map((course) => (
                  <ListItem key={course.id} sx={{ borderBottom: '1px solid #ddd' }}>
                    <ListItemText primary={course.name} />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: '4px',
                          minWidth: { xs: '24px', md: '30px' },
                          minHeight: { xs: '24px', md: '30px' },
                          borderColor: 'black',
                          color: 'black',
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            backgroundColor: 'white',
                            borderColor: 'black'
                          },
                          '&:active': {
                            backgroundColor: 'white',
                            borderColor: 'black'
                          }
                        }}
                        onClick={() => handleDeleteCourse(course.id)}>
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          )}
          <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              component="label"
              sx={{
                textTransform: 'none',
                minWidth: '200px',
                height: '48px',
                borderColor: 'black',
                color: 'black',
                backgroundColor: 'white',
                '&:hover': {
                  transform: 'scale(1.02)',
                  backgroundColor: 'white',
                  borderColor: 'black'
                },
                '&:active': {
                  backgroundColor: 'white',
                  borderColor: 'black'
                }
              }}>
              Завантажити курс
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px'
          }
        }}>
        <DialogTitle id="alert-dialog-title">Підтвердити видалення</DialogTitle>
        <DialogContent>
          {isLoadingUsers && <Loader />}
          <DialogContentText id="alert-dialog-description">
            Ви впевнені, що хочете видалити користувача {userToDelete?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            padding: '8px 16px 16px 8px'
          }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid black',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'white'
              }
            }}>
            Скасувати
          </Button>
          <Button
            onClick={confirmDeleteUser}
            sx={{
              color: '#d32f2f',
              backgroundColor: 'white',
              border: '1px solid #d32f2f',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'white',
                color: '#d32f2f'
              }
            }}
            autoFocus>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
