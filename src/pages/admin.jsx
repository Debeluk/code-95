import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Dialog,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { FixedSizeList as FList } from 'react-window';
import { useStore } from '../store/store.js';
import { axiosInstance } from '../axiosInterceptor.js';
import { CREATE_GET_USER, GET_COURSE, CREATE_COURSE, DELETE_COURSE } from '../constants/ApiURL.js';
import { UserInfoModal } from './userInfo.jsx';

const renderRow = ({ index, style, data, onEdit }) => {
  const item = data[index];
  const expireDate = new Date(item.expireAt).toLocaleDateString();
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
        <Button
          variant="contained"
          size="small"
          sx={{ marginRight: 1 }}
          onClick={() => onEdit(item, true)}>
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
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

  useEffect(() => {
    if (courses.length === 0) {
      axiosInstance
        .get(GET_COURSE)
        .then((res) => {
          setCourses(res.data);
        })
        .catch((err) => {
          console.error(err);
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
      });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
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
        });
    }
  };

  const refreshUsers = () => {
    axiosInstance
      .get(CREATE_GET_USER)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

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
            }}
            onClick={() => handleEdit(null, false)}>
            Додати
          </Button>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: 4 }} />

      {/* List using react-window */}
      <Box flex={1}>
        <FList
          height={500}
          itemCount={users.length}
          itemSize={50}
          width="100%"
          itemData={users}
          itemKey={(index, data) => data[index].id}>
          {({ index, style, data }) => renderRow({ index, style, data, onEdit: handleEdit })}
        </FList>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCourseModal}
          sx={{ textTransform: 'none', minWidth: '200px', height: '48px' }}>
          Добавить курс
        </Button>
      </Box>

      {/* User Info Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <UserInfoModal
          user={selectedUser}
          onClose={handleCloseModal}
          isEdit={isEdit}
          refreshUsers={refreshUsers}
        />
      </Dialog>

      {/* Courses Modal */}
      <Dialog open={isCourseModalOpen} onClose={handleCloseCourseModal} fullWidth maxWidth="md">
        <Box sx={{ padding: 4 }}>
          <Box textAlign="center" sx={{ marginBottom: 6 }}>
            <Typography variant="h4" gutterBottom>
              Курси
            </Typography>
          </Box>
          <List>
            {Array.isArray(courses) &&
              courses.map((course) => (
                <ListItem key={course.id} sx={{ borderBottom: '1px solid #ddd' }}>
                  <ListItemText primary={course.name} />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteCourse(course.id)}
                      sx={{ marginLeft: 2 }}>
                      Удалить
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
          <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              component="label"
              sx={{ textTransform: 'none', minWidth: '200px', height: '48px' }}>
              Загрузить курс
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
