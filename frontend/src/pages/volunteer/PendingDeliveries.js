import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getPendingDeliveries, acceptDelivery } from '../../utils/api';

export default function PendingDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDeliveries(); }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await getPendingDeliveries();
      setDeliveries(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleAccept = async (id) => {
    try {
      await acceptDelivery(id);
      setDeliveries(deliveries.filter(d => d._id !== id));
      alert('Delivery accepted! Check "My Deliveries" for details.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Available Deliveries" />
        <div className="page-content">
          <h2 style={{ marginBottom: '20px' }}>Available Deliveries ({deliveries.length})</h2>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : deliveries.length === 0 ? (
            <div className="empty-state"><div className="icon">🚗</div><h3>No deliveries available</h3><p>Check back soon!</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {deliveries.map(d => (
                <div key={d._id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>
                          {d.donation?.title}
                          <span className="badge badge-orange" style={{ marginLeft: '10px' }}>Needs Pickup</span>
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>📍 Pickup From</p>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{d.donation?.donor?.name || 'Donor'}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.pickupLocation}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📞 {d.donation?.donor?.phone}</p>
                          </div>
                          <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>🏠 Drop To</p>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{d.request?.ngo?.name || 'Recipient'}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.dropLocation}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📞 {d.request?.ngo?.phone}</p>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                          Posted {new Date(d.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <button className="btn btn-primary" onClick={() => handleAccept(d._id)}>
                        🚗 Accept Delivery
                      </button>
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
