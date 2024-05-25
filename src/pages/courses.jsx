import React, { useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.js';
import { GET_COURSE } from '../constants/ApiURL.js';
import { axiosInstance } from '../axiosInterceptor.js';

export const Courses = () => {
  const navigate = useNavigate();
  const { courses, backupLoaded, setCourses, setSelectedCourse, deselectCourse } = useStore(
    (state) => ({
      courses: state.courses,
      backupLoaded: state.backupLoaded,
      setCourses: state.setCourses,
      setSelectedCourse: state.setSelectedCourse,
      deselectCourse: state.deselectCourse
    })
  );

  useEffect(() => {
    if (!backupLoaded) return;
    deselectCourse();
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
  }, [backupLoaded, courses.length, deselectCourse, setCourses]);

  const handleCardClick = (courseName) => {
    const course = courses.find((c) => c.name === courseName);
    if (course) {
      console.log(`You clicked course with ID: ${course.id}`);
      console.log(`Number of tickets in this course: ${course.tickets}`);
      setSelectedCourse(course);
      navigate('/tickets');
    } else {
      console.log('Course not found.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '70vh',
        paddingY: 2,
        marginTop: 4,
        marginBottom: 6,
        marginLeft: 32,
        marginRight: 32
      }}
    >
      <Box textAlign="center" sx={{ marginBottom: 6 }}>
        <Typography variant="h4" gutterBottom>
          Курси
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id} sx={{ padding: '16px' }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: '16px',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '150px',
                width: '100%',
                padding: 2,
                cursor: 'pointer',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.3s ease-in-out, border 0.3s ease-in-out',
                border: '1px solid transparent',
                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid black'
                }
              }}
              onClick={() => handleCardClick(course.name)}
            >
              <Typography variant="h6" color="inherit" align="center">
                {course.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
