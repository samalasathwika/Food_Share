import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ICONS = {
  'Vegetarian': '🥗', 'Non-Vegetarian': '🍗', 'Bakery Items': '🍞',
  'Fruits': '🍎', 'Vegetables': '🥦', 'Dairy Products': '🧀',
  'Beverages': '🥤', 'Packed Food': '📦',
};

function getExpiryInfo(expiryTime) {
  const now = new Date();
  const exp = new Date(expiryTime);
  const diff = (exp - now) / (1000 * 60 * 60); // hours

  if (diff < 0) return { label: 'Expired', cls: 'expiry-urgent', dot: '🔴' };
  if (diff < 3) return { label: `${Math.round(diff * 60)} min left`, cls: 'expiry-urgent', dot: '🔴' };
  if (diff < 12) return { label: `${Math.round(diff)}h left`, cls: 'expiry-soon', dot: '🟡' };
  return { label: `${Math.round(diff)}h left`, cls: 'expiry-fresh', dot: '🟢' };
}

export default function DonationCard({ donation, onRequest, showRequestBtn }) {
  const navigate = useNavigate();
  const expiry = getExpiryInfo(donation.expiryTime);
  const icon = CATEGORY_ICONS[donation.category] || '🍽️';

  return (
    <div className={`donation-card ${donation.isEmergency ? 'emergency' : ''}`}>
      <div className="donation-img">
        {donation.image
          ? <img src={`http://localhost:5000/${donation.image}`} alt={donation.title} onError={e => { e.target.style.display = 'none'; }}/>
          : <span>{icon}</span>
        }
      </div>
      <div className="donation-body">
        {donation.isEmergency && (
          <span className="badge badge-emergency" style={{ marginBottom: '8px' }}>🚨 Emergency</span>
        )}
        <div className="donation-title">{donation.title}</div>
        <div className="donation-meta">
          <span className="badge badge-green">{donation.category}</span>
          <span className="badge badge-blue">{donation.quantity} {donation.quantityUnit || 'kg'}</span>
          <span className="badge badge-gray">{donation.status}</span>
        </div>
        {donation.donor && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            📍 {donation.donor.organization || donation.donor.name}
          </div>
        )}
        <div className="donation-footer">
          <span className={`expiry-indicator ${expiry.cls}`}>
            {expiry.dot} {expiry.label}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/donations/${donation._id}`)}>
              View
            </button>
            {showRequestBtn && donation.status === 'available' && (
              <button className="btn btn-primary btn-sm" onClick={() => onRequest(donation)}>
                Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
