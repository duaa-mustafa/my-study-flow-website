import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Subjects from './Subjects';
import Calendar from './Calendar';
import Import from './Import';
import Analytics from './Analytics';
import Rewards from './Rewards';
import Settings from './Settings';
import Notifications from './Notifications';
import Help from './help';
import Progress from './Progress';
import Forgotpassword from './Forgotpassword';
import Registration from './registration';
import Login from './login';
import Layout from './Layout';
import SetAvailability from './SetAvailability';
import FocusMode from './FocusMode';
import Assignments from './Assignments';

export default function App() {
  // Check for token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        
        {/* Protected routes with persistent layout */}
        {isAuthenticated ? (
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="import" element={<Import />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="help" element={<Help />} />
            <Route path="progress" element={<Progress />} />
            <Route path="set-availability" element={<SetAvailability />} />
            <Route path="focus" element={<FocusMode />} />
            <Route path="assignments" element={<Assignments />} />
            {/* Default route - redirect to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          // If not authenticated, redirect to login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}