import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { AlertCircle, CheckCircle, TrendingDown, Target } from 'lucide-react';

const BudgetPop = () => {
  const { budgetAlert, formatCurrency, monthlyGoal } = useDashboard();

  if (!budgetAlert) return null;

  const { percent, remaining, exceeded } = budgetAlert;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 50, transition: { duration: 0.3 } }}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: 'max(20px, 5%)',
          zIndex: 9999,
          padding: '1.5rem',
          borderRadius: '24px',
          background: exceeded 
            ? 'linear-gradient(145deg, #7f1d1d, #450a0a)' 
            : 'rgba(15, 23, 42, 0.9)', 
          color: 'white',
          boxShadow: exceeded 
            ? '0 25px 50px -12px rgba(127, 29, 29, 0.5)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          width: 'min(340px, 90vw)',
          border: exceeded ? '1px solid #b91c1c' : '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '16px', 
            background: exceeded ? 'rgba(255,255,255,0.15)' : 'rgba(34, 197, 94, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
          }}>
            {exceeded ? <AlertCircle color="#fca5a5" size={24} /> : <CheckCircle color="#4ade80" size={24} />}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              {exceeded ? 'Budget Exceeded' : 'Usage Update'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7, color: '#94a3b8' }}>Spending Pulse</p>
          </div>
        </div>

        <div style={{ padding: '0.25rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{percent}%</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: exceeded ? '#fca5a5' : '#94a3b8' }}>
              {exceeded ? 'Over Limit' : `${formatCurrency(remaining)} left`}
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', overflow: 'hidden', padding: '2px' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, percent)}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ 
                height: '100%', 
                background: exceeded ? 'linear-gradient(90deg, #f87171, #ef4444)' : 'linear-gradient(90deg, #22c55e, #10b981)', 
                borderRadius: '3px',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
              }}
            />
          </div>
        </div>

        <div style={{ 
          fontSize: '0.75rem', 
          padding: '0.75rem', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '14px', 
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem',
          color: '#cbd5e1'
        }}>
           <Target size={14} color="var(--primary)" />
           <span>Budget Target: <strong style={{color: 'white'}}>{formatCurrency(monthlyGoal)}</strong></span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BudgetPop;
