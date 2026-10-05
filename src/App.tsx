import React, { useState, useEffect } from 'react';
import { CATEGORIES } from './types';
import type { Transaction, Budget, SavingsGoal } from './types';
import LandingPage from './components/LandingPage';
import Charts from './components/Charts';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetManager from './components/BudgetManager';
import SavingsTracker from './components/SavingsTracker';
import { CategoryIcon } from './components/CategoryIcon';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  Trash2, 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  Target, 
  LogOut
} from 'lucide-react';

// --- Seed Data ---
const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Senior Software Dev Salary',
    amount: 5200,
    type: 'income',
    category: 'salary',
    date: '2026-07-01',
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly company salary payment'
  },
  {
    id: 'tx-2',
    description: 'Apartment Monthly Rent',
    amount: 1450,
    type: 'expense',
    category: 'housing',
    date: '2026-07-02',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'tx-3',
    description: 'Whole Foods Grocery Run',
    amount: 185.50,
    type: 'expense',
    category: 'groceries',
    date: '2026-07-04',
    paymentMethod: 'Debit Card',
    notes: 'Weekly pantry supply'
  },
  {
    id: 'tx-4',
    description: 'Electric & Gas Bill',
    amount: 115,
    type: 'expense',
    category: 'utilities',
    date: '2026-07-05',
    paymentMethod: 'Mobile Payment'
  },
  {
    id: 'tx-5',
    description: 'Mobile App Freelance Gig',
    amount: 1800,
    type: 'income',
    category: 'freelance',
    date: '2026-07-08',
    paymentMethod: 'Crypto',
    notes: 'Completed onboarding flow mockup contract'
  },
  {
    id: 'tx-6',
    description: 'Concert Tickets & Dinner',
    amount: 240,
    type: 'expense',
    category: 'entertainment',
    date: '2026-07-10',
    paymentMethod: 'Credit Card',
    notes: 'Post Malone tickets + sushi'
  },
  {
    id: 'tx-7',
    description: 'Sneaker Shopping',
    amount: 135,
    type: 'expense',
    category: 'shopping',
    date: '2026-07-11',
    paymentMethod: 'Credit Card'
  }
];

const DEFAULT_BUDGETS: Budget[] = [
  { category: 'groceries', limit: 500 },
  { category: 'entertainment', limit: 250 },
  { category: 'utilities', limit: 200 },
  { category: 'shopping', limit: 300 }
];

const DEFAULT_GOALS: SavingsGoal[] = [
  {
    id: 'g-1',
    name: 'Emergency Fund (6 Months)',
    target: 15000,
    current: 4500,
    deadline: '2026-12-31'
  },
  {
    id: 'g-2',
    name: 'Europe Summer Trip',
    target: 6000,
    current: 2400,
    deadline: '2027-06-30'
  }
];

export const App: React.FC = () => {
  // Views: 'landing' or 'dashboard'
  const [view, setView] = useState<'landing' | 'dashboard'>(() => {
    const savedView = localStorage.getItem('finflow_view');
    return (savedView as any) || 'landing';
  });

  // Theme: 'light' or 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('finflow_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    // Fallback to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  // Core Data States
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finflow_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('finflow_budgets');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('finflow_goals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  // UI Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'savings'>('overview');
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  // Syncing with localStorage
  useEffect(() => {
    localStorage.setItem('finflow_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('finflow_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('finflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finflow_goals', JSON.stringify(goals));
  }, [goals]);

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Net worth / General Balance
  const netWorth = totalIncome - totalExpense;

  // Recent transactions list (for Overview dashboard)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Currency Formatter
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amt);
  };

  // Transaction Handlers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Budget Handlers
  const handleSaveBudget = (budget: Budget) => {
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.category === budget.category);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = budget;
        return next;
      }
      return [...prev, budget];
    });
  };

  const handleDeleteBudget = (category: string) => {
    setBudgets((prev) => prev.filter((b) => b.category !== category));
  };

  // Savings Handlers
  const handleAddGoal = (newGoal: Omit<SavingsGoal, 'id'>) => {
    const goal: SavingsGoal = {
      ...newGoal,
      id: `g-${Date.now()}`
    };
    setGoals((prev) => [...prev, goal]);
  };

  const handleUpdateGoalProgress = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          // If we add funds, we deduct it from transactions as a transfers/savings category expense (optional, but let's keep it simple: just update target)
          return {
            ...g,
            current: Math.min(g.current + amount, g.target)
          };
        }
        return g;
      })
    );

    // Optionally create a transaction representing this savings contribution
    const matchedGoal = goals.find(g => g.id === id);
    if (matchedGoal) {
      handleAddTransaction({
        description: `Savings Contribution: ${matchedGoal.name}`,
        amount: amount,
        type: 'expense',
        category: 'other_expense',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        notes: `Manual allocation to savings target`
      });
    }
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Backup & Import
  const handleExportData = () => {
    const backup = {
      transactions,
      budgets,
      goals,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data.transactions) && Array.isArray(data.budgets) && Array.isArray(data.goals)) {
          setTransactions(data.transactions);
          setBudgets(data.budgets);
          setGoals(data.goals);
          alert('Data imported successfully!');
        } else {
          alert('Invalid backup file structure. Import aborted.');
        }
      } catch (err) {
        alert('Failed to parse the backup file. Ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all transactions, budgets, and savings goals? This action cannot be undone.')) {
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
    }
  };

  if (view === 'landing') {
    return <LandingPage onLaunchApp={() => setView('dashboard')} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        {/* Brand and tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={16} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              Fin<span className="gradient-text">Flow</span>
            </span>
          </div>

          {/* Quick Balance Widget */}
          <div className="card" style={{ padding: '16px', background: 'var(--bg-card)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Balance</span>
            <h4 style={{
              fontSize: '20px',
              fontWeight: 800,
              color: netWorth >= 0 ? 'var(--text-primary)' : 'var(--danger)',
              marginTop: '4px'
            }}>
              {formatCurrency(netWorth)}
            </h4>
          </div>

          {/* Nav List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px',
                backgroundColor: activeTab === 'overview' ? 'var(--border)' : 'transparent',
                color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-secondary)',
                width: '100%', textAlign: 'left', transition: 'all var(--transition-fast)'
              }}
            >
              <LayoutDashboard size={18} /> Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px',
                backgroundColor: activeTab === 'transactions' ? 'var(--border)' : 'transparent',
                color: activeTab === 'transactions' ? 'var(--primary)' : 'var(--text-secondary)',
                width: '100%', textAlign: 'left', transition: 'all var(--transition-fast)'
              }}
            >
              <Receipt size={18} /> Transactions
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px',
                backgroundColor: activeTab === 'budgets' ? 'var(--border)' : 'transparent',
                color: activeTab === 'budgets' ? 'var(--primary)' : 'var(--text-secondary)',
                width: '100%', textAlign: 'left', transition: 'all var(--transition-fast)'
              }}
            >
              <PiggyBank size={18} /> Monthly Budgets
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px',
                backgroundColor: activeTab === 'savings' ? 'var(--border)' : 'transparent',
                color: activeTab === 'savings' ? 'var(--primary)' : 'var(--text-secondary)',
                width: '100%', textAlign: 'left', transition: 'all var(--transition-fast)'
              }}
            >
              <Target size={18} /> Savings Goals
            </button>
          </nav>
        </div>

        {/* Footer controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Action links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '6px 8px'
            }}>
              <Upload size={14} /> Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
            <button
              onClick={handleExportData}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)',
                background: 'none', border: 'none', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', padding: '6px 8px', width: '100%', textAlign: 'left'
              }}
            >
              <Download size={14} /> Export Backup
            </button>
            <button
              onClick={handleClearAllData}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)',
                background: 'none', border: 'none', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', padding: '6px 8px', width: '100%', textAlign: 'left'
              }}
            >
              <Trash2 size={14} /> Reset Storage
            </button>
          </div>

          {/* Theme & Return to Landing */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                background: 'none', border: '1px solid var(--border)', cursor: 'pointer',
                color: 'var(--text-primary)', width: '36px', height: '36px',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button
              onClick={() => setView('landing')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
                gap: '6px', fontSize: '12px', fontWeight: 600
              }}
              title="Return to Landing Page"
            >
              <LogOut size={14} /> Landing
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace content */}
      <main style={{
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        overflowY: 'auto',
        height: '100vh'
      }}>
        {/* Workspace Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Hello, Welcome back!</h2>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Here is your financial status overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
            </span>
          </div>

          <button
            onClick={() => setIsAddTxOpen(true)}
            className="btn btn-primary"
            style={{ padding: '12px 20px', borderRadius: 'var(--radius-sm)' }}
          >
            <Plus size={18} /> Add Transaction
          </button>
        </header>

        {/* Tab views switcher */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Quick Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: 'var(--success-bg)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--success)'
                }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Income</span>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', color: 'var(--success)' }}>
                    {formatCurrency(totalIncome)}
                  </h4>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: 'var(--danger-bg)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--danger)'
                }}>
                  <TrendingDown size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Expenses</span>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', color: 'var(--danger)' }}>
                    {formatCurrency(totalExpense)}
                  </h4>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                }}>
                  <Wallet size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Savings Rate</span>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
                    {totalIncome > 0 ? `${((totalIncome - totalExpense) / totalIncome * 100).toFixed(0)}%` : '0%'}
                  </h4>
                </div>
              </div>
            </div>

            {/* SVG Charts */}
            <Charts transactions={transactions} />

            {/* Quick sections bottom grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              {/* Recent Transactions List */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Transactions</h3>
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}
                  >
                    View All
                  </button>
                </div>

                {recentTransactions.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
                    No recent activity
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {recentTransactions.map((t) => {
                      const opt = CATEGORIES[t.type].find(c => c.value === t.category) || {
                        label: t.category, color: '#7A869A', icon: 'HelpCircle'
                      };
                      return (
                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '8px',
                              backgroundColor: `${opt.color}15`, display: 'flex',
                              alignItems: 'center', justifyContent: 'center'
                            }}>
                              <CategoryIcon name={opt.icon} color={opt.color} size={15} />
                            </div>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 600 }}>{t.description}</p>
                              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          <span style={{
                            fontSize: '14px', fontWeight: 700,
                            color: t.type === 'expense' ? 'var(--danger)' : 'var(--success)'
                          }}>
                            {t.type === 'expense' ? '-' : '+'}
                            {formatCurrency(t.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Active Savings Goals summary */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Savings Targets</h3>
                  <button 
                    onClick={() => setActiveTab('savings')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}
                  >
                    Manage Goals
                  </button>
                </div>

                {goals.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
                    No savings goals configured
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {goals.slice(0, 3).map((g) => {
                      const percent = g.target > 0 ? (g.current / g.target) * 100 : 0;
                      return (
                        <div key={g.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                            <span>{g.name}</span>
                            <span style={{ color: 'var(--primary)' }}>{percent.toFixed(0)}%</span>
                          </div>
                          <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)' }}>
                            <span>{formatCurrency(g.current)} saved</span>
                            <span>Target: {formatCurrency(g.target)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="card animate-fade-in">
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={handleDeleteTransaction} 
            />
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="animate-fade-in">
            <BudgetManager 
              budgets={budgets} 
              transactions={transactions} 
              onSaveBudget={handleSaveBudget} 
              onDeleteBudget={handleDeleteBudget} 
            />
          </div>
        )}

        {activeTab === 'savings' && (
          <div className="animate-fade-in">
            <SavingsTracker 
              goals={goals} 
              onAddGoal={handleAddGoal} 
              onUpdateGoalProgress={handleUpdateGoalProgress} 
              onDeleteGoal={handleDeleteGoal} 
            />
          </div>
        )}
      </main>

      {/* Floating Add Transaction Modal dialog overlay */}
      {isAddTxOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div 
            className="card" 
            style={{ 
              width: '90%', 
              maxWidth: '480px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              backgroundColor: 'var(--bg-card)', 
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            <TransactionForm 
              onAddTransaction={(tx) => {
                handleAddTransaction(tx);
                setIsAddTxOpen(false);
              }} 
              onClose={() => setIsAddTxOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
