import React, { useState } from 'react';
import { CATEGORIES } from '../types';
import type { Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Search, Filter, Trash2, Calendar, CreditCard } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Format Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get active categories list for filtering
  const allCategories = [...CATEGORIES.expense, ...CATEGORIES.income];

  // Filtering logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (CATEGORIES[t.type].find(c => c.value === t.category)?.label || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Sorting logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  // Helper to find category info
  const getCategoryInfo = (t: Transaction) => {
    return CATEGORIES[t.type].find(c => c.value === t.category) || {
      label: t.category,
      color: '#7A869A',
      icon: 'HelpCircle'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header and Sorting / Filters bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>History</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Showing {sortedTransactions.length} of {transactions.length} transactions
          </span>
        </div>

        {/* Filters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          alignItems: 'center'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
            <input
              type="text"
              placeholder="Search description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {/* Filter categories depending on Type filter */}
            {(typeFilter === 'all' 
              ? allCategories 
              : CATEGORIES[typeFilter]
            ).map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      {sortedTransactions.length === 0 ? (
        <div className="card" style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <Filter size={36} style={{ opacity: 0.3 }} />
          <p style={{ fontSize: '15px' }}>No transactions match your filters</p>
          {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setCategoryFilter('all');
              }}
              className="btn btn-outline"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
          {sortedTransactions.map((t) => {
            const cat = getCategoryInfo(t);
            const isExpense = t.type === 'expense';
            return (
              <div
                key={t.id}
                className="card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  gap: '16px',
                  animation: 'slideUp 0.3s ease forwards'
                }}
              >
                {/* Left side: Icon & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: `${cat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CategoryIcon name={cat.icon} color={cat.color} size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600,
                      fontSize: '15px',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {t.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: cat.color, backgroundColor: `${cat.color}10`, padding: '2px 6px', borderRadius: '4px' }}>
                        {cat.label}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} /> {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CreditCard size={11} /> {t.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Amount & Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: isExpense ? 'var(--danger)' : 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      {isExpense ? '-' : '+'}
                      {formatCurrency(t.amount)}
                    </span>
                    {t.notes && (
                      <span 
                        title={t.notes}
                        style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', cursor: 'help', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {t.notes}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteTransaction(t.id)}
                    title="Delete Transaction"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      padding: '6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--danger)';
                      e.currentTarget.style.backgroundColor = 'var(--danger-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
