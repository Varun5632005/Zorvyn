import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { Lightbulb, TrendingDown, TrendingUp, AlertCircle, Award } from 'lucide-react';

const Insights = () => {
  const { transactions, formatCurrency } = useDashboard();

  const insightsData = useMemo(() => {
    if (transactions.length === 0) return null;

    // 1. Highest Spending Category
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const grouped = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
      return acc;
    }, {});
    
    let highestCat = { category: 'None', amount: 0 };
    for (const [cat, amt] of Object.entries(grouped)) {
      if (amt > highestCat.amount) {
        highestCat = { category: cat, amount: amt };
      }
    }

    // 2. Monthly Comparison (Simplified: Current vs Previous based on dates in mock data)
    // We'll just split by month (YYYY-MM)
    const monthlyStats = transactions.reduce((acc, tx) => {
      const month = tx.date.substring(0, 7);
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      if (tx.type === 'income') acc[month].income += Number(tx.amount);
      else acc[month].expense += Number(tx.amount);
      return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyStats).sort();
    
    let monthlyComparison = null;
    if (sortedMonths.length >= 2) {
      const currentMonth = monthlyStats[sortedMonths[sortedMonths.length - 1]];
      const prevMonth = monthlyStats[sortedMonths[sortedMonths.length - 2]];
      
      const expenseDiff = currentMonth.expense - prevMonth.expense;
      const expensePct = prevMonth.expense > 0 ? (expenseDiff / prevMonth.expense) * 100 : 0;
      
      monthlyComparison = {
        diff: expenseDiff,
        pct: expensePct.toFixed(1),
        isBetter: expenseDiff <= 0
      };
    }

    // 3. Largest single transaction
    const largestExpense = [...expenses].sort((a,b) => b.amount - a.amount)[0];

    return {
      highestCat,
      monthlyComparison,
      largestExpense,
      totalTx: transactions.length
    };
  }, [transactions]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Financial Insights</h1>
        <p style={{ color: 'var(--text-muted)' }}>Actionable observations based on your transactions.</p>
      </div>

      {!insightsData ? (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
           Not enough data to calculate insights. Add some transactions first!
         </motion.div>
      ) : (
        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          initial="hidden"
          animate="show"
        >
          
          {/* Highest Spending */}
          <motion.div 
            className="card stack-on-mobile" 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
          >
            <div style={{ width: '3rem', height: '3rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
              <TrendingDown size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Top Expense Category</p>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {insightsData.highestCat.category}
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                You've spent <strong style={{ color: 'var(--danger)' }}>{formatCurrency(insightsData.highestCat.amount)}</strong> in this category, making it your largest area of expenditure.
              </p>
            </div>
          </motion.div>

          {/* Monthly Comparison */}
          {insightsData.monthlyComparison && (
            <motion.div 
              className="card stack-on-mobile" 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
            >
              <div style={{ width: '3rem', height: '3rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: insightsData.monthlyComparison.isBetter ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: insightsData.monthlyComparison.isBetter ? 'var(--success)' : 'var(--danger)' }}>
                {insightsData.monthlyComparison.isBetter ? <TrendingUp size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Monthly Comparison</p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {Math.abs(insightsData.monthlyComparison.pct)}% {insightsData.monthlyComparison.isBetter ? 'Decrease' : 'Increase'}
                </h3>
                <p style={{ fontSize: '0.875rem' }}>
                   Compared to last month, your expenses went {insightsData.monthlyComparison.isBetter ? 'down' : 'up'}. 
                   {insightsData.monthlyComparison.isBetter ? ' Great job keeping costs low!' : ' Consider reviewing your budget.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Largest Transaction */}
          {insightsData.largestExpense && (
            <motion.div 
              className="card stack-on-mobile" 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
            >
              <div style={{ width: '3rem', height: '3rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Award size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Largest Single Expense</p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {insightsData.largestExpense.category}
                </h3>
                <p style={{ fontSize: '0.875rem' }}>
                  Your biggest single purchase was <strong style={{ color: 'var(--danger)' }}>{formatCurrency(insightsData.largestExpense.amount)}</strong> on {insightsData.largestExpense.date}.
                </p>
              </div>
            </motion.div>
          )}

          {/* AI Observation Mock */}
          <motion.div 
            className="card" 
            variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
            whileHover={{ scale: 1.01, boxShadow: 'var(--shadow-xl)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', gridColumn: '1 / -1', background: 'linear-gradient(to right, var(--bg-surface), rgba(59, 130, 246, 0.05))', borderColor: 'var(--primary)' }}
          >
            <div style={{ width: '3rem', height: '3rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white' }}>
              <Lightbulb size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Smart Observation</p>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>High fixed costs</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                 We noticed that over 50% of your expenses come from a single category ({insightsData.highestCat.category}). Lowering these fixed costs could drastically increase your overall savings rate. Try negotiating your upcoming bills.
              </p>
            </div>
          </motion.div>

        </motion.div>
      )}
    </div>
  );
};

export default Insights;
