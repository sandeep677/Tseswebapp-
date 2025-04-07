import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from '../src/components/Navigation.js';
import Home from '../src/pages/Home';
import Notice from '../src/pages/Notice';
import Attendance from '../src/pages/Attendance';
import Homework from '../src/pages/Homework';
import Login from '../src/pages/Login';
import ChangePassword from '../src/components/Changepassword.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;