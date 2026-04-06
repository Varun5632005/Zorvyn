import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { categories } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';
import {
  Plus, Search, Filter, Trash2, Edit2, X, Download,
  TrendingUp, TrendingDown, Calendar,
  Utensils, Car, ShoppingBag, Zap, Hospital,
  Film, Briefcase, Laptop, LineChart, Home, HelpCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const categoryIcons = {
  'Investment': LineChart,
  'Entertainment': Film,
  'Health': Hospital,
  'Shopping': ShoppingBag,
  'Utilities': Zap,
  'Freelance': Briefcase,
  'Transport': Car,
  'Food & Dining': Utensils,
  'Salary': TrendingUp,
  'Rent': Home,
  'Other': HelpCircle
};

const getCategoryColor = (category) => {
  const colors = {
    'Investment': '#3b82f6',
    'Entertainment': '#f97316',
    'Health': '#10b981',
    'Shopping': '#ec4899',
    'Utilities': '#8b5cf6',
    'Freelance': '#06b6d4',
    'Transport': '#3b82f6',
    'Food & Dining': '#eab308',
    'Salary': '#10b981',
    'Rent': '#6366f1',
    'Other': '#64748b'
  };
  return colors[category] || '#64748b';
};

const Transactions = () => {
  const {
    transactions, role, addTransaction, editTransaction, bulkAddTransactions,
    deleteTransaction, formatCurrency, exportTransactions, privacyMode
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    type: 'expense'
  });

  // Filter Logic
  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = (tx.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || tx.type === filterType;
      const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;

      const txDate = new Date(tx.date);
      const matchesFrom = !fromDate || txDate >= new Date(fromDate);
      const matchesTo = !toDate || txDate <= new Date(toDate);

      return matchesSearch && matchesType && matchesCategory && matchesFrom && matchesTo;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchTerm, filterType, filterCategory, fromDate, toDate]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to first page on filter/search/itemsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory, fromDate, toDate, itemsPerPage]);
  
  // Auto-detect income type for Dividends
  useEffect(() => {
     if (formData.description.toLowerCase().includes('dividend')) {
        setFormData(prev => ({ ...prev, type: 'income', category: 'Investment' }));
     }
  }, [formData.description]);

  const handleOpenModal = (tx = null) => {
    if (tx) {
      setEditingId(tx.id);
      setFormData({
        description: tx.description || '',
        amount: tx.amount,
        date: tx.date,
        category: tx.category,
        type: tx.type
      });
    } else {
      setEditingId(null);
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Food & Dining',
        type: 'expense'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.description) return;

    const finalAmount = Math.abs(parseFloat(formData.amount));
    if (editingId) {
      editTransaction(editingId, { ...formData, amount: finalAmount });
    } else {
      addTransaction({ id: uuidv4(), ...formData, amount: finalAmount });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="transactions-page" style={{ color: 'var(--text-main)' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Transactions</h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>{filteredData.length} records found</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className="btn btn-outline" onClick={() => setShowExportMenu(!showExportMenu)} style={{ background: showExportMenu ? 'rgba(0, 209, 255, 0.1)' : 'var(--bg-surface)', border: showExportMenu ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '10px', padding: '0.5rem 0.8rem', fontSize: '0.75rem', gap: '0.3rem', color: showExportMenu ? 'var(--primary)' : 'inherit' }}>
                <Download size={14} /> Export
              </motion.button>
              <label htmlFor="import-data" style={{ borderRadius: '10px', padding: '0.5rem 0.8rem', fontSize: '0.75rem', gap: '0.3rem', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
                 <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> Import
                 <input id="import-data" type="file" accept=".json" onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const data = JSON.parse(ev.target.result);
                        if (data && Array.isArray(data)) {
                           bulkAddTransactions(data);
                        }
                      } catch (err) { alert('Invalid data format.'); }
                    };
                    reader.readAsText(file);
                 }} style={{ display: 'none' }} />
              </label>
            </div>
            <AnimatePresence>
              {showExportMenu && (
                <>
                  <div onClick={() => setShowExportMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '0.5rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '160px', boxShadow: 'var(--shadow-2xl)' }}>
                    <button onClick={() => { exportTransactions('csv'); setShowExportMenu(false); }} style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', borderRadius: '10px', background: 'transparent', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                      <Download size={15} color="var(--primary)" /> <span>Export CSV</span>
                    </button>
                    <button onClick={() => { exportTransactions('json'); setShowExportMenu(false); }} style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', borderRadius: '10px', background: 'transparent', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                      <Download size={15} color="var(--primary)" /> <span>Export JSON</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className="btn btn-outline" onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? 'rgba(0, 209, 255, 0.1)' : 'var(--bg-surface)', border: showFilters ? '1px solid var(--primary)' : '1px solid var(--border-color)', color: showFilters ? 'var(--primary)' : 'inherit', borderRadius: '10px', padding: '0.5rem 0.8rem', fontSize: '0.75rem', gap: '0.3rem' }}>
            <Filter size={14} /> Filters
          </motion.button>
          {role === 'Admin' && (
            <div className="hidden-mobile">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={() => handleOpenModal()} style={{ background: 'var(--primary)', color: 'white', borderRadius: '10px', padding: '0.5rem 0.8rem', fontWeight: 700, fontSize: '0.75rem', gap: '0.3rem', border: 'none' }}>
                <Plus size={14} /> Add
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) for mobile admin */}
      {role === 'Admin' && (
        <div className="mobile-only" style={{ position: 'fixed', bottom: '25px', left: '25px', zIndex: 9999 }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => handleOpenModal()} style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary)', color: 'white', border: 'none', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={28} />
          </motion.button>
        </div>
      )}

      {/* Search Bar - Premium Style */}
      <div className="search-container" style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="premium-search-input"
          style={{
            width: '100%',
            padding: '1.2rem 1.2rem 1.2rem 3.5rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-sm)'
          }}
        />
      </div>

      {/* Filters Row */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0, overflow: 'hidden' }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 32, overflow: 'visible' }}
            exit={{ height: 0, opacity: 0, marginBottom: 0, overflow: 'hidden' }}
            transition={{ type: 'spring', stiffness: 150, damping: 22 }}
          >
            <div className="filters-grid" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="filter-item">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Type</label>
                <select className="premium-select" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="filter-item">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Category</label>
                <select className="premium-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }}>
                  <option value="all">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="filter-item">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>From</label>
                <input type="date" onClick={(e) => { try { e.target.showPicker(); } catch (err) { } }} value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }} />
              </div>
              <div className="filter-item">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>To</label>
                <input type="date" onClick={(e) => { try { e.target.showPicker(); } catch (err) { } }} value={toDate} onChange={e => setToDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MOBILE CARD LIST (< 640px) ─── */}
      <div className="tx-mobile-list">
        {paginatedData.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No transactions found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {paginatedData.map((tx, idx) => {
              const Icon = categoryIcons[tx.category] || HelpCircle;
              const catColor = getCategoryColor(tx.category);
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-md)', borderColor: 'var(--primary)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.03 }}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '1rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Top row: date + amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={privacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 800, fontSize: '1rem', color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                    </span>
                  </div>

                  {/* Name */}
                  <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem', color: 'var(--text-main)' }}>
                    {tx.description || tx.category}
                  </p>

                  {/* Badges row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, background: `${catColor}18`, color: catColor }}>
                      <Icon size={12} /> {tx.category}
                    </span>
                    <span style={{ padding: '0.3rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, background: tx.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)', color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.type}
                    </span>
                  </div>

                  {/* Action buttons */}
                  {role === 'Admin' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenModal(tx)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, background: 'var(--danger-bg)', border: '1px solid transparent', color: 'var(--danger)', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mobile Pagination */}
        {filteredData.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <b style={{ color: 'var(--text-main)' }}>{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)}</b> of <b style={{ color: 'var(--text-main)' }}>{filteredData.length}</b>
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', opacity: currentPage === 1 ? 0.4 : 1 }}>← Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', opacity: currentPage === totalPages ? 0.4 : 1 }}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* ─── DESKTOP TABLE (≥ 640px) ─── */}
      <div className="tx-desktop-table" style={{ borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '16px 16px 0 0' }}>
          <table style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.04)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Date</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Description</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Category</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right', whiteSpace: 'nowrap' }}>Amount</th>
                {role === 'Admin' && <th style={{ padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((tx, idx) => {
                const Icon = categoryIcons[tx.category] || HelpCircle;
                const catColor = getCategoryColor(tx.category);
                return (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: 'rgba(0, 209, 255, 0.05)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.02 }}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '34px', height: '34px', flexShrink: 0, borderRadius: '8px', background: `${catColor}15`, color: catColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={15} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tx.description || tx.category}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                      <span style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, background: `${catColor}15`, color: catColor }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, fontSize: '0.95rem', color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)', whiteSpace: 'nowrap' }}>
                      <span className={privacyMode ? 'privacy-blur' : ''}>
                        {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    {role === 'Admin' && (
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                          <button className="icon-btn" onClick={() => handleOpenModal(tx)} title="Edit"><Edit2 size={15} /></button>
                          <button className="icon-btn delete-btn" onClick={() => deleteTransaction(tx.id)} title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
              {paginatedData.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination Footer */}
        {filteredData.length > 0 && (
          <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <b style={{ color: 'var(--text-main)' }}>{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)}</b> of <b style={{ color: 'var(--text-main)' }}>{filteredData.length}</b>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rows:</span>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value))} style={{ padding: '0.15rem 0.35rem', borderRadius: '6px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', fontSize: '0.7rem', fontWeight: 600, outline: 'none' }}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="icon-btn" style={{ opacity: currentPage === 1 ? 0.3 : 1 }}><ChevronLeft size={15} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} style={{ minWidth: '26px', height: '26px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: currentPage === pageNum ? 'var(--primary)' : 'transparent', color: currentPage === pageNum ? 'white' : 'var(--text-main)', cursor: 'pointer', border: 'none' }}>{pageNum}</button>;
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <span key={pageNum} style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>…</span>;
                return null;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="icon-btn" style={{ opacity: currentPage === totalPages ? 0.3 : 1 }}><ChevronRight size={15} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Premium Add/Edit Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="card"
              style={{ width: '100%', maxWidth: '380px', padding: '1.25rem', borderRadius: '20px', position: 'relative', boxShadow: 'var(--shadow-xl)' }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ position: 'absolute', right: '1rem', top: '1rem', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>

              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.25rem' }}>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Description</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Grocery Store"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Amount (₹)</label>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Date</label>
                    <input
                      required
                      type="date"
                      onClick={(e) => { try { e.target.showPicker(); } catch (err) { } }}
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.4rem', borderRadius: '12px', background: 'var(--bg-color)' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense' })}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '8px',
                        background: formData.type === 'expense' ? 'var(--danger)' : 'transparent',
                        color: formData.type === 'expense' ? 'white' : 'var(--text-muted)',
                        fontWeight: 700, transition: 'all 0.2s', fontSize: '0.85rem'
                      }}
                    >
                      <TrendingDown size={16} /> Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income' })}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '8px',
                        background: formData.type === 'income' ? 'var(--success)' : 'transparent',
                        color: formData.type === 'income' ? 'white' : 'var(--text-muted)',
                        fontWeight: 700, transition: 'all 0.2s', fontSize: '0.85rem'
                      }}
                    >
                      <TrendingUp size={16} /> Income
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Category</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                    {Object.entries(categoryIcons).map(([cat, Icon]) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        title={cat}
                        style={{
                          height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: formData.category === cat ? `2px solid ${getCategoryColor(cat)}` : '1px solid var(--border-color)',
                          background: formData.category === cat ? `${getCategoryColor(cat)}10` : 'transparent',
                          color: formData.category === cat ? getCategoryColor(cat) : 'var(--text-muted)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>
                  <p style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Selected: <span style={{ color: getCategoryColor(formData.category), fontWeight: 700 }}>{formData.category}</span>
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} style={{ borderRadius: '10px', padding: '0.6rem', fontSize: '0.85rem' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ background: 'var(--primary)', color: 'white', borderRadius: '10px', padding: '0.6rem', fontWeight: 700, fontSize: '0.85rem', border: 'none', boxShadow: '0 4px 12px rgba(0, 209, 255, 0.2)' }}>
                    {editingId ? 'Update' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transactions;
