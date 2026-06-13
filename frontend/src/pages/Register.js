import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'donor', label: '🏪 Food Donor', desc: 'Restaurant, hotel, canteen, bakery or event venue' },
  { value: 'ngo', label: '🤝 NGO', desc: 'Non-governmental organization providing food assistance' },
  { value: 'orphanage', label: '🏠 Orphanage', desc: 'Child care facility needing food support' },
  { value: 'oldagehome', label: '👴 Old Age Home', desc: 'Senior care facility needing food support' },
  { value: 'volunteer', label: '🚗 Volunteer', desc: 'Help deliver food from donors to recipients' },
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: '', phone: '', address: '', organization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (!form.role) return setError('Please select a role');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      const routes = { donor: '/donor', ngo: '/ngo', orphanage: '/ngo', oldagehome: '/ngo', volunteer: '/volunteer' };
      navigate(routes[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Join FoodShare</h1>
        <p>Be part of the movement that turns surplus food into meals for those in need.</p>
        <div className="auth-feature">
          {ROLES.map(r => (
            <div key={r.value} className="auth-feature-item">
              <span className="dot"/>
              <span><strong>{r.label}</strong> — {r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <h2>Create account</h2>
          <p className="subtitle">Already have one? <Link to="/login">Sign in</Link></p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {ROLES.map(r => (
                  <div
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    style={{
                      padding: '10px 12px',
                      border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      background: form.role === r.value ? '#f0faf3' : '#fff',
                      fontSize: '0.82rem',
                      transition: 'all 0.2s',
                      fontWeight: form.role === r.value ? '600' : '400',
                    }}
                  >
                    {r.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" name="name" className="form-control" placeholder="Your name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input type="tel" name="phone" className="form-control" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <input type="text" name="address" className="form-control" placeholder="Your full address" value={form.address} onChange={handleChange} required />
            </div>

            {(form.role === 'donor' || form.role === 'ngo' || form.role === 'orphanage' || form.role === 'oldagehome') && (
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input type="text" name="organization" className="form-control" placeholder="Restaurant / NGO / Home name" value={form.organization} onChange={handleChange} />
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input type="password" name="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input type="password" name="confirmPassword" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
