import React, { useState } from 'react';
import { CATEGORIES } from '../types';
import type { Transaction } from '../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ChartsProps {
  transactions: Transaction[];
}

export const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  // Filter expenses and income
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const expenseByCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Map category data for donut chart
  const donutData = Object.entries(expenseByCategory).map(([catKey, amount]) => {
    const option = CATEGORIES.expense.find(c => c.value === catKey) || {
      label: 'Other',
      color: '#7A869A',
      icon: 'HelpCircle'
    };
    return {
      key: catKey,
      label: option.label,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: option.color
    };
  }).sort((a, b) => b.amount - a.amount);

  // Donut chart parameters
  const radius = 70;
  const strokeWidth = 24;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * radius;

  // Running balance calculation for area chart (sorted by date)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group running balance by date
  let balancePoints: { date: string; balance: number }[] = [];
  let runningBalance = 0;
  
  if (sortedTransactions.length === 0) {
    balancePoints = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toISOString().split('T')[0], balance: 0 };
    });
  } else {
    // Add initial point
    const firstDate = new Date(sortedTransactions[0].date);
    firstDate.setDate(firstDate.getDate() - 1);
    balancePoints.push({
      date: firstDate.toISOString().split('T')[0],
      balance: 0
    });

    sortedTransactions.forEach(t => {
      if (t.type === 'income') {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
      }
      balancePoints.push({
        date: t.date,
        balance: runningBalance
      });
    });
  }

  // If too many points, sample it to max 10 points for readability
  let displayPoints = balancePoints;
  if (balancePoints.length > 10) {
    const step = Math.ceil(balancePoints.length / 10);
    displayPoints = balancePoints.filter((_, idx) => idx % step === 0 || idx === balancePoints.length - 1);
  }

  // Layout parameters for Area Chart
  const graphWidth = 500;
  const graphHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minVal = displayPoints.length > 0 ? Math.min(...displayPoints.map(p => p.balance), 0) : 0;
  const maxVal = displayPoints.length > 0 ? Math.max(...displayPoints.map(p => p.balance), 1000) : 1000;
  const valRange = maxVal - minVal || 1;

  // Convert points to SVG coordinates
  const svgPoints = displayPoints.map((p, idx) => {
    const x = paddingX + (idx / (displayPoints.length - 1 || 1)) * (graphWidth - paddingX * 2);
    const y = graphHeight - paddingY - ((p.balance - minVal) / valRange) * (graphHeight - paddingY * 2);
    return { x, y, date: p.date, balance: p.balance };
  });

  // SVG paths
  let linePathD = '';
  let areaPathD = '';
  if (svgPoints.length > 0) {
    linePathD = svgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    areaPathD = `${linePathD} L ${svgPoints[svgPoints.length - 1].x} ${graphHeight - paddingY} L ${svgPoints[0].x} ${graphHeight - paddingY} Z`;
  }

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Helper for rendering donut slice
  let accumulatedPercent = 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
      
      {/* Expense Breakdown (Donut) */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={18} style={{ color: 'var(--danger)' }} /> Expense Breakdown
        </h3>
        
        {totalExpenses === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)' }}>
            <DollarSign size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ fontSize: '14px' }}>No expenses recorded yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', flexGrow: 1, justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
              <svg width="100%" height="100%" viewBox="0 0 200 200">
                {donutData.map((slice, index) => {
                  const dashArray = `${(slice.percentage / 100) * circumference} ${circumference}`;
                  const dashOffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += slice.percentage;

                  const isHovered = activeCategoryIndex === index;

                  return (
                    <circle
                      key={slice.key}
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 100 100)"
                      style={{
                        cursor: 'pointer',
                        transition: 'stroke-width 0.2s ease, filter 0.2s ease',
                        filter: isHovered ? 'brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none'
                      }}
                      onMouseEnter={() => setActiveCategoryIndex(index)}
                      onMouseLeave={() => setActiveCategoryIndex(null)}
                    />
                  );
                })}
              </svg>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {activeCategoryIndex !== null ? donutData[activeCategoryIndex].label : 'Total Expense'}
                </span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {formatCurrency(activeCategoryIndex !== null ? donutData[activeCategoryIndex].amount : totalExpenses)}
                </span>
                {activeCategoryIndex !== null && (
                  <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
                    {donutData[activeCategoryIndex].percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            {/* Legend */}
            <div style={{ width: '100%', maxHeight: '180px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', paddingRight: '4px' }}>
              {donutData.map((slice, index) => (
                <div
                  key={slice.key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                    opacity: activeCategoryIndex === null || activeCategoryIndex === index ? 1 : 0.4,
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={() => setActiveCategoryIndex(index)}
                  onMouseLeave={() => setActiveCategoryIndex(null)}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: slice.color, flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{slice.label}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{formatCurrency(slice.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Balance Trend (Area Chart) */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> Cash Flow & Net Worth Trend
        </h3>

        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          {transactions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '240px', color: 'var(--text-secondary)' }}>
              <TrendingUp size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '14px' }}>No transaction history available</p>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%' }}>
              <svg width="100%" height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`} style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yVal = paddingY + ratio * (graphHeight - paddingY * 2);
                  const balanceVal = maxVal - ratio * valRange;
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={yVal}
                        x2={graphWidth - paddingX}
                        y2={yVal}
                        stroke="var(--border)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 8}
                        y={yVal + 4}
                        fill="var(--text-secondary)"
                        fontSize="9"
                        textAnchor="end"
                      >
                        {formatCurrency(balanceVal)}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area */}
                {areaPathD && (
                  <path
                    d={areaPathD}
                    fill="url(#areaGradient)"
                  />
                )}

                {/* Trend Line */}
                {linePathD && (
                  <path
                    d={linePathD}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive circles and Hover lines */}
                {svgPoints.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="var(--bg-card)"
                      stroke="var(--primary)"
                      strokeWidth="2.5"
                      style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                      onMouseEnter={() => {
                        setHoveredPoint({
                          x: p.x,
                          y: p.y,
                          label: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                          value: p.balance
                        });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}

                {/* X Axis Labels */}
                {svgPoints.length > 1 && [svgPoints[0], svgPoints[Math.floor((svgPoints.length - 1) / 2)], svgPoints[svgPoints.length - 1]].map((p, idx) => {
                  if (!p) return null;
                  const dateStr = new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return (
                    <text
                      key={idx}
                      x={p.x}
                      y={graphHeight - 8}
                      fill="var(--text-secondary)"
                      fontSize="9"
                      textAnchor={idx === 0 ? 'start' : idx === 2 ? 'end' : 'middle'}
                    >
                      {dateStr}
                    </text>
                  );
                })}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div style={{
                  position: 'absolute',
                  left: `${(hoveredPoint.x / graphWidth) * 100}%`,
                  top: `${(hoveredPoint.y / graphHeight) * 100 - 32}%`,
                  transform: 'translate(-50%, -100%)',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-card)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-md)',
                  pointerEvents: 'none',
                  zIndex: 10,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <span>{hoveredPoint.label}</span>
                  <span style={{ color: hoveredPoint.value >= 0 ? '#36B37E' : '#FF5630', fontSize: '12px' }}>
                    {formatCurrency(hoveredPoint.value)}
                  </span>
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid var(--text-primary)',
                    position: 'absolute',
                    bottom: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
