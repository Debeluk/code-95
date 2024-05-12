import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import {LoginPage} from './login.jsx';
import {Header} from './header.jsx';
import {Courses} from './courses.jsx';
import {TicketsPage} from './tickets.jsx';
import {FormedTest} from './formedTest.jsx';
import {Admin} from './admin.jsx';
import {UserInfo} from './userInfo.jsx';

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/courses" element={<><Header/><Courses/></>}/>
                <Route path="/tickets" element={<><Header/><TicketsPage/></>}/>
                <Route path="/test" element={<><Header/><FormedTest/></>}/>
                <Route path="/admin" element={<><Header/><Admin/></>}/>
                <Route path="/user-info" element={<><Header/><UserInfo/></>}/>
            </Routes>
        </Router>
    );
};
