import React, { useState } from 'react';
import { CATEGORIES } from '../types';
import type { Budget, Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Plus, Trash2, PiggyBank, Award, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onSaveBudget: (budget: Budget) => void;
  onDeleteBudget: (category: string) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  transactions,
  onSaveBudget,
  onDeleteBudget
}) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.expense[0]?.value || '');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  // Format Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate actual spending for each category in current month
  const currentMonthExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const tDate = new Date(t.date);
    const now = new Date();
    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
  });

  const getExpensesByCategory = (category: string) => {
    return currentMonthExpenses
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      setError('Please enter a valid monthly limit');
      return;
    }

    onSaveBudget({
      category: selectedCategory,
      limit: parsedLimit
    });

    setLimit('');
  };



  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
      
      {/* Set / Edit Budgets Card */}
      <div className="card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PiggyBank size={20} style={{ color: 'var(--primary)' }} /> Monthly Budget Settings
        </h3>

        <form onSubmit={handleAddBudget} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ fontSize: '13px', color: 'var(--danger)', backgroundColor: 'var(--danger-bg)', padding: '8px 12px', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.expense.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Monthly Limit</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 500 }}>$</span>
              <input
                type="number"
                placeholder="Limit amount"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                style={{ paddingLeft: '24px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Plus size={16} /> Save Budget Limit
          </button>
        </form>
      </div>

      {/* Budgets Tracker Card */}
      <div className="card" style={{ gridColumn: 'span 2' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} style={{ color: 'var(--primary)' }} /> Budget Limits & Spending
        </h3>

        {budgets.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
          }}>
            <PiggyBank size={36} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '14px' }}>No monthly budget limits set yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {budgets.map((b) => {
              const catOpt = CATEGORIES.expense.find(c => c.value === b.category) || {
                label: b.category,
                color: '#7A869A',
                icon: 'HelpCircle'
              };
              
              const spent = getExpensesByCategory(b.category);
              const percent = b.limit > 0 ? (spent / b.limit) * 100 : 0;
              const remaining = b.limit - spent;

              // Determine color themes based on percentage
              let progressColor = 'var(--success)';
              let statusIcon = <CheckCircle size={14} style={{ color: 'var(--success)' }} />;
              
              if (percent > 100) {
                progressColor = 'var(--danger)';
                statusIcon = <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />;
              } else if (percent > 80) {
                progressColor = 'var(--warning)';
                statusIcon = <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />;
              }

              return (
                <div key={b.category} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Title and stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        backgroundColor: `${catOpt.color}15`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <CategoryIcon name={catOpt.icon} color={catOpt.color} size={16} />
                      </div>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{catOpt.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          {statusIcon}
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {percent > 100 
                              ? `Overspent by ${formatCurrency(Math.abs(remaining))}`
                              : `${formatCurrency(remaining)} remaining`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{formatCurrency(spent)}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}> / {formatCurrency(b.limit)}</span>
                      </div>
                      <button
                        onClick={() => onDeleteBudget(b.category)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-tertiary)', padding: '6px', borderRadius: '4px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar container */}
                  <div style={{
                    width: '100%', height: '8px', borderRadius: '99px',
                    backgroundColor: 'var(--border)', overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${Math.min(percent, 100)}%`,
                      height: '100%',
                      borderRadius: '99px',
                      backgroundColor: progressColor,
                      transition: 'width var(--transition-slow)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
