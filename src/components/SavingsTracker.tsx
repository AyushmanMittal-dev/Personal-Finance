import React, { useState } from 'react';
import type { SavingsGoal } from '../types';
import { Plus, Target, Calendar, Sparkles, PlusCircle } from 'lucide-react';

interface SavingsTrackerProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateGoalProgress: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export const SavingsTracker: React.FC<SavingsTrackerProps> = ({
  goals,
  onAddGoal,
  onUpdateGoalProgress,
  onDeleteGoal
}) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  
  // Track which goal is currently receiving manual contributions
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');

  // Format Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please name your savings goal');
      return;
    }

    const targetNum = parseFloat(target);
    if (isNaN(targetNum) || targetNum <= 0) {
      setError('Please set a valid target amount');
      return;
    }

    const currentNum = current ? parseFloat(current) : 0;
    if (isNaN(currentNum) || currentNum < 0) {
      setError('Initial savings cannot be negative');
      return;
    }

    onAddGoal({
      name: name.trim(),
      target: targetNum,
      current: currentNum,
      deadline: deadline || undefined
    });

    // Reset Form
    setName('');
    setTarget('');
    setCurrent('');
    setDeadline('');
  };

  const handleContribute = (goalId: string) => {
    const amt = parseFloat(contributionAmount);
    if (isNaN(amt) || amt <= 0) return;

    onUpdateGoalProgress(goalId, amt);
    setContributionAmount('');
    setContributeGoalId(null);
  };

  // Summary Metrics
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const overallPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      
      {/* Create New Goal */}
      <div className="card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} style={{ color: 'var(--primary)' }} /> Set a Savings Goal
        </h3>

        <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ fontSize: '13px', color: 'var(--danger)', backgroundColor: 'var(--danger-bg)', padding: '8px 12px', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Goal Name</label>
            <input
              type="text"
              placeholder="e.g., Tesla Downpayment, House Fund..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Target ($)</label>
              <input
                type="number"
                placeholder="5,000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Saved already ($)</label>
              <input
                type="number"
                placeholder="0"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Date (Optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Plus size={16} /> Create Goal
          </button>
        </form>
      </div>

      {/* Goal List and Overall Stats */}
      <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header Stats */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--border)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Active Goals</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Savings: {formatCurrency(totalSaved)}</p>
          </div>
          {totalTarget > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>Overall {overallPercentage.toFixed(0)}% Completed</span>
              <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${overallPercentage}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '99px' }} />
              </div>
            </div>
          )}
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
          }}>
            <Sparkles size={36} style={{ opacity: 0.3, color: 'var(--primary)' }} />
            <p style={{ fontSize: '14px' }}>Establish your first savings goal and trace your growth!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {goals.map((g) => {
              const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
              const isCompleted = g.current >= g.target;
              const isContributeActive = contributeGoalId === g.id;

              return (
                <div
                  key={g.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    backgroundColor: 'var(--bg-card-hover)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Confetti decoration for completed goals */}
                  {isCompleted && (
                    <div style={{
                      position: 'absolute', top: '-10px', right: '-10px',
                      backgroundColor: 'var(--success)', color: '#fff',
                      fontSize: '9px', fontWeight: 700, padding: '16px 12px 4px',
                      transform: 'rotate(45deg)', transformOrigin: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      DONE
                    </div>
                  )}

                  {/* Goal Metadata */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: isCompleted ? '28px' : '0' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</span>
                      <button
                        onClick={() => onDeleteGoal(g.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-tertiary)', fontSize: '11px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                      >
                        Delete
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(g.current)}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>target: {formatCurrency(g.target)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border)', borderRadius: '99px', margin: '8px 0', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(pct, 100)}%`, height: '100%',
                        backgroundColor: isCompleted ? 'var(--success)' : 'var(--primary)',
                        borderRadius: '99px', transition: 'width 0.5s ease'
                      }} />
                    </div>

                    {/* Percent completed & Deadline */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span>{pct.toFixed(0)}% Saved</span>
                      {g.deadline && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={11} /> {new Date(g.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Manual add funds action */}
                  {!isCompleted && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                      {isContributeActive ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="number"
                            placeholder="Amount ($)"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            style={{ padding: '6px 10px', fontSize: '13px', flex: 1 }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleContribute(g.id)}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setContributeGoalId(null);
                              setContributionAmount('');
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '13px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setContributeGoalId(g.id)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '6px', background: 'none', border: '1px dashed var(--primary)',
                            color: 'var(--primary)', padding: '6px', borderRadius: '4px',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                            transition: 'all var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--primary)';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--primary)';
                          }}
                        >
                          <PlusCircle size={14} /> Add Savings
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsTracker;
