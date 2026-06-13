import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENUS = {
  donor: [
    { path: '/donor', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/donor/donations', label: 'My Donations', icon: '🍱' },
    { path: '/donor/donations/new', label: 'Add Donation', icon: '➕' },
    { path: '/donor/requests', label: 'Requests', icon: '📩' },
    { path: '/donations', label: 'Browse All', icon: '🗺️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ],
  ngo: [
    { path: '/ngo', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/ngo/donations', label: 'Find Food', icon: '🔍' },
    { path: '/ngo/requests', label: 'My Requests', icon: '📋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ],
  orphanage: [
    { path: '/ngo', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/ngo/donations', label: 'Find Food', icon: '🔍' },
    { path: '/ngo/requests', label: 'My Requests', icon: '📋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ],
  oldagehome: [
    { path: '/ngo', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/ngo/donations', label: 'Find Food', icon: '🔍' },
    { path: '/ngo/requests', label: 'My Requests', icon: '📋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ],
  volunteer: [
    { path: '/volunteer', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/volunteer/pending', label: 'Available Deliveries', icon: '🚗' },
    { path: '/volunteer/deliveries', label: 'My Deliveries', icon: '📦' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ],
  admin: [
    { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/donations', label: 'Donations', icon: '🍱' },
    { path: '/admin/requests', label: 'Requests', icon: '📩' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
  ],
};

const ROLE_LABELS = {
  donor: 'Food Donor',
  ngo: 'NGO',
  orphanage: 'Orphanage',
  oldagehome: 'Old Age Home',
  volunteer: 'Volunteer',
  admin: 'Administrator',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = MENUS[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Food<span>Share</span></h2>
        <p>Reducing Food Waste</p>
      </div>

      <nav className="sidebar-nav">
        {menu.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="info">
            <div className="name">{user?.name}</div>
            <div className="role">{ROLE_LABELS[user?.role]}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </div>
  );
}
