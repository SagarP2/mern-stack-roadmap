import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import PrivateRoute from './PrivateRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
        <Route path="/login" element={token ? <Navigate to="/tasks" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/tasks" /> : <Register />} />
        <Route 
          path="/tasks" 
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
