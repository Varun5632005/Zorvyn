import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Monitor, Moon, Sun, X, Save, Check } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Settings = () => {
  const { role, setRole, theme, toggleTheme, currency, setCurrency, user, setUser, monthlyGoal, setMonthlyGoal } = useDashboard();

  // Profile edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, email: user.email });
  const [saved, setSaved] = useState(false);

  // Notification preferences (persisted locally in component state for demo)
  const [notifEmail, setNotifEmail] = useState(() => {
    return localStorage.getItem('notif-email') !== 'false';
  });
  const [notifActivity, setNotifActivity] = useState(() => {
    return localStorage.getItem('notif-activity') !== 'false';
  });

  const handleNotif = (key, val, setter) => {
    localStorage.setItem(key, val);
    setter(val);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) return;
    setUser({ name: editForm.name.trim(), email: editForm.email.trim() });
    setIsEditOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your Zorvyn account and preferences.</p>
        </motion.div>

        {/* Saved toast */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: '8px', fontWeight: 600 }}
            >
              <Check size={18} /> Profile updated successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--primary)" /> Profile
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: '1 1 200px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user.name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{user.email}</p>
              <span style={{ display: 'inline-flex', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: role === 'Admin' ? 'rgba(59,130,246,0.15)' : 'var(--success-bg)', color: role === 'Admin' ? 'var(--primary)' : 'var(--success-text)' }}>
                {role}
              </span>
            </div>
            <button className="btn btn-outline" style={{ width: 'auto', minWidth: '120px' }} onClick={() => { setEditForm({ name: user.name, email: user.email }); setIsEditOpen(true); }}>
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Role Switcher */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Monitor size={20} color="var(--primary)" /> Role Simulation
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Switch between Viewer and Admin to test permission-based features. Admins can add, edit, and delete transactions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${role === 'Viewer' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: '1 1 120px' }}
              onClick={() => setRole('Viewer')}
            >
              Viewer
            </button>
            <button
              className={`btn ${role === 'Admin' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: '1 1 120px' }}
              onClick={() => setRole('Admin')}
            >
              Admin
            </button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Monitor size={20} color="var(--primary)" /> Preferences
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Theme toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 600 }}>Appearance</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Toggle between light and dark mode.</p>
              </div>
              <button className="btn btn-outline" onClick={toggleTheme} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: '140px', justifyContent: 'center' }}>
                {theme === 'dark' ? <><Moon size={16} /> Dark Mode</> : <><Sun size={16} /> Light Mode</>}
              </button>
            </div>

            {/* Currency */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 600 }}>Currency</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Applies immediately across all pages.</p>
              </div>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                style={{ cursor: 'pointer', minWidth: '140px', fontWeight: 600, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            {/* Monthly Budget Setting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 600 }}>Monthly Spending Goal</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Set a limit to receive spending alerts.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{currency === 'INR' ? '₹' : '$'}</span>
                <input
                  type="number"
                  value={monthlyGoal}
                  onChange={e => setMonthlyGoal(Number(e.target.value))}
                  style={{ width: '120px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--primary)" /> Notifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifEmail}
                onChange={e => handleNotif('notif-email', e.target.checked, setNotifEmail)}
                style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.125rem', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.125rem' }}>Weekly Email Summary</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Receive a weekly breakdown of your spending habits.</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifActivity}
                onChange={e => handleNotif('notif-activity', e.target.checked, setNotifActivity)}
                style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.125rem', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.125rem' }}>Unusual Activity Alerts</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Get notified when a large or unusual transaction is detected.</p>
              </div>
            </label>
          </div>
        </motion.div>

      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="card"
              style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Edit Profile</h2>
                <button className="icon-btn" onClick={() => setIsEditOpen(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                  <input
                    required
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                  <input
                    required
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsEditOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Settings;
