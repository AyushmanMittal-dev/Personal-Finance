export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: string;
  notes?: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
  color: string;
  icon: string;
}

export const CATEGORIES: Record<TransactionType, CategoryOption[]> = {
  expense: [
    { value: 'housing', label: 'Housing & Rent', color: '#FF5A5F', icon: 'Home' },
    { value: 'groceries', label: 'Groceries', color: '#36B37E', icon: 'ShoppingBag' },
    { value: 'utilities', label: 'Utilities & Bills', color: '#00B8D9', icon: 'Zap' },
    { value: 'transportation', label: 'Transportation', color: '#FFAB00', icon: 'Car' },
    { value: 'entertainment', label: 'Entertainment & Leisure', color: '#6554C0', icon: 'Film' },
    { value: 'dining', label: 'Dining Out', color: '#FF7A00', icon: 'Utensils' },
    { value: 'shopping', label: 'Shopping', color: '#FF5630', icon: 'Tag' },
    { value: 'healthcare', label: 'Healthcare & Fitness', color: '#00875A', icon: 'Heart' },
    { value: 'education', label: 'Education', color: '#253858', icon: 'BookOpen' },
    { value: 'other_expense', label: 'Other Expense', color: '#7A869A', icon: 'HelpCircle' }
  ],
  income: [
    { value: 'salary', label: 'Salary & Wages', color: '#36B37E', icon: 'Briefcase' },
    { value: 'freelance', label: 'Freelance & Side Hustles', color: '#00B8D9', icon: 'Laptop' },
    { value: 'investments', label: 'Investments & Dividends', color: '#FFAB00', icon: 'TrendingUp' },
    { value: 'gifts', label: 'Gifts & Grants', color: '#6554C0', icon: 'Gift' },
    { value: 'other_income', label: 'Other Income', color: '#7A869A', icon: 'DollarSign' }
  ]
};

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Mobile Payment',
  'Crypto',
  'Other'
];
