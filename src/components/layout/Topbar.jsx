import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Bell, Moon, Sun, Menu, Eye, EyeOff } from 'lucide-react';

const Topbar = ({ setMobileOpen }) => {
  const { role, setRole, theme, toggleTheme, notifications, markAsRead, user, privacyMode, setPrivacyMode } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-toggle icon-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      <div className="topbar-right">
        {/* Role Switcher */}
        <div className="role-switcher">
          <button 
            className={`role-btn ${role === 'Viewer' ? 'active' : ''}`}
            onClick={() => setRole('Viewer')}
          >
            Viewer
          </button>
          <button 
            className={`role-btn ${role === 'Admin' ? 'active' : ''}`}
            onClick={() => setRole('Admin')}
          >
            Admin
          </button>
        </div>

        <button className="icon-btn" onClick={toggleTheme}>
           {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="icon-btn" onClick={() => setPrivacyMode(!privacyMode)} title="Toggle Privacy Mode">
           {privacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <div style={{ position: 'relative' }}>
               <Bell size={20} />
               {unreadCount > 0 && (
                 <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: 'var(--danger)', borderRadius: '50%' }}></span>
               )}
            </div>
          </button>
          
          {showNotifications && (
            <div className="card notification-dropdown" style={{ 
              position: 'fixed', 
              top: '70px', 
              right: 'max(15px, 2%)', 
              width: 'min(320px, 92vw)', 
              padding: 0, 
              zIndex: 100, 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-2xl)',
              maxHeight: 'calc(100vh - 100px)'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Notifications</h3>
                {unreadCount > 0 && (
                   <button onClick={() => markAsRead('all')} style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none' }}>
                     Mark all read
                   </button>
                )}
              </div>
              <div className="custom-scroll" style={{ overflowY: 'auto' }}>
                {!notifications || notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} onClick={() => { markAsRead(n.id); setShowNotifications(false); }} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: n.read ? 'transparent' : 'var(--bg-card)', cursor: 'pointer', display: 'flex', gap: '0.75rem', transition: 'background 0.2s', alignItems: 'flex-start' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: n.read ? 'transparent' : 'var(--primary)', marginTop: 6, flexShrink: 0 }}></div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem', fontWeight: n.read ? 400 : 500, lineHeight: 1.4 }}>{n.message}</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-profile" style={{ 
          background: 'none', 
          padding: '0', 
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div className="avatar user-avatar" style={{ 
            width: 36, 
            height: 36, 
            borderRadius: '10px',
            background: 'var(--text-main)',
            color: 'var(--bg-surface)',
            fontWeight: 800,
            fontSize: '12px',
            border: 'none',
            flexShrink: 0,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
          }}>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
          <div className="user-name-container" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '0.1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.name}</span>
            <span style={{ 
              fontSize: '0.6rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              opacity: 0.8,
              padding: '0.1rem 0.5rem',
              borderRadius: '3px',
              width: 'fit-content',
              letterSpacing: '0.5px'
            }}>{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
