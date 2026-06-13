import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/main.css';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Shared
import Home from './pages/Home';
import DonationList from './pages/DonationList';
import DonationDetail from './pages/DonationDetail';

// Dashboard layouts
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorDonations from './pages/donor/DonorDonations';
import DonorRequests from './pages/donor/DonorRequests';
import CreateDonation from './pages/donor/CreateDonation';

import NGODashboard from './pages/ngo/NGODashboard';
import NGORequests from './pages/ngo/NGORequests';
import NGODonations from './pages/ngo/NGODonations';

import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerDeliveries from './pages/volunteer/VolunteerDeliveries';
import PendingDeliveries from './pages/volunteer/PendingDeliveries';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDonations from './pages/admin/AdminDonations';
import AdminRequests from './pages/admin/AdminRequests';
import AdminReports from './pages/admin/AdminReports';

import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donations" element={<DonationList />} />
          <Route path="/donations/:id" element={<DonationDetail />} />

          {/* Donor */}
          <Route path="/donor" element={<PrivateRoute roles={['donor']}><DonorDashboard /></PrivateRoute>} />
          <Route path="/donor/donations" element={<PrivateRoute roles={['donor']}><DonorDonations /></PrivateRoute>} />
          <Route path="/donor/donations/new" element={<PrivateRoute roles={['donor']}><CreateDonation /></PrivateRoute>} />
          <Route path="/donor/requests" element={<PrivateRoute roles={['donor']}><DonorRequests /></PrivateRoute>} />

          {/* NGO / Orphanage / Old Age Home */}
          <Route path="/ngo" element={<PrivateRoute roles={['ngo','orphanage','oldagehome']}><NGODashboard /></PrivateRoute>} />
          <Route path="/ngo/requests" element={<PrivateRoute roles={['ngo','orphanage','oldagehome']}><NGORequests /></PrivateRoute>} />
          <Route path="/ngo/donations" element={<PrivateRoute roles={['ngo','orphanage','oldagehome']}><NGODonations /></PrivateRoute>} />

          {/* Volunteer */}
          <Route path="/volunteer" element={<PrivateRoute roles={['volunteer']}><VolunteerDashboard /></PrivateRoute>} />
          <Route path="/volunteer/deliveries" element={<PrivateRoute roles={['volunteer']}><VolunteerDeliveries /></PrivateRoute>} />
          <Route path="/volunteer/pending" element={<PrivateRoute roles={['volunteer']}><PendingDeliveries /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/donations" element={<PrivateRoute roles={['admin']}><AdminDonations /></PrivateRoute>} />
          <Route path="/admin/requests" element={<PrivateRoute roles={['admin']}><AdminRequests /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute roles={['admin']}><AdminReports /></PrivateRoute>} />

          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
