import React, {useState, useEffect} from 'react';
import {Box, Typography, Grid, Paper} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";

export const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Assuming courses data is fetched and stored as an array of course objects
        const storedCourses = secureLocalStorage.getItem('courses');
        if (storedCourses) {
            setCourses(JSON.parse(storedCourses));
        }
    }, []);

    const handleCardClick = (courseName) => {
        // Clear specific keys related to course selection
        secureLocalStorage.removeItem('chosenCourseId');
        secureLocalStorage.removeItem('chosenCourseName');

        // Find course from stored courses based on the name
        const course = courses.find(c => c.name === courseName);
        if (course) {
            console.log(`You clicked course with ID: ${course.id}`);
            console.log(`Number of tickets in this course: ${course.tickets}`);

            // Store the chosen course ID in secure storage
            secureLocalStorage.setItem('chosenCourseId', course.id.toString());

            // Store the chosen course name in secure storage
            secureLocalStorage.setItem('chosenCourseName', course.name);

            navigate('/tickets');
        } else {
            console.log("Course not found.");
        }
    };

    return (
        <Box sx={{minHeight: '100vh', py: 6, mt: 4, mb: 6, ml: 32, mr: 32}}>
            <Box textAlign="center" sx={{mb: 6}}>
                <Typography variant="h4" gutterBottom>
                    Курси
                </Typography>
            </Box>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Paper elevation={0} sx={{
                            borderRadius: '16px',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            height: 150,
                            padding: 2,
                            cursor: 'pointer',
                            border: '1px inset black',
                            borderTop: 'none',
                            boxShadow: '0px 0px 0px rgba(0,0,0,0)',
                            '&:hover': {
                                boxShadow: '0px 4px 12px rgba(0,0,0,0.1), 0px 0px 0px rgba(0,0,0,0)'
                            }
                        }} onClick={() => handleCardClick(course.name)}>
                            <Typography variant="h6" color="inherit" align="center" sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }}>
                                {course.name}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
