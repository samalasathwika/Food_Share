import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Redirect based on role
      const routes = { admin: '/admin', donor: '/donor', ngo: '/ngo', orphanage: '/ngo', oldagehome: '/ngo', volunteer: '/volunteer' };
      navigate(routes[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Welcome Back to FoodShare</h1>
        <p>Together we can end food waste and hunger — one meal at a time.</p>
        <div className="auth-feature">
          <div className="auth-feature-item"><span className="dot"/><span>Donors list surplus food in seconds</span></div>
          <div className="auth-feature-item"><span className="dot"/><span>NGOs & shelters request what they need</span></div>
          <div className="auth-feature-item"><span className="dot"/><span>Volunteers ensure safe delivery</span></div>
          <div className="auth-feature-item"><span className="dot"/><span>Real-time tracking & QR verification</span></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <h2>Sign in</h2>
          <p className="subtitle">Don't have an account? <Link to="/register">Create one</Link></p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" name="email" className="form-control"
                placeholder="you@example.com" value={form.email}
                onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" name="password" className="form-control"
                placeholder="Enter your password" value={form.password}
                onChange={handleChange} required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
