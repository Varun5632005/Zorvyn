import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { LayoutDashboard, Receipt, Settings, PieChart, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { user } = useDashboard();
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <div className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="avatar" style={{width: 32, height: 32, fontSize: 13}}>{initials}</div>
          <span>Zorvyn</span>
          <button 
            className="mobile-toggle icon-btn" 
            style={{marginLeft: 'auto'}}
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
        
        <div style={{ marginTop: 'auto', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          &copy; 2026 Zorvyn UI
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
