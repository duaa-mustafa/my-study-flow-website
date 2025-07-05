import React, { useState } from 'react';
import { useSettings } from './SettingsContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const badges = [
  { color: '#8e24aa', icon: 'fa-solid fa-award', label: 'Consistency' },
  { color: '#1976d2', icon: 'fa-solid fa-bolt', label: 'Top Scorer' },
  { color: '#43a047', icon: 'fa-solid fa-star', label: 'Streak Master' },
  { color: '#ffa000', icon: 'fa-solid fa-trophy', label: 'Quiz Whiz' },
  { color: '#e53935', icon: 'fa-solid fa-fire', label: 'On Fire' },
  { color: '#757575', icon: 'fa-solid fa-plus', label: 'More' },
];

export default function Rewards() {
  const { t } = useSettings();
  const [xp, setXp] = useState(3745);
  const [level, setLevel] = useState(14);
  const [streak, setStreak] = useState(12);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [loginStreak, setLoginStreak] = useState([true, true, true, true, true, true, true, false, false, false, false, false, false, false, false]);
  const [showHistory, setShowHistory] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const claimBonus = () => {
    setBonusClaimed(true);
    setXp(xp + 125);
  };

  // Calculate progress for XP bar and streak
  const xpToNext = 1000;
  const xpThisLevel = xp % xpToNext;
  const xpPercent = Math.round((xpThisLevel / xpToNext) * 100);
  const badgesEarned = 12;
  const badgesTotal = 36;
  const streakMilestone = 15;
  const daysLeft = streakMilestone - streak;

  return (
    <div id="main-content" style={{ background: 'var(--rewards-bg)', minHeight: '100vh', padding: '0 0 48px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 0 0 0' }}>
        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 18 }}>Rewards & Streak System</h2>
        <div style={{ fontSize: 18, color: '#444', marginBottom: 32 }}>Track your progress, earn rewards, and maintain your study streak</div>
        {/* Top Row */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          {/* XP Card */}
          <div style={{ background: 'linear-gradient(135deg, #7b1fa2 0%, #1976d2 100%)', borderRadius: 18, color: '#fff', flex: 2, minWidth: 280, padding: 32, boxShadow: '0 4px 24px #b3b8d133', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Total XP Points</div>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 1 }}>{xp.toLocaleString()} <span style={{ fontSize: 20, fontWeight: 500 }}>XP</span></div>
            <div style={{ fontSize: 15, opacity: 0.9, marginBottom: 8 }}>Progress to Level {level + 1}</div>
            <div style={{ background: '#fff2', borderRadius: 8, height: 14, width: '100%', marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', height: '100%', width: `${xpPercent}%`, borderRadius: 8, transition: 'width 0.5s' }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <button onClick={() => setShowHistory(!showHistory)} style={{ background: '#fff', color: '#7b1fa2', border: 'none', borderRadius: 8, padding: '4px 14px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #b3b8d1' }}>XP History</button>
              <span style={{ color: '#43e97b', fontWeight: 600, fontSize: 16 }}>+125 XP today</span>
            </div>
            {showHistory && (
              <div style={{ background: '#fff', color: '#333', borderRadius: 8, padding: 12, marginTop: 8, fontSize: 15, boxShadow: '0 2px 8px #b3b8d1' }}>
                <div>+125 XP - Today</div>
                <div>+100 XP - Yesterday</div>
                <div>+200 XP - 2 days ago</div>
                <div>+150 XP - 3 days ago</div>
              </div>
            )}
            <button onClick={claimBonus} disabled={bonusClaimed} style={{ position: 'absolute', top: 24, right: 24, background: bonusClaimed ? '#bbb' : '#fff', color: bonusClaimed ? '#fff' : '#1976d2', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 15, boxShadow: '0 2px 8px #b3b8d1', cursor: bonusClaimed ? 'not-allowed' : 'pointer' }}>
              {bonusClaimed ? 'Bonus Claimed' : 'Daily Bonus Available!'}
            </button>
          </div>
          {/* Streak Card */}
          <div style={{ background: 'var(--rewards-card-bg)', borderRadius: 18, flex: 1, minWidth: 220, padding: 32, boxShadow: '0 4px 24px #b3b8d133', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
            <div style={{ fontWeight: 600, fontSize: 20, color: 'var(--rewards-card-muted)', marginBottom: 8 }}>Current Streak</div>
            <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 8 }}>
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="52" stroke="var(--rewards-card-border)" strokeWidth="12" fill="none" />
                <circle cx="60" cy="60" r="52" stroke="#7b1fa2" strokeWidth="12" fill="none" strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - streak / streakMilestone)} style={{ transition: 'stroke-dashoffset 0.5s' }} />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 36, color: '#7b1fa2' }}>{streak}</div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--rewards-card-muted)', marginBottom: 4 }}>days</div>
            <div style={{ color: '#ff9800', fontWeight: 600, fontSize: 16 }}>Next milestone: {streakMilestone} days</div>
            <div style={{ color: '#43e97b', fontWeight: 600, fontSize: 16, marginTop: 4 }}>{daysLeft > 0 ? `You're on fire!` : 'Milestone reached!'}</div>
          </div>
          {/* Badges Card */}
          <div style={{ background: 'var(--rewards-card-bg)', borderRadius: 18, flex: 1, minWidth: 220, padding: 32, boxShadow: '0 4px 24px #b3b8d133', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
            <div style={{ fontWeight: 600, fontSize: 20, color: 'var(--rewards-card-muted)', marginBottom: 8 }}>Badges Earned</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 48px)', gap: 18, marginBottom: 12 }}>
              {badges.map((b, i) => (
                <span key={b.label} title={b.label} style={{ background: b.color, color: '#fff', borderRadius: 10, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 2px 8px #b3b8d122' }}>
                  {b.icon === 'fa-solid fa-plus' ? '+' : <i className={b.icon} style={{ color: '#fff' }}></i>}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 16, color: 'var(--rewards-card-muted)', marginBottom: 4 }}>{badgesEarned} of {badgesTotal}</div>
            <a href="#" onClick={e => { e.preventDefault(); setShowBadgesModal(true); }} style={{ color: '#1976d2', fontWeight: 600, fontSize: 16, textDecoration: 'underline', marginTop: 4 }}>View All Badges &gt;</a>
          </div>
        </div>
        {/* Daily Login Streak */}
        <div style={{ background: 'var(--rewards-card-bg)', borderRadius: 18, boxShadow: '0 4px 24px #b3b8d133', padding: 32, marginTop: 12, minHeight: 160 }}>
          <div style={{ fontWeight: 600, fontSize: 20, color: 'var(--rewards-card-muted)', marginBottom: 18 }}>Daily Login Streak</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, justifyContent: 'center' }}>
            {loginStreak.map((s, i) => (
              <span key={i} style={{
                background: i === streak ? '#7b1fa2' : s ? '#43e97b' : 'var(--rewards-card-border)',
                color: '#fff',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
                border: i === streak ? '2px solid #1976d2' : 'none',
                boxShadow: i === streak ? '0 2px 8px #b3b8d1' : 'none',
                position: 'relative',
                outline: s ? '2px solid #fff' : 'none',
                transition: 'background 0.2s',
              }}>{i === streak ? 'Today' : s ? '✓' : i + 1}</span>
            ))}
          </div>
          <div style={{ background: '#e3e0ff', color: '#1976d2', borderRadius: 8, padding: 14, fontWeight: 600, fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
            Streak Milestone Reward<br />
            Reach {streakMilestone} days to unlock the <b>"Consistency Master"</b> badge and 200 XP bonus!
          </div>
        </div>
      </div>
      {/* Badges Modal Popup */}
      {showBadgesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--rewards-card-bg)', borderRadius: 18, padding: 36, minWidth: 340, maxWidth: 520, boxShadow: '0 8px 32px #6a11cb33', position: 'relative' }}>
            <button onClick={() => setShowBadgesModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 28, color: 'var(--rewards-card-muted)', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
            <h3 style={{ fontWeight: 700, fontSize: 24, marginBottom: 18, color: '#7b1fa2' }}>All Badges</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
              {badges.map((b, i) => (
                <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80, marginBottom: 8 }}>
                  <span style={{ background: b.color, color: '#fff', borderRadius: 12, padding: '18px 20px', fontWeight: 700, fontSize: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 48, marginBottom: 8 }}>
                    {b.icon === 'fa-solid fa-plus' ? '+' : <i className={b.icon} style={{ color: '#fff' }}></i>}
                  </span>
                  <div style={{ fontWeight: 600, color: 'var(--rewards-card-text)', fontSize: 15, textAlign: 'center' }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 