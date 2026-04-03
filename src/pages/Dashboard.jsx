import React, { useMemo, useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const AnimatedCounter = ({ value, formatter }) => {
  const [displayValue, setDisplayValue] = useState(formatter(0));
  const springValue = useSpring(0, { stiffness: 50, damping: 15 });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayValue(formatter(latest));
    });
  }, [springValue, formatter]);

  return <>{displayValue}</>;
};

const DashboardOverview = () => {
  const { transactions, formatCurrency } = useDashboard();

  // Aggregate stats
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    transactions.forEach(tx => {
      const amount = Number(tx.amount);
      if (tx.type === 'income') income += amount;
      if (tx.type === 'expense') expense += amount;
    });

    return {
      balance: income - expense,
      income,
      expense
    };
  }, [transactions]);

  // Aggregate spending by category for Pie Chart
  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const grouped = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
      return acc;
    }, {});
    
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Transform transactions to chart data (sort by date, calculate running balance)
  const chartData = useMemo(() => {
    // Basic sorting by date
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    const dataMap = {};
    
    sorted.forEach(tx => {
      const date = tx.date.substring(5); // Show MM-DD
      const amount = Number(tx.amount);
      if (tx.type === 'income') runningBalance += amount;
      else runningBalance -= amount;
      
      // If multiple transactions on same day, use the latest balance of the day
      dataMap[date] = { date, balance: runningBalance };
    });
    
    return Object.values(dataMap);
  }, [transactions]);


  return (
    <motion.div 
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      initial="hidden"
      animate="show"
    >
      
      {/* Header */}
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening with your finances.</p>
      </motion.div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
        
        <motion.div 
          className="card" 
          variants={{ hidden: { opacity: 0, scale: 0.95, y: 15 }, show: { opacity: 1, scale: 1, y: 0 } }}
          whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
        >
          <div style={{ padding: '1rem', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Total Balance</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}><AnimatedCounter value={stats.balance} formatter={formatCurrency} /></h2>
          </div>
        </motion.div>
        
        <motion.div 
          className="card" 
          variants={{ hidden: { opacity: 0, scale: 0.95, y: 15 }, show: { opacity: 1, scale: 1, y: 0 } }}
          whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
        >
          <div style={{ padding: '1rem', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Total Income</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}><AnimatedCounter value={stats.income} formatter={formatCurrency} /></h2>
            <p style={{ color: 'var(--success)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
               <ArrowUpRight size={14} /> +4.5% from last month
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="card" 
          variants={{ hidden: { opacity: 0, scale: 0.95, y: 15 }, show: { opacity: 1, scale: 1, y: 0 } }}
          whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
        >
          <div style={{ pading: '1rem', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingDown size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Total Expenses</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}><AnimatedCounter value={stats.expense} formatter={formatCurrency} /></h2>
            <p style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
               <ArrowDownRight size={14} /> -1.2% from last month
            </p>
          </div>
        </motion.div>

      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '1.5rem' }}>
        
        <motion.div 
          className="card" 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', height: '400px' }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Balance Trend</h3>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={12} 
                    tickFormatter={(val) => `$${val}`} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-main)', boxShadow: 'var(--shadow-md)' }}
                    formatter={(value) => [formatCurrency(value), 'Balance']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="var(--primary)" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                    isAnimationActive={true}
                    animationBegin={300}
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
               <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="card" 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', height: '400px' }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Spending Breakdown</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Your expenses by category</p>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
             {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="45%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={true}
                      animationBegin={400}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No expenses yet</div>
              )}
          </div>
        </motion.div>
        
      </div>

    </motion.div>
  );
};

export default DashboardOverview;
