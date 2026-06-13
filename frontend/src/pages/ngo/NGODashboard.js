import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getMyRequests, getDonations } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function NGODashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    getMyRequests().then(r => setRequests(r.data)).catch(() => {});
    getDonations({ status: 'available' }).then(r => setDonations(r.data)).catch(() => {});
  }, []);

  const ROLE_LABEL = { ngo: 'NGO', orphanage: 'Orphanage', oldagehome: 'Old Age Home' };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Dashboard" />
        <div className="page-content">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Welcome, {user?.name}! 👋</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.organization} — {ROLE_LABEL[user?.role]}</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon green">🍽️</div>
              <div className="stat-info"><h3>{donations.length}</h3><p>Available Donations</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">📋</div>
              <div className="stat-info"><h3>{requests.filter(r => r.status === 'pending').length}</h3><p>Pending Requests</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">✅</div>
              <div className="stat-info"><h3>{requests.filter(r => r.status === 'approved').length}</h3><p>Approved</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">🚗</div>
              <div className="stat-info"><h3>{requests.filter(r => r.status === 'completed').length}</h3><p>Received</p></div>
            </div>
          </div>

          {/* Emergency donations */}
          {donations.filter(d => d.isEmergency).length > 0 && (
            <div className="card" style={{ marginBottom: '20px', borderColor: 'var(--emergency)', borderWidth: '2px' }}>
              <div className="card-header" style={{ background: '#fff5f5' }}>
                <h3 style={{ color: 'var(--danger)' }}>🚨 Emergency Donations — Act Fast!</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {donations.filter(d => d.isEmergency).slice(0, 3).map(d => (
                  <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fff5f5', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{d.title}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}>{d.quantity} {d.quantityUnit} · {d.donor?.organization}</span>
                    </div>
                    <Link to={`/donations/${d._id}`} className="btn btn-danger btn-sm">Request Now</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card">
              <div className="card-header"><h3>Quick Actions</h3></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/ngo/donations" className="btn btn-primary">🔍 Browse Available Food</Link>
                <Link to="/ngo/requests" className="btn btn-outline">📋 My Requests</Link>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3>Recent Requests</h3><Link to="/ngo/requests" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>View all</Link></div>
              <div className="card-body" style={{ padding: 0 }}>
                {requests.slice(0, 4).length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No requests yet</div>
                ) : requests.slice(0, 4).map(r => (
                  <div key={r._id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{r.donation?.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.donor?.name}</p>
                    </div>
                    <span className={`badge ${r.status === 'pending' ? 'badge-orange' : r.status === 'approved' ? 'badge-green' : 'badge-gray'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
