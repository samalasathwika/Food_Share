import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getMyDeliveries, updateDeliveryStatus } from '../../utils/api';

const STATUS_FLOW = {
  accepted: { next: 'picked_up', label: '📦 Mark as Picked Up', badge: 'badge-blue' },
  picked_up: { next: 'in_transit', label: '🚗 Mark In Transit', badge: 'badge-orange' },
  in_transit: { next: 'delivered', label: '✅ Mark as Delivered', badge: 'badge-orange' },
  delivered: { next: null, label: 'Delivered', badge: 'badge-green' },
  pending: { next: null, label: 'Pending Volunteer', badge: 'badge-gray' },
};

export default function VolunteerDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchDeliveries(); }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await getMyDeliveries();
      setDeliveries(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, nextStatus) => {
    try {
      await updateDeliveryStatus(id, { status: nextStatus });
      setDeliveries(deliveries.map(d => d._id === id ? { ...d, status: nextStatus } : d));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filtered = filter === 'all' ? deliveries : deliveries.filter(d => d.status === filter);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="My Deliveries" />
        <div className="page-content">
          <h2 style={{ marginBottom: '20px' }}>My Deliveries</h2>

          <div className="filters-bar">
            {['all', 'accepted', 'picked_up', 'in_transit', 'delivered'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="icon">📦</div><h3>No deliveries</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filtered.map(d => {
                const sf = STATUS_FLOW[d.status] || STATUS_FLOW.pending;
                return (
                  <div key={d._id} className="card">
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '1rem' }}>{d.donation?.title}</h3>
                            <span className={`badge ${sf.badge}`}>{d.status.replace('_', ' ')}</span>
                          </div>

                          {/* Delivery timeline */}
                          <div className="delivery-timeline">
                            {[
                              { label: 'Accepted', done: ['accepted','picked_up','in_transit','delivered'].includes(d.status), icon: '✅' },
                              { label: 'Picked Up', done: ['picked_up','in_transit','delivered'].includes(d.status), icon: '📦' },
                              { label: 'In Transit', done: ['in_transit','delivered'].includes(d.status), icon: '🚗' },
                              { label: 'Delivered', done: d.status === 'delivered', icon: '🏠' },
                            ].map((step, i) => (
                              <div key={i} className="timeline-step">
                                <div className={`timeline-dot ${step.done ? 'done' : ''}`}>{step.icon}</div>
                                <div className="timeline-info">
                                  <h4>{step.label}</h4>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
                            <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
                              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>📍 PICKUP</p>
                              <p style={{ fontSize: '0.82rem', fontWeight: '600' }}>{d.pickupLocation}</p>
                            </div>
                            <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
                              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>🏠 DROP</p>
                              <p style={{ fontSize: '0.82rem', fontWeight: '600' }}>{d.dropLocation}</p>
                            </div>
                          </div>
                        </div>

                        {sf.next && (
                          <button className="btn btn-primary" onClick={() => handleStatusUpdate(d._id, sf.next)}>
                            {sf.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
