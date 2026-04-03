import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Bell, Moon, Sun, Menu, Search } from 'lucide-react';

const Topbar = ({ setMobileOpen }) => {
  const { role, setRole, theme, toggleTheme } = useDashboard();

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-toggle icon-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
        
        <div className="search-bar" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1, maxWidth: '250px' }}>
          <Search size={16} style={{ marginRight: '0.5rem', flexShrink: 0 }} />
          <input 
            type="text" 
            placeholder="Search anywhere..." 
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', padding: 0 }}
          />
        </div>
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

        <button className="icon-btn">
          <div style={{ position: 'relative' }}>
             <Bell size={20} />
             <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, backgroundColor: 'var(--danger)', borderRadius: '50%' }}></span>
          </div>
        </button>

        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-name">
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Jane Doe</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
