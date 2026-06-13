import React, { useState } from 'react';
import Sidebar from '../components/Shared/Sidebar';
import Topbar from '../components/Shared/Topbar';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';

const ROLE_LABELS = {
  donor: 'Food Donor', ngo: 'NGO', orphanage: 'Orphanage',
  oldagehome: 'Old Age Home', volunteer: 'Volunteer', admin: 'Administrator'
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    address: user?.address || '', organization: user?.organization || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await updateProfile(form);
      setUser({ ...user, ...res.data });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="My Profile" />
        <div className="page-content">
          <div style={{ maxWidth: '600px' }}>
            {/* Profile header */}
            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#fff', fontWeight: '700', flexShrink: 0 }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{user?.name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span className="badge badge-green">{ROLE_LABELS[user?.role]}</span>
                    {user?.isVerified && <span className="badge badge-blue">✅ Verified</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit form */}
            <div className="card">
              <div className="card-header"><h3>Edit Profile</h3></div>
              <div className="card-body">
                {success && <div className="alert alert-success">✅ {success}</div>}
                {error && <div className="alert alert-error">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} required />
                  </div>

                  {user?.role !== 'volunteer' && user?.role !== 'admin' && (
                    <div className="form-group">
                      <label className="form-label">Organization Name</label>
                      <input type="text" name="organization" className="form-control" value={form.organization} onChange={handleChange} />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" value={user?.email} disabled style={{ background: '#f9f9f9', color: 'var(--text-muted)' }} />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-control" value={ROLE_LABELS[user?.role]} disabled style={{ background: '#f9f9f9', color: 'var(--text-muted)' }} />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
