import React, { useState } from 'react';

const badges = [
  { icon: '⭐', label: 'Consistency' },
  { icon: '🏆', label: 'Top Scorer' },
  { icon: '🔥', label: 'Streak Master' },
  { icon: '💡', label: 'Quiz Whiz' },
];

export default function Rewards() {
  const [xp, setXp] = useState(3745);
  const [level, setLevel] = useState(14);
  const [streak, setStreak] = useState(12);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [loginStreak, setLoginStreak] = useState([true, true, true, true, true, false, false, false, false, false]);

  const claimBonus = () => {
    setBonusClaimed(true);
    setXp(xp + 150);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(106,17,203,0.10)', padding: 36, marginTop: 32 }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 28, color: '#6a11cb', marginBottom: 8 }}>Rewards & Streak System</h2>
      <div style={{ color: '#888', fontSize: 17, marginBottom: 24 }}>Track your progress, earn rewards, and maintain your study streak</div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 220, background: '#f3eaff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e3e0ff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: 18, color: '#6a11cb', marginBottom: 8 }}>Level {level}: Knowledge Seeker</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#2575fc', marginBottom: 8 }}>{xp.toLocaleString()} XP</div>
          <div style={{ width: '100%', background: '#fff', borderRadius: 8, height: 14, marginBottom: 8 }}>
            <div style={{ width: `${(xp % 1000) / 10}%`, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', height: 14, borderRadius: 8, transition: 'width 0.3s' }}></div>
          </div>
          <div style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 15 }}>+150 XP today</div>
          <button onClick={claimBonus} disabled={bonusClaimed} style={{ background: bonusClaimed ? '#ccc' : 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 15, marginTop: 12, cursor: bonusClaimed ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #e3e0ff' }}>{bonusClaimed ? 'Bonus Claimed' : 'Claim Daily Bonus'}</button>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#f7f8fa', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e3e0ff', textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Current Streak</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#6a11cb', marginBottom: 8 }}>{streak} days</div>
          <div style={{ color: '#888', fontSize: 14 }}>You're on fire! Keep your streak going.</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#f7f8fa', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e3e0ff', textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Badges Earned</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 8 }}>
            {badges.map(b => (
              <span key={b.label} title={b.label} style={{ fontSize: 28, background: '#fff', borderRadius: '50%', padding: 8, boxShadow: '0 1px 4px #e3e0ff' }}>{b.icon}</span>
            ))}
          </div>
          <button style={{ background: '#e3fcec', color: '#2575fc', border: 'none', borderRadius: 8, padding: '7px 14px', fontWeight: 'bold', fontSize: 14, cursor: 'pointer' }}>View All Badges</button>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e3e0ff', marginTop: 18 }}>
        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Daily Login Streak</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          {loginStreak.map((s, i) => (
            <span key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: s ? '#43e97b' : '#eee', color: s ? '#fff' : '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>{s ? '✓' : i + 1}</span>
          ))}
        </div>
        <div style={{ color: '#888', fontSize: 14 }}>Reach 8 days to unlock the "Consistency Master" badge and 200 XP bonus!</div>
      </div>
    </div>
  );
} 