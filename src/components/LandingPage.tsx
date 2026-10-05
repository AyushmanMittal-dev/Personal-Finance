import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, Shield, PiggyBank, Target, ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-app)',
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 40%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 24px',
      overflowX: 'hidden'
    }}>
      {/* Navbar */}
      <header style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '64px',
        animation: 'fadeIn 0.6s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <DollarSign size={22} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
            Fin<span className="gradient-text">Flow</span>
          </span>
        </div>

        <button onClick={onLaunchApp} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '99px' }}>
          Launch App <ArrowRight size={16} />
        </button>
      </header>

      {/* Hero Section */}
      <main style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '48px',
        alignItems: 'center',
        marginBottom: '80px',
      }}>
        {/* Hero Left: Text & CTA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          animation: 'slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--border)',
            padding: '6px 14px',
            borderRadius: '99px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--primary)'
          }}>
            <Sparkles size={14} /> Local-first & offline finance companion
          </div>

          <h1 style={{
            fontSize: '56px',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-2px',
            color: 'var(--text-primary)',
            textAlign: 'left',
            margin: '0'
          }}>
            Take Control of Your <br />
            Money. Master Your <br />
            <span className="gradient-text">Cash Flow.</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            textAlign: 'left',
            maxWidth: '520px',
            lineHeight: 1.6
          }}>
            FinFlow is a next-generation personal finance assistant built to track expenses, manage budgets, and grow savings in one gorgeous workspace.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              onClick={onLaunchApp} 
              className="btn btn-primary" 
              style={{ padding: '16px 32px', fontSize: '16px', borderRadius: 'var(--radius-md)' }}
            >
              Start Tracking Now
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('features');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="btn btn-outline" 
              style={{ padding: '16px 28px', fontSize: '16px', borderRadius: 'var(--radius-md)' }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Right: Gorgeous Mockup */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Main Mockup Card representing balance */}
          <div className="card glass animate-float" style={{
            width: '360px',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 2
          }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Worth Balance</span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>$14,285.50</h2>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--success)', backgroundColor: 'var(--success-bg)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>+12.4% this month</span>
              </div>
            </div>

            {/* Micro mock sparkline chart */}
            <svg width="100%" height="80" viewBox="0 0 100 80">
              <defs>
                <linearGradient id="mockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 60 Q 20 40 40 50 T 80 20 T 100 10 L 100 80 L 0 80 Z" fill="url(#mockGrad)" />
              <path d="M 0 60 Q 20 40 40 50 T 80 20 T 100 10" fill="none" stroke="var(--primary)" strokeWidth="2.5" />
            </svg>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowDownLeft size={14} style={{ color: 'var(--success)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Income</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success)' }}>+$4,200</div>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={14} style={{ color: 'var(--danger)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Expenses</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--danger)' }}>-$1,914</div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Mockup Card (Budget warning overlay) */}
          <div className="card glass" style={{
            position: 'absolute',
            bottom: '-30px',
            right: '-10px',
            width: '220px',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeIn 1s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700 }}>Entertainment Budget</span>
              <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>88% Used</span>
            </div>
            <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: '88%', height: '100%', backgroundColor: 'var(--warning)' }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>$220 spent of $250 limit</div>
          </div>

          {/* Tertiary Mockup Card (Savings target overlay) */}
          <div className="card glass" style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            width: '200px',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
            }}>
              <PiggyBank size={16} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Japan Trip Goal</div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>$3,500 / $5,000</div>
            </div>
          </div>

          {/* Glowing backdrops */}
          <div style={{
            position: 'absolute', width: '300px', height: '300px',
            borderRadius: '50%', background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 60%)',
            opacity: 0.2, filter: 'blur(50px)', zIndex: 0
          }} />
        </div>
      </main>

      {/* Features Section */}
      <section id="features" style={{
        width: '100%',
        maxWidth: '1200px',
        paddingTop: '64px',
        marginBottom: '64px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>
          Master Your Finance Toolkit
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 48px auto' }}>
          FinFlow packs institutional grade tracking concepts into a simple, beautiful, and localized dashboard.
        </p>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {/* Card 1: Charts */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
            }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Visual Financial Analytics</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Clean, responsive, interactive SVG charts detail where every dollar flows. Instant, automated expense categories.
            </p>
          </div>

          {/* Card 2: Budgets */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--warning)'
            }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Smart Budgeting Limits</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Set monthly spending thresholds on specific categories. Dynamic progress bars change warning states to alert you ahead of limits.
            </p>
          </div>

          {/* Card 3: Savings */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--success)'
            }}>
              <PiggyBank size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Savings Target Goals</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Establish milestone objectives (Emergency fund, vacations, purchases). Funnel money directly into targets and track overall completeness.
            </p>
          </div>

          {/* Card 4: Local Safe */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: 'rgba(244, 63, 94, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--danger)'
            }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Privacy First Storage</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              No logins, no linking bank credentials, no cloud exposure. Your financial data is securely kept in your local browser storage.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        width: '100%',
        maxWidth: '1200px',
        borderTop: '1px solid var(--border)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px'
      }}>
        <span>&copy; 2026 FinFlow Tracker. Built for financial clarity.</span>
        <button onClick={onLaunchApp} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>
          Open Workspace
        </button>
      </footer>
    </div>
  );
};

export default LandingPage;
