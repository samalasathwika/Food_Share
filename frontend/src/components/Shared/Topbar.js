import React, { useEffect, useState } from 'react';
import { getNotifications, markAllRead } from '../../utils/api';

export default function Topbar({ title }) {
  const [notifs, setNotifs] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      setNotifs(res.data);
    } catch {}
  };

  const unread = notifs.filter(n => !n.isRead).length;

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="topbar">
      <h1>{title}</h1>
      <div className="topbar-actions">
        <div style={{ position: 'relative' }}>
          <button className="notif-bell" onClick={() => setShowDrop(!showDrop)}>
            🔔
            {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
          </button>
          {showDrop && (
            <div style={{
              position: 'absolute', right: 0, top: '40px', width: '320px',
              background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-md)', zIndex: 200, maxHeight: '360px', overflowY: 'auto'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem' }}>Notifications</strong>
                {unread > 0 && <button onClick={handleMarkAll} style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Mark all read</button>}
              </div>
              {notifs.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notifications</div>
              ) : (
                notifs.slice(0, 15).map(n => (
                  <div key={n._id} style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-light)',
                    background: n.isRead ? '#fff' : '#f0faf3',
                    fontSize: '0.82rem',
                  }}>
                    <div style={{ color: 'var(--text)', marginBottom: '3px' }}>{n.message}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
