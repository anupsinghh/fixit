import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import ComplaintForm from './pages/ComplaintForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AdminManagerDashboard from './pages/AdminManagerDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';


function App() {
  return (
    <Routes>
      {/* Layout wraps all below routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="complaint" element={<ComplaintForm />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="student-dashboard" element={<StudentDashboard/>} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="technician-dashboard" element={<TechnicianDashboard />} />
        <Route path="admin/users" element={<UserManagement />} />
        <Route path="/manager-dashboard" element={<AdminManagerDashboard />} />


        
      </Route>
    </Routes>
  );
}

export default App;
