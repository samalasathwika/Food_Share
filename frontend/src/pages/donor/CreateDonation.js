import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { createDonation } from '../../utils/api';

const CATEGORIES = ['Vegetarian', 'Non-Vegetarian', 'Bakery Items', 'Fruits', 'Vegetables', 'Dairy Products', 'Beverages', 'Packed Food'];

export default function CreateDonation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: '', quantity: '',
    quantityUnit: 'kg', expiryTime: '', pickupAddress: '',
    priorityLevel: 'medium', servingsEstimate: '', isEmergency: false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append('image', image);
      await createDonation(data);
      navigate('/donor/donations');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Add New Donation" />
        <div className="page-content">
          <div style={{ maxWidth: '700px' }}>
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <div className="card">
              <div className="card-header">
                <h3>🍱 Donation Details</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Food Title *</label>
                    <input type="text" name="title" className="form-control" placeholder="e.g., Biryani, Vegetable Curry" value={form.title} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" placeholder="Brief description of the food..." value={form.description} onChange={handleChange} rows={3} />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select name="category" className="form-control" value={form.category} onChange={handleChange} required>
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Priority Level</label>
                      <select name="priorityLevel" className="form-control" value={form.priorityLevel} onChange={handleChange}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Quantity *</label>
                      <input type="text" name="quantity" className="form-control" placeholder="e.g., 10" value={form.quantity} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit</label>
                      <select name="quantityUnit" className="form-control" value={form.quantityUnit} onChange={handleChange}>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="litres">Litres</option>
                        <option value="packets">Packets</option>
                        <option value="servings">Servings</option>
                        <option value="boxes">Boxes</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Expiry Date & Time *</label>
                      <input type="datetime-local" name="expiryTime" className="form-control" value={form.expiryTime} onChange={handleChange} required min={new Date().toISOString().slice(0,16)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estimated Servings</label>
                      <input type="number" name="servingsEstimate" className="form-control" placeholder="How many people it can feed" value={form.servingsEstimate} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pickup Address *</label>
                    <input type="text" name="pickupAddress" className="form-control" placeholder="Full pickup address" value={form.pickupAddress} onChange={handleChange} required />
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" name="isEmergency" id="isEmergency" checked={form.isEmergency} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <label htmlFor="isEmergency" style={{ cursor: 'pointer', fontWeight: '600', color: 'var(--danger)' }}>
                      🚨 Mark as Emergency (urgent pickup required)
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Food Image</label>
                    <input type="file" accept="image/*" className="form-control" onChange={handleImage} />
                    {preview && (
                      <img src={preview} alt="Preview" style={{ marginTop: '10px', width: '200px', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? 'Publishing...' : '🍱 Publish Donation'}
                    </button>
                    <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/donor/donations')}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
