import React, { useState } from 'react';

const initialProgress = [
  { id: 1, subject: 'Statistics', percent: 80 },
  { id: 2, subject: 'Software Engineering', percent: 60 },
  { id: 3, subject: 'Operating System', percent: 45 },
  { id: 4, subject: 'Networks', percent: 90 },
];

function getColor(name) {
  const colors = [
    'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)',
    'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
    'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
    'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
    'linear-gradient(90deg, #c471f5 0%, #fa71cd 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Progress() {
  const [progress, setProgress] = useState(initialProgress);

  const handleChange = (id, value) => {
    setProgress(progress.map(p => p.id === id ? { ...p, percent: Number(value) } : p));
  };

  const overall = Math.round(progress.reduce((sum, p) => sum + p.percent, 0) / progress.length);

  return (
    <div style={{ minHeight: '100vh', padding: 40 }}>
      <div className="card" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, padding: 36 }}>
        <h2 className="page-title" style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 32, letterSpacing: 1 }}>Progress Overview</h2>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Overall Progress</div>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#6a11cb' }}>{overall}%</div>
          <div style={{ height: 16, background: '#eee', borderRadius: 8, margin: '12px auto', width: '80%' }}>
            <div style={{ width: `${overall}%`, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', height: '100%', borderRadius: 8, transition: 'width 0.5s' }}></div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, marginTop: 12 }}>
          {progress.map(subj => (
            <div
              key={subj.id}
              style={{
                flex: '1 1 260px',
                minWidth: 260,
                background: '#fafbfc',
                borderRadius: 18,
                boxShadow: '0 2px 12px #e3e0ff',
                padding: 28,
                borderTop: `8px solid transparent`,
                borderImage: `${getColor(subj.subject)} 1`,
                position: 'relative',
                transition: 'box-shadow 0.2s',
                marginBottom: 8,
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px #c471f5'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px #e3e0ff'}
            >
              <div style={{ fontWeight: 'bold', fontSize: 22, color: '#333', marginBottom: 8 }}>{subj.subject}</div>
              <div style={{ height: 16, background: '#eee', borderRadius: 8, width: '100%', marginBottom: 8 }}>
                <div style={{ width: `${subj.percent}%`, background: getColor(subj.subject), height: '100%', borderRadius: 8, transition: 'width 0.5s' }}></div>
              </div>
              <div style={{ fontSize: 15, color: '#6a11cb', marginBottom: 8 }}>{subj.percent}%</div>
              <input
                type="range"
                min={0}
                max={100}
                value={subj.percent}
                onChange={e => handleChange(subj.id, e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          ))}
          {progress.length === 0 && (
            <div style={{ color: '#888', fontStyle: 'italic', fontSize: 18, margin: '40px auto' }}>No subjects found.</div>
          )}
        </div>
      </div>
    </div>
  );
}