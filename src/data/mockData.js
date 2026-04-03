import { v4 as uuidv4 } from 'uuid';

export const mockTransactions = [
  { id: uuidv4(), date: '2026-03-25', amount: 120.50, category: 'Groceries', type: 'expense' },
  { id: uuidv4(), date: '2026-03-24', amount: 3500.00, category: 'Salary', type: 'income' },
  { id: uuidv4(), date: '2026-03-22', amount: 45.00, category: 'Transport', type: 'expense' },
  { id: uuidv4(), date: '2026-03-20', amount: 60.00, category: 'Entertainment', type: 'expense' },
  { id: uuidv4(), date: '2026-03-18', amount: 200.00, category: 'Utilities', type: 'expense' },
  { id: uuidv4(), date: '2026-03-15', amount: 850.00, category: 'Freelance', type: 'income' },
  { id: uuidv4(), date: '2026-03-10', amount: 15.50, category: 'Food', type: 'expense' },
  { id: uuidv4(), date: '2026-03-05', amount: 1200.00, category: 'Rent', type: 'expense' },
  { id: uuidv4(), date: '2026-03-02', amount: 150.00, category: 'Shopping', type: 'expense' },
];

export const categories = [
  'Groceries', 'Salary', 'Transport', 'Entertainment', 'Utilities', 'Freelance', 'Food', 'Rent', 'Shopping', 'Other'
];
