import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  // Try to load from local storage
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance-dashboard-transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockTransactions;
      }
    }
    return mockTransactions;
  });

  const [role, setRole] = useState('Viewer'); // 'Viewer' or 'Admin'
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('finance-dashboard-theme');
    return saved || 'light';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('finance-dashboard-currency') || 'USD';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('finance-dashboard-user');
    if (saved) {
       try { return JSON.parse(saved); } catch (e) { }
    }
    return { name: 'Varun Pavan', email: 'varun@zorvyn.app' };
  });

  // Global Currency Formatter
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(val);
  };

  // Persist transactions explicitly
  useEffect(() => {
    localStorage.setItem('finance-dashboard-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('finance-dashboard-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist currency and user
  useEffect(() => {
    localStorage.setItem('finance-dashboard-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('finance-dashboard-user', JSON.stringify(user));
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addTransaction = (transaction) => {
    if (role !== 'Admin') return;
    setTransactions(prev => [transaction, ...prev]);
  };

  const editTransaction = (id, updatedTx) => {
    if (role !== 'Admin') return;
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updatedTx } : tx));
  };

  const deleteTransaction = (id) => {
    if (role !== 'Admin') return;
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <DashboardContext.Provider value={{
      transactions,
      role,
      setRole,
      theme,
      toggleTheme,
      currency,
      setCurrency,
      user,
      setUser,
      formatCurrency,
      addTransaction,
      editTransaction,
      deleteTransaction
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
