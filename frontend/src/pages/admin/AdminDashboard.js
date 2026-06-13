import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Shared/Sidebar';
import Topbar from '../../components/Shared/Topbar';
import { getAdminDashboard } from '../../utils/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend, LineElement, PointElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, LineElement, PointElement);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content"><div className="loading"><div className="spinner" /></div></div>
    </div>
  );

  const monthlyChartData = {
    labels: stats?.monthlyData?.map(m => MONTHS[m._id.month - 1]) || [],
    datasets: [{
      label: 'Donations',
      data: stats?.monthlyData?.map(m => m.count) || [],
      backgroundColor: 'rgba(45,106,79,0.7)',
      borderColor: 'rgba(45,106,79,1)',
      borderWidth: 2,
      borderRadius: 6,
    }]
  };

  const categoryChartData = {
    labels: stats?.categoryData?.map(c => c._id) || [],
    datasets: [{
      data: stats?.categoryData?.map(c => c.count) || [],
      backgroundColor: ['#2d6a4f','#52b788','#f77f00','#ffb347','#d62828','#2196f3','#9c27b0','#795548'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Admin Dashboard" />
        <div className="page-content">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Platform Overview</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>FoodShare Administration Panel</p>
          </div>

          <div className="stats-grid">
            {[
              { label: 'Total Donations', value: stats?.totalDonations, icon: '🍱', cls: 'orange' },
              { label: 'Active Listings', value: stats?.activeDonations, icon: '✅', cls: 'green' },
              { label: 'Delivered', value: stats?.deliveredDonations, icon: '🚗', cls: 'blue' },
              { label: 'Total Users', value: stats?.totalUsers, icon: '👥', cls: 'purple' },
              { label: 'NGOs / Shelters', value: stats?.totalNGOs, icon: '🏢', cls: 'green' },
              { label: 'Volunteers', value: stats?.totalVolunteers, icon: '🙌', cls: 'blue' },
              { label: 'Total Requests', value: stats?.totalRequests, icon: '📩', cls: 'orange' },
              { label: 'Pending Verification', value: stats?.pendingVerifications, icon: '⏳', cls: 'red' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                <div className="stat-info"><h3>{s.value ?? 0}</h3><p>{s.label}</p></div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="card">
              <div className="card-header"><h3>Monthly Donations</h3></div>
              <div className="card-body">
                {stats?.monthlyData?.length > 0
                  ? <Bar data={monthlyChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
                  : <div className="empty-state" style={{ padding: '40px' }}><p>No data yet</p></div>
                }
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3>By Category</h3></div>
              <div className="card-body">
                {stats?.categoryData?.length > 0
                  ? <Doughnut data={categoryChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }} />
                  : <div className="empty-state" style={{ padding: '40px' }}><p>No data yet</p></div>
                }
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {[
              { path: '/admin/users', label: '👥 Manage Users', sub: `${stats?.pendingVerifications} need verification` },
              { path: '/admin/donations', label: '🍱 All Donations', sub: `${stats?.totalDonations} total` },
              { path: '/admin/requests', label: '📩 All Requests', sub: `${stats?.totalRequests} total` },
              { path: '/admin/reports', label: '📈 Reports', sub: 'Download data' },
            ].map(item => (
              <Link key={item.path} to={item.path} className="card" style={{ textDecoration: 'none', padding: '20px', display: 'block', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{item.label.split(' ')[0]}</div>
                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.label.split(' ').slice(1).join(' ')}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
