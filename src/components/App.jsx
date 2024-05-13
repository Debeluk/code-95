import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import {LoginPage} from './login.jsx';
import {Header} from './header.jsx';
import {Footer} from "./footer.jsx";
import {Courses} from './courses.jsx';
import {TicketsPage} from './tickets.jsx';
import {FormedTest} from './formedTest.jsx';
import {Admin} from './admin.jsx';
import {UserInfo} from './userInfo.jsx';
import {ProtectedRoute} from "./req/protectedRoute.jsx";

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/courses" element={
                    <ProtectedRoute requiredRole="USER">
                        <Header/><Courses/><Footer/>
                    </ProtectedRoute>
                }/>
                <Route path="/tickets" element={
                    <ProtectedRoute requiredRole="USER">
                        <Header/><TicketsPage/><Footer/>
                    </ProtectedRoute>
                }/>
                <Route path="/test" element={
                    <ProtectedRoute requiredRole="USER">
                        <Header/><FormedTest/><Footer/>
                    </ProtectedRoute>
                }/>
                <Route path="/admin" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <Header/><Admin/>
                    </ProtectedRoute>
                }/>
                <Route path="/user-info" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <Header/><UserInfo/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </Router>
    );
};
