import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation'; // Importing Navigation component
import Home from './pages/Home'; // Importing the Home page component
import Notice from './pages/Notice'; // Importing the Notice page component
import Attendance from './pages/Attendance'; // Importing the Attendance page component
import Homework from './pages/Homework'; // Importing the Homework page component
import Login from './pages/Login'; // Importing the Login page component
import ChangePassword from './components/Changepassword'; // Importing the ChangePassword component
import './App.css'; // Importing CSS file

function App() {
  return (
    <Router> {/* Router wraps the entire app to handle routing */}
      <div className="App">
        <Navigation /> {/* Render the Navigation component */}
        <main className="container">
          <Routes>
            {/* Define routes for different pages */}
            <Route path="/" element={<Home />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
