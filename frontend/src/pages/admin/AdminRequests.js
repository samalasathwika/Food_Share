import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getAllRequestsAdmin } from '../../utils/api';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllRequestsAdmin().then(r => setRequests(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="All Requests" />
        <div className="page-content">
          <h2 style={{ marginBottom: '20px' }}>All Food Requests ({requests.length})</h2>

          <div className="filters-bar">
            {['all', 'pending', 'approved', 'rejected', 'completed'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? requests.length : requests.filter(r => r.status === f).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Donation</th><th>Category</th><th>Requested By</th><th>Donor</th><th>Delivery?</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r._id}>
                        <td><strong>{r.donation?.title || 'N/A'}</strong></td>
                        <td><span className="badge badge-green">{r.donation?.category}</span></td>
                        <td style={{ fontSize: '0.82rem' }}>{r.ngo?.name} <span style={{ color: 'var(--text-muted)' }}>{r.ngo?.email}</span></td>
                        <td style={{ fontSize: '0.82rem' }}>{r.donor?.name}</td>
                        <td>{r.needsDelivery ? <span className="badge badge-blue">🚗 Yes</span> : '—'}</td>
                        <td>
                          <span className={`badge ${r.status === 'pending' ? 'badge-orange' : r.status === 'approved' ? 'badge-green' : r.status === 'rejected' ? 'badge-red' : 'badge-blue'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No requests found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
