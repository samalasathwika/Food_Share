import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import DonationCard from '../../components/Shared/DonationCard';
import { getDonations, createRequest } from '../../utils/api';

const CATEGORIES = ['All', 'Vegetarian', 'Non-Vegetarian', 'Bakery Items', 'Fruits', 'Vegetables', 'Dairy Products', 'Beverages', 'Packed Food'];

export default function NGODonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [emergency, setEmergency] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reqForm, setReqForm] = useState({ message: '', needsDelivery: false });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchDonations(); }, [category, emergency]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = { status: 'available' };
      if (category !== 'All') params.category = category;
      if (emergency) params.emergency = 'true';
      const res = await getDonations(params);
      setDonations(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createRequest({ donationId: selected._id, ...reqForm });
      setSuccess(`Request sent for "${selected.title}"!`);
      setSelected(null);
      fetchDonations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally { setSubmitting(false); }
  };

  const filtered = donations.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.donor?.organization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Find Food" />
        <div className="page-content">
          {success && <div className="alert alert-success">✅ {success}</div>}

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input className="form-control" style={{ maxWidth: '280px' }} placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className={`btn ${emergency ? 'btn-danger' : 'btn-outline'}`} onClick={() => setEmergency(!emergency)}>
              🚨 Emergency Only
            </button>
          </div>

          <div className="filters-bar">
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="icon">🍽️</div><h3>No donations available</h3><p>Check back soon!</p></div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>{filtered.length} donations available</p>
              <div className="donation-grid">
                {filtered.map(d => (
                  <DonationCard key={d._id} donation={d} showRequestBtn={true} onRequest={setSelected} />
                ))}
              </div>
            </>
          )}

          {/* Request Modal */}
          {selected && (
            <div className="modal-overlay" onClick={() => setSelected(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Request Food Donation</h3>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>×</button>
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-error">⚠️ {error}</div>}
                  <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: '16px' }}>
                    <strong>{selected.title}</strong>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {selected.quantity} {selected.quantityUnit} · {selected.category} · From {selected.donor?.organization || selected.donor?.name}
                    </p>
                  </div>
                  <form onSubmit={handleRequest}>
                    <div className="form-group">
                      <label className="form-label">Message to Donor (optional)</label>
                      <textarea className="form-control" rows={3} placeholder="Explain your need or provide any special instructions..."
                        value={reqForm.message} onChange={e => setReqForm({ ...reqForm, message: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" id="needsDelivery" checked={reqForm.needsDelivery}
                        onChange={e => setReqForm({ ...reqForm, needsDelivery: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <label htmlFor="needsDelivery" style={{ cursor: 'pointer', fontWeight: '600' }}>
                        🚗 We need volunteer delivery (we cannot pick up ourselves)
                      </label>
                    </div>
                    <div className="modal-footer" style={{ padding: '0', marginTop: '16px' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Sending...' : '📩 Send Request'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
