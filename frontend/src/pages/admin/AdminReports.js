import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getAdminReports } from '../../utils/api';

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('donations');

  useEffect(() => {
    getAdminReports().then(r => setReports(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return alert('No data to export');
    const keys = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
    const csv = [keys.join(','), ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${filename}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const flatDonations = reports?.donations?.map(d => ({
    Title: d.title, Category: d.category, Quantity: `${d.quantity} ${d.quantityUnit}`,
    Status: d.status, Donor: d.donor?.name, Organization: d.donor?.organization,
    Expiry: new Date(d.expiryTime).toLocaleDateString(),
    Emergency: d.isEmergency ? 'Yes' : 'No',
    Created: new Date(d.createdAt).toLocaleDateString(),
  }));

  const flatRequests = reports?.requests?.map(r => ({
    Donation: r.donation?.title, Category: r.donation?.category,
    RequestedBy: r.ngo?.name, RequestedByEmail: r.ngo?.email,
    Donor: r.donor?.name, Status: r.status,
    NeedsDelivery: r.needsDelivery ? 'Yes' : 'No',
    Date: new Date(r.createdAt).toLocaleDateString(),
  }));

  const flatDeliveries = reports?.deliveries?.map(d => ({
    Donation: d.donation?.title, Volunteer: d.volunteer?.name,
    VolunteerEmail: d.volunteer?.email, PickupLocation: d.pickupLocation,
    DropLocation: d.dropLocation, Status: d.status,
    Date: new Date(d.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Reports" />
        <div className="page-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Platform Reports</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => downloadCSV(flatDonations, 'donations_report')}>⬇ Export Donations</button>
              <button className="btn btn-outline btn-sm" onClick={() => downloadCSV(flatRequests, 'requests_report')}>⬇ Export Requests</button>
              <button className="btn btn-outline btn-sm" onClick={() => downloadCSV(flatDeliveries, 'deliveries_report')}>⬇ Export Deliveries</button>
            </div>
          </div>

          {/* Summary cards */}
          {reports && (
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
              <div className="stat-card"><div className="stat-icon orange">🍱</div><div className="stat-info"><h3>{reports.donations?.length}</h3><p>Total Donations</p></div></div>
              <div className="stat-card"><div className="stat-icon green">📩</div><div className="stat-info"><h3>{reports.requests?.length}</h3><p>Total Requests</p></div></div>
              <div className="stat-card"><div className="stat-icon blue">🚗</div><div className="stat-info"><h3>{reports.deliveries?.length}</h3><p>Total Deliveries</p></div></div>
              <div className="stat-card"><div className="stat-icon purple">✅</div><div className="stat-info"><h3>{reports.deliveries?.filter(d => d.status === 'delivered').length}</h3><p>Completed Deliveries</p></div></div>
            </div>
          )}

          <div className="filters-bar">
            {['donations', 'requests', 'deliveries'].map(t => (
              <button key={t} className={`filter-chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div className="card">
              <div className="table-container">
                {tab === 'donations' && (
                  <table>
                    <thead><tr><th>Title</th><th>Category</th><th>Qty</th><th>Donor</th><th>Status</th><th>Emergency</th><th>Expiry</th></tr></thead>
                    <tbody>
                      {reports?.donations?.map(d => (
                        <tr key={d._id}>
                          <td><strong>{d.title}</strong></td>
                          <td>{d.category}</td>
                          <td>{d.quantity} {d.quantityUnit}</td>
                          <td style={{ fontSize: '0.82rem' }}>{d.donor?.organization || d.donor?.name}</td>
                          <td><span className={`badge ${d.status === 'available' ? 'badge-green' : d.status === 'delivered' ? 'badge-blue' : 'badge-orange'}`}>{d.status}</span></td>
                          <td>{d.isEmergency ? '🚨' : '—'}</td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(d.expiryTime).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {tab === 'requests' && (
                  <table>
                    <thead><tr><th>Donation</th><th>Requested By</th><th>Donor</th><th>Status</th><th>Delivery</th><th>Date</th></tr></thead>
                    <tbody>
                      {reports?.requests?.map(r => (
                        <tr key={r._id}>
                          <td><strong>{r.donation?.title}</strong></td>
                          <td style={{ fontSize: '0.82rem' }}>{r.ngo?.name}</td>
                          <td style={{ fontSize: '0.82rem' }}>{r.donor?.name}</td>
                          <td><span className={`badge ${r.status === 'approved' ? 'badge-green' : r.status === 'pending' ? 'badge-orange' : 'badge-red'}`}>{r.status}</span></td>
                          <td>{r.needsDelivery ? '🚗 Yes' : '—'}</td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {tab === 'deliveries' && (
                  <table>
                    <thead><tr><th>Donation</th><th>Volunteer</th><th>Pickup</th><th>Drop</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {reports?.deliveries?.map(d => (
                        <tr key={d._id}>
                          <td><strong>{d.donation?.title}</strong></td>
                          <td style={{ fontSize: '0.82rem' }}>{d.volunteer?.name || '—'}</td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.pickupLocation}</td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.dropLocation}</td>
                          <td><span className={`badge ${d.status === 'delivered' ? 'badge-green' : d.status === 'pending' ? 'badge-gray' : 'badge-blue'}`}>{d.status}</span></td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {reports?.deliveries?.length === 0 && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No deliveries yet</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
