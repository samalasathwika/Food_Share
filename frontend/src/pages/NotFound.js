import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '6rem', marginBottom: '16px' }}>🍽️</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--primary)', marginBottom: '10px' }}>404</h1>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Page not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
      </div>
    </div>
  );
}
