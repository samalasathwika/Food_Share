import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicStats } from '../utils/api';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getPublicStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  const getDashboardRoute = () => {
    const routes = { admin: '/admin', donor: '/donor', ngo: '/ngo', orphanage: '/ngo', oldagehome: '/ngo', volunteer: '/volunteer' };
    return routes[user?.role] || '/donations';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{ background: 'rgba(27,67,50,0.97)', padding: '14px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <h2 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
          Food<span style={{ color: '#ffb347' }}>Share</span>
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/donations" className="btn btn-outline-white btn-sm">Browse Food</Link>
          {user
            ? <button className="btn btn-white btn-sm" onClick={() => navigate(getDashboardRoute())}>Dashboard →</button>
            : <>
                <Link to="/login" className="btn btn-outline-white btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-white btn-sm">Join Now</Link>
              </>
          }
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <h1>Food for Everyone,<br/>Waste for No One</h1>
        <p>FoodShare connects surplus food from restaurants, hotels & canteens with NGOs, orphanages, and shelters — ensuring every meal reaches those who need it most.</p>
        <div className="hero-btns">
          <Link to="/donations" className="btn btn-white btn-lg">🗺️ Browse Donations</Link>
          {!user && <Link to="/register" className="btn btn-outline-white btn-lg">Get Started Free</Link>}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ background: '#fff', padding: '40px 60px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '28px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            {[
              { label: 'Total Donations', value: stats.totalDonations, icon: '🍱' },
              { label: 'Meals Served', value: stats.mealsServed?.toLocaleString(), icon: '🍽️' },
              { label: 'Food Saved (kg)', value: stats.foodSavedKg, icon: '⚖️' },
              { label: 'Active NGOs', value: stats.activeNGOs, icon: '🏢' },
              { label: 'Volunteers', value: stats.activeVolunteers, icon: '🙌' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--primary)' }}>{s.value || 0}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div style={{ padding: '60px', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '10px' }}>How FoodShare Works</h2>
          <p style={{ color: 'var(--text-muted)' }}>Simple steps to reduce food waste and feed communities</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { step: '1', icon: '🏪', title: 'Donor Lists Food', desc: 'Restaurants & hotels post surplus food with quantity, category, and expiry time.' },
            { step: '2', icon: '🤝', title: 'NGO Requests', desc: 'NGOs, orphanages, and shelters browse and request available donations.' },
            { step: '3', icon: '✅', title: 'Donor Approves', desc: 'The donor reviews and approves the request for pickup or delivery.' },
            { step: '4', icon: '🚗', title: 'Volunteer Delivers', desc: 'Volunteers pick up and deliver food with QR code verification.' },
          ].map(item => (
            <div key={item.step} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '28px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', margin: '0 auto 16px', fontSize: '1rem' }}>{item.step}</div>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div style={{ background: 'var(--primary)', color: '#fff', padding: '60px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '14px' }}>Ready to Make a Difference?</h2>
          <p style={{ opacity: 0.85, marginBottom: '28px', fontSize: '1rem' }}>Join thousands of donors, NGOs, and volunteers already on FoodShare</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-white btn-lg">Register Now</Link>
            <Link to="/login" className="btn btn-outline-white btn-lg">Sign In</Link>
          </div>
        </div>
      )}

      <footer style={{ background: 'var(--primary-dark)', color: 'rgba(255,255,255,0.5)', padding: '24px 60px', textAlign: 'center', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} FoodShare — Reducing Food Waste, Feeding Communities
      </footer>
    </div>
  );
}
