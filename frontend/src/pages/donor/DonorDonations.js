import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getMyDonations, deleteDonation } from '../../utils/api';

export default function DonorDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await getMyDonations();
      setDonations(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donation?')) return;
    try {
      await deleteDonation(id);
      setDonations(donations.filter(d => d._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="My Donations" />
        <div className="page-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>My Donations ({donations.length})</h2>
            <Link to="/donor/donations/new" className="btn btn-primary">➕ Add Donation</Link>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner"/></div>
          ) : donations.length === 0 ? (
            <div className="empty-state card" style={{ padding: '60px' }}>
              <div className="icon">🍱</div>
              <h3>No donations yet</h3>
              <p>Start sharing food with those in need</p>
              <Link to="/donor/donations/new" className="btn btn-primary" style={{ marginTop: '16px' }}>Add First Donation</Link>
            </div>
          ) : (
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Food Item</th><th>Category</th><th>Quantity</th><th>Expiry</th><th>Status</th><th>Priority</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d._id}>
                        <td>
                          <strong>{d.title}</strong>
                          {d.isEmergency && <span className="badge badge-emergency" style={{ marginLeft: '8px' }}>Emergency</span>}
                        </td>
                        <td>{d.category}</td>
                        <td>{d.quantity} {d.quantityUnit}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(d.expiryTime).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${
                            d.status === 'available' ? 'badge-green' :
                            d.status === 'delivered' ? 'badge-blue' :
                            d.status === 'requested' ? 'badge-orange' : 'badge-gray'
                          }`}>{d.status}</span>
                        </td>
                        <td><span className={`badge ${d.priorityLevel === 'emergency' ? 'badge-red' : d.priorityLevel === 'high' ? 'badge-orange' : 'badge-gray'}`}>{d.priorityLevel}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <Link to={`/donations/${d._id}`} className="btn btn-outline btn-sm">View</Link>
                            {(d.status === 'available' || d.status === 'requested') && (
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}>Delete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
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
