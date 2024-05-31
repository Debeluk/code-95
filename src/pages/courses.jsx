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
      setSelectedCourse(course);
      navigate('/tickets');
    } else {
      console.log('Course not found.');
    }
  };

  return (
    <Box
      sx={{
        paddingY: 2,
        marginTop: 4,
        marginBottom: 6,
        marginLeft: { xs: 2, sm: 4, md: 8, lg: 16, xl: 32 },
        marginRight: { xs: 2, sm: 4, md: 8, lg: 16, xl: 32 },
        borderRadius: 4,
        backgroundColor: 'white',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        padding: 4,
      }}
    >
      <Box textAlign="center" sx={{ marginBottom: 6 }}>
        <Typography variant="h4" gutterBottom>
          Курси
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: '16px',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: { xs: '120px', md: '160px', lg: '180px' },
                width: '100%',
                padding: 2,
                cursor: 'pointer',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
                transition: 'box-shadow 0.3s ease-in-out, border 0.3s ease-in-out',
                border: '2px solid transparent',
                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                  border: '2px solid black'
                }
              }}
              onClick={() => handleCardClick(course.name)}
            >
              <Typography
                color="inherit"
                align="center"
                sx={{
                  lineHeight: 1.2,
                  fontSize: { xs: '1rem', md: '1.25rem', lg: '1.5rem' }
                }}
              >
                {course.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
