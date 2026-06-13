import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getAllUsers, verifyUser, toggleUserStatus, deleteUser } from '../../utils/api';

const ROLE_COLORS = {
  donor: 'badge-orange', ngo: 'badge-green', orphanage: 'badge-green',
  oldagehome: 'badge-green', volunteer: 'badge-blue', admin: 'badge-red'
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleVerify = async (id) => {
    try {
      await verifyUser(id);
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: true } : u));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: res.data.isActive } : u));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="User Management" />
        <div className="page-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2>All Users ({users.length})</h2>
            <input className="form-control" style={{ maxWidth: '260px' }} placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="filters-bar">
            {['all', 'donor', 'ngo', 'orphanage', 'oldagehome', 'volunteer'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'oldagehome' ? 'Old Age Home' : f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && ` (${users.filter(u => u.role === f).length})`}
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
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Organization</th><th>Verified</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td style={{ fontSize: '0.82rem' }}>{u.email}</td>
                        <td><span className={`badge ${ROLE_COLORS[u.role] || 'badge-gray'}`}>{u.role === 'oldagehome' ? 'Old Age Home' : u.role}</span></td>
                        <td style={{ fontSize: '0.82rem' }}>{u.phone}</td>
                        <td style={{ fontSize: '0.82rem' }}>{u.organization || '—'}</td>
                        <td>
                          {u.isVerified
                            ? <span className="badge badge-green">✅ Verified</span>
                            : <span className="badge badge-orange">⏳ Pending</span>
                          }
                        </td>
                        <td>
                          {u.isActive
                            ? <span className="badge badge-green">Active</span>
                            : <span className="badge badge-red">Inactive</span>
                          }
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {!u.isVerified && (
                              <button className="btn btn-success btn-sm" onClick={() => handleVerify(u._id)}>Verify</button>
                            )}
                            <button className={`btn btn-sm ${u.isActive ? 'btn-outline' : 'btn-primary'}`} onClick={() => handleToggle(u._id)}>
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No users found</td></tr>
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
