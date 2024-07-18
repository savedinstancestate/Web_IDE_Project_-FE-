import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Signup from './pages/SignupPage/Signup';
import UserInfo from './pages/UserPage/myPage';
import Chat from './pages/IDEPage/chat';
import Home from './pages/IDEPage/Home';
import axios from "axios";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/UserInfo" element={<UserInfo />} />
                <Route path="/project" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
