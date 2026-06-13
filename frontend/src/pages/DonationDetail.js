import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonationById } from '../utils/api';

export default function DonationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDonationById(id)
      .then(res => setDonation(res.data))
      .catch(() => navigate('/donations'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner"/></div>;
  if (!donation) return null;

  const expiry = new Date(donation.expiryTime);
  const now = new Date();
  const hoursLeft = ((expiry - now) / 3600000).toFixed(1);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>← Back</button>

      <div className="card">
        {donation.image && (
          <img src={`http://localhost:5000/${donation.image}`} alt={donation.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
        )}
        <div className="card-body">
          {donation.isEmergency && <span className="badge badge-emergency" style={{ marginBottom: '12px' }}>🚨 Emergency Request</span>}

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '12px' }}>{donation.title}</h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            <span className="badge badge-green">{donation.category}</span>
            <span className="badge badge-blue">{donation.quantity} {donation.quantityUnit}</span>
            <span className="badge badge-gray">{donation.status}</span>
          </div>

          {donation.description && <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.7' }}>{donation.description}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '20px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Donor</p>
              <p style={{ fontWeight: '600' }}>{donation.donor?.organization || donation.donor?.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{donation.donor?.phone}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Pickup Location</p>
              <p style={{ fontWeight: '600' }}>{donation.pickupAddress}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Expiry Time</p>
              <p style={{ fontWeight: '600', color: hoursLeft < 3 ? 'var(--danger)' : hoursLeft < 12 ? 'var(--warning)' : 'var(--success)' }}>
                {expiry.toLocaleString()} ({hoursLeft > 0 ? `${hoursLeft}h remaining` : 'Expired'})
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Priority</p>
              <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>{donation.priorityLevel}</p>
            </div>
          </div>

          {donation.qrCode && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>QR Code for verification</p>
              <img src={donation.qrCode} alt="QR Code" style={{ width: '160px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
