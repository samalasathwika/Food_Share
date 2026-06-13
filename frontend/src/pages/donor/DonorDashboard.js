import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getMyDonations, getDonorRequests } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getMyDonations().then(r => setDonations(r.data)).catch(() => {});
    getDonorRequests().then(r => setRequests(r.data)).catch(() => {});
  }, []);

  const stats = {
    total: donations.length,
    active: donations.filter(d => d.status === 'available').length,
    delivered: donations.filter(d => d.status === 'delivered').length,
    pendingReqs: requests.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Donor Dashboard" />
        <div className="page-content">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Welcome back, {user?.name}! 👋</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.organization || 'Food Donor'}</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon orange">🍱</div>
              <div className="stat-info"><h3>{stats.total}</h3><p>Total Donations</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-info"><h3>{stats.active}</h3><p>Active Listings</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">🚗</div>
              <div className="stat-info"><h3>{stats.delivered}</h3><p>Delivered</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">📩</div>
              <div className="stat-info"><h3>{stats.pendingReqs}</h3><p>Pending Requests</p></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Quick actions */}
            <div className="card">
              <div className="card-header"><h3>Quick Actions</h3></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/donor/donations/new" className="btn btn-primary">➕ Add New Donation</Link>
                <Link to="/donor/requests" className="btn btn-outline">📩 View Requests ({stats.pendingReqs} pending)</Link>
                <Link to="/donor/donations" className="btn btn-outline">🍱 My Donations</Link>
              </div>
            </div>

            {/* Recent requests */}
            <div className="card">
              <div className="card-header"><h3>Recent Requests</h3><Link to="/donor/requests" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>View all</Link></div>
              <div className="card-body" style={{ padding: 0 }}>
                {requests.slice(0, 4).length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No requests yet</div>
                ) : requests.slice(0, 4).map(r => (
                  <div key={r._id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{r.ngo?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.donation?.title}</p>
                    </div>
                    <span className={`badge ${r.status === 'pending' ? 'badge-orange' : r.status === 'approved' ? 'badge-green' : 'badge-gray'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent donations */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3>Recent Donations</h3>
              <Link to="/donor/donations" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>View all</Link>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th><th>Category</th><th>Quantity</th><th>Status</th><th>Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 5).map(d => (
                    <tr key={d._id}>
                      <td><strong>{d.title}</strong></td>
                      <td>{d.category}</td>
                      <td>{d.quantity} {d.quantityUnit}</td>
                      <td><span className={`badge ${d.status === 'available' ? 'badge-green' : d.status === 'delivered' ? 'badge-blue' : 'badge-orange'}`}>{d.status}</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(d.expiryTime).toLocaleString()}</td>
                    </tr>
                  ))}
                  {donations.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No donations yet. <Link to="/donor/donations/new" style={{ color: 'var(--primary)' }}>Add your first!</Link></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
