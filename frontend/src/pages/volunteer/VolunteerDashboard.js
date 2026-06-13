import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getPendingDeliveries, getMyDeliveries } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);

  useEffect(() => {
    getPendingDeliveries().then(r => setPending(r.data)).catch(() => {});
    getMyDeliveries().then(r => setMyDeliveries(r.data)).catch(() => {});
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Volunteer Dashboard" />
        <div className="page-content">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Welcome, {user?.name}! 🚗</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ready to help deliver food today?</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon orange">🔔</div>
              <div className="stat-info"><h3>{pending.length}</h3><p>Available Deliveries</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-info"><h3>{myDeliveries.filter(d => d.status === 'delivered').length}</h3><p>Completed</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">🚗</div>
              <div className="stat-info"><h3>{myDeliveries.filter(d => d.status === 'accepted' || d.status === 'picked_up' || d.status === 'in_transit').length}</h3><p>In Progress</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">📦</div>
              <div className="stat-info"><h3>{myDeliveries.length}</h3><p>Total Deliveries</p></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card">
              <div className="card-header"><h3>Quick Actions</h3></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/volunteer/pending" className="btn btn-primary">🔍 Browse Available Deliveries ({pending.length})</Link>
                <Link to="/volunteer/deliveries" className="btn btn-outline">📦 My Deliveries</Link>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3>Recent Deliveries</h3><Link to="/volunteer/deliveries" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>View all</Link></div>
              <div className="card-body" style={{ padding: 0 }}>
                {myDeliveries.slice(0, 4).length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No deliveries yet</div>
                ) : myDeliveries.slice(0, 4).map(d => (
                  <div key={d._id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{d.donation?.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.pickupLocation}</p>
                    </div>
                    <span className={`badge ${d.status === 'delivered' ? 'badge-green' : d.status === 'accepted' ? 'badge-blue' : 'badge-orange'}`}>{d.status}</span>
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
