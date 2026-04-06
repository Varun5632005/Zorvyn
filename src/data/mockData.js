import { v4 as uuidv4 } from 'uuid';

export const categories = [
  'Investment', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Freelance', 'Transport', 'Food & Dining', 'Salary', 'Rent', 'Other'
];

export const mockTransactions = [
  { id: uuidv4(), date: '2025-06-25', amount: 1250.00, category: 'Investment', description: 'TCS Quarterly Dividend', type: 'income' },
  { id: uuidv4(), date: '2025-06-23', amount: 450.00, category: 'Investment', description: 'HDFC Bank Dividend', type: 'income' },
  { id: uuidv4(), date: '2025-06-22', amount: 3000.00, category: 'Investment', description: 'Mutual Fund SIP', type: 'expense' },
  { id: uuidv4(), date: '2025-06-20', amount: 1200.00, category: 'Entertainment', description: 'Movie & Dinner', type: 'expense' },
  { id: uuidv4(), date: '2025-06-18', amount: 300.00, category: 'Health', description: 'Pharmacy', type: 'expense' },
  { id: uuidv4(), date: '2025-06-14', amount: 1800.00, category: 'Shopping', description: 'Monsoon Shopping', type: 'expense' },
  { id: uuidv4(), date: '2025-06-12', amount: 1200.00, category: 'Utilities', description: 'Electricity Bill', type: 'expense' },
  { id: uuidv4(), date: '2025-06-10', amount: 4500.00, category: 'Freelance', description: 'Freelance Project', type: 'income' },
  { id: uuidv4(), date: '2025-06-08', amount: 400.00, category: 'Transport', description: 'Cab Rides', type: 'expense' },
  { id: uuidv4(), date: '2025-06-05', amount: 950.00, category: 'Food & Dining', description: 'Grocery Store', type: 'expense' },
  { id: uuidv4(), date: '2025-06-01', amount: 35000.00, category: 'Salary', description: 'Monthly Salary', type: 'income' },
  { id: uuidv4(), date: '2025-05-28', amount: 8000.00, category: 'Rent', description: 'House Rent', type: 'expense' },
  { id: uuidv4(), date: '2025-05-25', amount: 199.00, category: 'Other', description: 'Mobile Recharge', type: 'expense' },
  { id: uuidv4(), date: '2025-05-22', amount: 2500.00, category: 'Investment', description: 'Stocks Purchase', type: 'expense' },
  { id: uuidv4(), date: '2025-05-20', amount: 1100.00, category: 'Shopping', description: 'Amazon Order', type: 'expense' },
  { id: uuidv4(), date: '2025-05-18', amount: 450.00, category: 'Health', description: 'Gym Membership', type: 'expense' },
  { id: uuidv4(), date: '2025-05-15', amount: 1200.00, category: 'Freelance', description: 'Logo Design', type: 'income' },
  { id: uuidv4(), date: '2025-05-12', amount: 800.00, category: 'Food & Dining', description: 'Dinner Party', type: 'expense' },
  { id: uuidv4(), date: '2025-05-10', amount: 550.00, category: 'Utilities', description: 'Water Bill', type: 'expense' },
  { id: uuidv4(), date: '2025-05-08', amount: 300.00, category: 'Transport', description: 'Fuel Refill', type: 'expense' },
  { id: uuidv4(), date: '2025-05-05', amount: 450.00, category: 'Entertainment', description: 'Netflix & Spotify', type: 'expense' },
  { id: uuidv4(), date: '2025-05-01', amount: 35000.00, category: 'Salary', description: 'Monthly Salary', type: 'income' },
  // Adding more entries with more realistic descriptions
  // Consistent distribution across months to ensure balanced insights
  ...Array.from({ length: 60 }).map((_, i) => {
    const month = i < 20 ? '04' : (i < 40 ? '05' : '06');
    const day = String((i % 28) + 1).padStart(2, '0');
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const descriptions = {
      'Investment': ['SIP Payment', 'Stock Buy', 'HDFC Dividend', 'NMDC Dividend', 'Reliance Dividend', 'Gold Purchase'],
      'Entertainment': ['Movie Tickets', 'OTT Subscription', 'Gaming Console', 'Concert'],
      'Health': ['Pharmacy', 'Doctor Consultation', 'Multivitamins', 'Dentist'],
      'Shopping': ['Amazon Purchase', 'Clothing Store', 'Gadget Upgrade', 'Footwear'],
      'Utilities': ['Phone Bill', 'Internet Bill', 'Gas Connection', 'Maintenance'],
      'Freelance': ['UI Design Project', 'Bug Fix Payment', 'Consulting Fee', 'SEO Project'],
      'Transport': ['Uber Ride', 'Petrol Refill', 'Train Tickets', 'Parking Fee'],
      'Food & Dining': ['Pizza Night', 'Starbucks Coffee', 'Lunch with Friend', 'Fine Dining'],
      'Salary': ['Performance Bonus', 'Monthly Salary', 'Reimbursement'],
      'Rent': ['Monthly Rent', 'Security Deposit'],
      'Other': ['Misc Purchase', 'Cash Withdrawal', 'Gift']
    };
    const possibleDescs = descriptions[cat] || ['Monthly Transaction'];
    const desc = possibleDescs[Math.floor(Math.random() * possibleDescs.length)];
    const type = (cat === 'Salary' || cat === 'Freelance' || desc.includes('Dividend')) ? 'income' : (Math.random() > 0.9 ? 'income' : 'expense');
    
    // Distribute amounts: ensure monthly totals are roughly similar
    let amount = 0;
    if (cat === 'Salary') amount = 35000;
    else if (cat === 'Rent') amount = 8000;
    else amount = (Math.floor(Math.random() * 1200) + 100);

    return {
      id: uuidv4(),
      date: `2025-${month}-${day}`,
      amount,
      category: cat,
      description: desc,
      type
    };
  })
];
