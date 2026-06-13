import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getDonorRequests, approveRequest, rejectRequest } from '../../utils/api';

export default function DonorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await getDonorRequests();
      setRequests(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      setRequests(requests.map(r => r._id === id ? { ...r, status: 'approved' } : r));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this request?')) return;
    try {
      await rejectRequest(id);
      setRequests(requests.map(r => r._id === id ? { ...r, status: 'rejected' } : r));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Food Requests" />
        <div className="page-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Incoming Requests ({requests.filter(r => r.status === 'pending').length} pending)</h2>
          </div>

          <div className="filters-bar">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="icon">📩</div><h3>No requests found</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filtered.map(r => (
                <div key={r._id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '1rem' }}>{r.ngo?.name || r.ngo?.organization}</h3>
                          <span className={`badge ${r.status === 'pending' ? 'badge-orange' : r.status === 'approved' ? 'badge-green' : 'badge-red'}`}>{r.status}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          📦 Requesting: <strong>{r.donation?.title}</strong> — {r.donation?.category}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          📞 {r.ngo?.phone} &nbsp; 📍 {r.ngo?.address}
                        </p>
                        {r.message && (
                          <p style={{ fontSize: '0.82rem', background: 'var(--bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginTop: '8px', borderLeft: '3px solid var(--primary)' }}>
                            "{r.message}"
                          </p>
                        )}
                        {r.needsDelivery && (
                          <span className="badge badge-blue" style={{ marginTop: '8px' }}>🚗 Needs Delivery</span>
                        )}
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                          Requested {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {r.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleApprove(r._id)}>✅ Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(r._id)}>❌ Reject</button>
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
