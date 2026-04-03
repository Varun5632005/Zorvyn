import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { categories } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, Filter, Trash2, Edit2, X, ShoppingCart, Briefcase, Car, Film, Zap, Coffee, Home, MoreHorizontal, DollarSign } from 'lucide-react';

const getCategoryStyle = (category, type) => {
  const styles = {
    'Groceries': { icon: ShoppingCart, color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
    'Shopping': { icon: ShoppingCart, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    'Salary': { icon: Briefcase, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    'Freelance': { icon: Briefcase, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
    'Transport': { icon: Car, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    'Entertainment': { icon: Film, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
    'Utilities': { icon: Zap, color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
    'Food': { icon: Coffee, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
    'Rent': { icon: Home, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
  };

  const defaultStyle = type === 'income' 
    ? { icon: DollarSign, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
    : { icon: MoreHorizontal, color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' };

  return styles[category] || defaultStyle;
};

const Transactions = () => {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction, formatCurrency } = useDashboard();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: '', amount: '', category: categories[0], type: 'expense' });

  // Filter & Sort
  const filteredData = useMemo(() => {
    let result = [...transactions];
    
    if (searchTerm) {
       const lower = searchTerm.toLowerCase();
       result = result.filter(tx => 
         tx.category.toLowerCase().includes(lower) || 
         tx.amount.toString().includes(lower) ||
         tx.date.includes(lower)
       );
    }
    
    if (filterType !== 'all') {
       result = result.filter(tx => tx.type === filterType);
    }
    
    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOrder === 'highest') {
      result.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (sortOrder === 'lowest') {
      result.sort((a, b) => Number(a.amount) - Number(b.amount));
    }
    
    return result;
  }, [transactions, searchTerm, filterType, sortOrder]);

  const handleOpenModal = (tx = null) => {
    if (tx) {
      setEditingId(tx.id);
      setFormData({ date: tx.date, amount: tx.amount, category: tx.category, type: tx.type });
    } else {
      setEditingId(null);
      setFormData({ date: new Date().toISOString().split('T')[0], amount: '', category: categories[0], type: 'expense' });
    }
    setIsModalOpen(true);
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) return;
    
    const amountNum = parseFloat(formData.amount);
    
    if (editingId) {
      editTransaction(editingId, { ...formData, amount: amountNum });
    } else {
      addTransaction({ id: uuidv4(), ...formData, amount: amountNum });
    }
    setIsModalOpen(false);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Transactions</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your income and expenses.</p>
          </div>
          
          {role === 'Admin' && (
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} /> Add Transaction
            </button>
          )}
        </div>
        
        {/* Filters Panel */}
        <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', padding: '1rem', width: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', flex: '1 1 100%' }}>
            <Search size={18} style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', padding: 0 }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <Filter size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ flex: 1, width: '100%', minWidth: 0 }}>
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>
            
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ flex: 1, width: '100%', minWidth: 0 }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
          
        </div>
      </div>

      {/* Transaction List Feed */}
      <div>
        {filteredData.length > 0 ? (
          <motion.ul 
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {filteredData.map(tx => {
                const style = getCategoryStyle(tx.category, tx.type);
                const Icon = style.icon;
                
                return (
                  <motion.li 
                    layout
                    key={tx.id} 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    whileHover="hover"
                    className="card"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '1rem', 
                      listStyle: 'none',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: '50%', backgroundColor: style.bg, color: style.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={20} />
                      </div>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.category}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <span style={{ 
                        fontWeight: 700, 
                        fontSize: '1.125rem', 
                        color: tx.type === 'income' ? 'var(--success)' : 'var(--text-main)',
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                      
                      {role === 'Admin' && (
                        <motion.div 
                          variants={{ 
                            hover: { opacity: 1, x: 0 }, 
                            hidden: { opacity: 0, x: 10 } 
                          }}
                          initial="hidden"
                          style={{ display: 'flex', gap: '0.5rem' }}
                        >
                          <button className="icon-btn" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', borderRadius: '50%' }} onClick={() => handleOpenModal(tx)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="icon-btn" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '50%' }} onClick={() => deleteTransaction(tx.id)}>
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No transactions found matching your criteria.
          </div>
        )}
      </div>

      {/* Modal / Form */}
      <AnimatePresence>
        {isModalOpen && (
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
              style={{ width: '100%', maxWidth: '500px' }}
            >
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="type" checked={formData.type === 'expense'} onChange={() => setFormData({...formData, type: 'expense'})} />
                    Expense
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="type" checked={formData.type === 'income'} onChange={() => setFormData({...formData, type: 'income'})} />
                    Income
                  </label>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Amount</label>
                <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Date</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Save Changes' : 'Add Transaction'}</button>
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
