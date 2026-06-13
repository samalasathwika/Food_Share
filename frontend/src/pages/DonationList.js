import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDonations } from '../utils/api';
import DonationCard from '../components/Shared/DonationCard';

const CATEGORIES = ['All', 'Vegetarian', 'Non-Vegetarian', 'Bakery Items', 'Fruits', 'Vegetables', 'Dairy Products', 'Beverages', 'Packed Food'];

export default function DonationList() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [emergency, setEmergency] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, [category, emergency]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (emergency) params.emergency = 'true';
      const res = await getDonations(params);
      setDonations(res.data);
    } catch {} finally { setLoading(false); }
  };

  const filtered = donations.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.donor?.organization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background: 'var(--primary-dark)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '700' }}>Food<span style={{ color: '#ffb347' }}>Share</span></Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login" className="btn btn-outline-white btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-white btn-sm">Register</Link>
        </div>
      </nav>

      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '6px' }}>Available Food Donations</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse surplus food available near you</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            className="form-control"
            style={{ maxWidth: '300px' }}
            placeholder="🔍 Search donations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className={`btn ${emergency ? 'btn-danger' : 'btn-outline'}`}
            onClick={() => setEmergency(!emergency)}
          >
            🚨 Emergency Only
          </button>
        </div>

        <div className="filters-bar">
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"/><span>Loading donations...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🍽️</div>
            <h3>No donations found</h3>
            <p>Check back soon or adjust your filters</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>{filtered.length} donations available</p>
            <div className="donation-grid">
              {filtered.map(d => <DonationCard key={d._id} donation={d} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
