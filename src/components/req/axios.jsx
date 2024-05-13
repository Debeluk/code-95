import axios from 'axios';
import {LOGIN, GET_CURRENT_USER, GET_COURSE, GET_TICKET_QUESTIONS} from "../../constants/ApiURL.js";
import secureLocalStorage from "react-secure-storage";

export const logUserIn = (username, password) => {
    return axios.post(LOGIN, {
        username: username,
        password: password
    })
        .then(response => {
            if (response.status === 200) {
                console.log('Login successful:', response.data);
                secureLocalStorage.setItem('accessToken', response.data.accessToken);
                secureLocalStorage.setItem('refreshToken', response.data.refreshToken);

                // First GET request to fetch user data
                return axios.get(GET_CURRENT_USER, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                });
            }
        })
        .then(userResponse => {
            if (userResponse && userResponse.status === 200) {
                console.log('User data fetched successfully:', userResponse.data);
                secureLocalStorage.setItem('currentUser', JSON.stringify(userResponse.data));

                // Second GET request to fetch course information
                return axios.get(GET_COURSE, {
                    headers: {
                        Authorization: `Bearer ${secureLocalStorage.getItem('accessToken')}`
                    }
                });
            }
        })
        .then(courseResponse => {
            if (courseResponse && courseResponse.status === 200) {
                console.log('Course data fetched successfully:', courseResponse.data);
                secureLocalStorage.setItem('courses', JSON.stringify(courseResponse.data));

                return courseResponse.data; // This can be used to set initial state in the app or further processing
            }
        })
        .catch(error => {
            if (error.response && error.response.status === 422) {
                console.error('Validation error:', error.response.data.detail);
            } else {
                console.error('Error during login or fetching user/course details:', error.message);
            }
            return null;
        });
};


export const GetQuestionsFromTicket = (course_id, ticket_number) => {
    axios.get(`${GET_TICKET_QUESTIONS}${course_id}/ticket/${ticket_number}`, {
        headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem('accessToken')}`
        }
    })
        .then(response => {
            if (response.status === 200) {
                console.log('Questions fetched successfully:', response.data);
                secureLocalStorage.setItem('ticketQuestions', JSON.stringify(response.data));
            }
        })
        .catch(error => {
            console.error('Failed to fetch questions for the ticket:', error);
        });
};
