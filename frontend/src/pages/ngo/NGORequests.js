import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getMyRequests } from '../../utils/api';

export default function NGORequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMyRequests().then(r => setRequests(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const STATUS_BADGE = {
    pending: 'badge-orange', approved: 'badge-green',
    rejected: 'badge-red', completed: 'badge-blue', cancelled: 'badge-gray'
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="My Requests" />
        <div className="page-content">
          <h2 style={{ marginBottom: '20px' }}>My Food Requests</h2>

          <div className="filters-bar">
            {['all', 'pending', 'approved', 'rejected', 'completed'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && ` (${requests.filter(r => r.status === f).length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="icon">📋</div><h3>No requests found</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filtered.map(r => (
                <div key={r._id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '1rem' }}>{r.donation?.title}</h3>
                          <span className={`badge ${STATUS_BADGE[r.status] || 'badge-gray'}`}>{r.status}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          🏪 Donor: <strong>{r.donor?.organization || r.donor?.name}</strong> — {r.donor?.phone}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          📦 Category: {r.donation?.category} &nbsp;|&nbsp;
                          {r.needsDelivery ? '🚗 Delivery Requested' : '🏃 Self Pickup'}
                        </p>
                        {r.message && (
                          <p style={{ fontSize: '0.82rem', background: 'var(--bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginTop: '8px' }}>
                            Your note: "{r.message}"
                          </p>
                        )}
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                          Requested on {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {r.status === 'approved' && (
                        <div style={{ background: '#e8f5e9', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '0.85rem' }}>
                          <strong style={{ color: 'var(--success)' }}>✅ Approved!</strong>
                          <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                            Pickup: {r.donation?.pickupAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
