import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getAllDonationsAdmin, deleteDonation } from '../../utils/api';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchDonations(); }, []);

  const fetchDonations = async () => {
    try {
      const res = await getAllDonationsAdmin();
      setDonations(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donation?')) return;
    try {
      await deleteDonation(id);
      setDonations(donations.filter(d => d._id !== id));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const filtered = donations.filter(d => {
    const matchStatus = filter === 'all' || d.status === filter;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.donor?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="All Donations" />
        <div className="page-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2>All Donations ({donations.length})</h2>
            <input className="form-control" style={{ maxWidth: '260px' }} placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="filters-bar">
            {['all', 'available', 'requested', 'approved', 'delivered', 'expired'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
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
                    <tr><th>Title</th><th>Donor</th><th>Category</th><th>Quantity</th><th>Status</th><th>Emergency</th><th>Expiry</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(d => (
                      <tr key={d._id}>
                        <td><strong>{d.title}</strong></td>
                        <td style={{ fontSize: '0.82rem' }}>{d.donor?.organization || d.donor?.name}</td>
                        <td>{d.category}</td>
                        <td>{d.quantity} {d.quantityUnit}</td>
                        <td>
                          <span className={`badge ${d.status === 'available' ? 'badge-green' : d.status === 'delivered' ? 'badge-blue' : d.status === 'expired' ? 'badge-red' : 'badge-orange'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td>{d.isEmergency ? <span className="badge badge-red">🚨 Yes</span> : '—'}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(d.expiryTime).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No donations found</td></tr>
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
