import React, { useState, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../types';
import type { Transaction, TransactionType } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Plus, X, Calendar, DollarSign, Tag, FileText, CreditCard } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onClose?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, onClose }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Reset category when type changes
  useEffect(() => {
    setCategory(CATEGORIES[type][0]?.value || '');
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    onAddTransaction({
      description: description.trim(),
      amount: numAmount,
      type,
      category,
      date,
      paymentMethod,
      notes: notes.trim() || undefined
    });

    // Reset Form
    setDescription('');
    setAmount('');
    setNotes('');
    setError('');
    
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Add New Transaction</h3>
        {onClose && (
          <button 
            type="button" 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '14px',
          fontWeight: 500,
          borderLeft: '4px solid var(--danger)'
        }}>
          {error}
        </div>
      )}

      {/* Income / Expense Toggle */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        backgroundColor: 'var(--border)',
        padding: '4px',
        borderRadius: 'var(--radius-sm)',
        position: 'relative'
      }}>
        <button
          type="button"
          onClick={() => setType('expense')}
          style={{
            padding: '10px',
            borderRadius: 'calc(var(--radius-sm) - 2px)',
            border: 'none',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: type === 'expense' ? 'var(--danger)' : 'transparent',
            color: type === 'expense' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)'
          }}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          style={{
            padding: '10px',
            borderRadius: 'calc(var(--radius-sm) - 2px)',
            border: 'none',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: type === 'income' ? 'var(--success)' : 'transparent',
            color: type === 'income' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)'
          }}
        >
          Income
        </button>
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FileText size={14} /> Description
        </label>
        <input
          type="text"
          placeholder="e.g., Weekly Groceries, Salary payment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={80}
        />
      </div>

      {/* Amount & Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={14} /> Amount
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '15px'
            }}>$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ paddingLeft: '28px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Category selection - Grid style for rich aesthetics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag size={14} /> Category
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '8px',
          maxHeight: '160px',
          overflowY: 'auto',
          padding: '4px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-app)'
        }}>
          {CATEGORIES[type].map((opt) => {
            const isSelected = category === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '6px',
                  border: isSelected ? `2px solid ${opt.color}` : '2px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--bg-card)' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? `${opt.color}15` : 'var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-fast)'
                }}>
                  <CategoryIcon name={opt.icon} color={opt.color} size={16} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 500, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap' }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CreditCard size={14} /> Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Notes (Optional)</label>
        <textarea
          rows={2}
          placeholder="Add extra details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ resize: 'none' }}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
        <Plus size={18} /> Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
