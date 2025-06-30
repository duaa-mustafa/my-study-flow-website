import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

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
  const { t } = useSettings();
  const [progress, setProgress] = useState(initialProgress);

  const handleChange = (id, value) => {
    setProgress(progress.map(p => p.id === id ? { ...p, percent: Number(value) } : p));
  };

  const overall = Math.round(progress.reduce((sum, p) => sum + p.percent, 0) / progress.length);

  return (
    <div id="main-content" style={{ minHeight: '100vh', padding: 40 }}>
      <div className="card">
        <h2 className="page-title">{t('progressOverview')}</h2>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div>{t('overallProgress')}</div>
          <div className="overall-progress-value">{overall}%</div>
          <div className="overall-progress-bar-bg">
            <div className="overall-progress-bar" style={{ width: `${overall}%` }}></div>
          </div>
        </div>
        <div className="progress-grid">
          {progress.map(subj => (
            <div key={subj.id} className="progress-card">
              <div className="progress-card-top" style={{ background: getColor(subj.subject) }}></div>
              <div className="section-title">{subj.subject}</div>
              <div className="progress-value" style={{ color: getColor(subj.subject).includes('gradient') ? undefined : getColor(subj.subject) }}>{subj.percent}%</div>
              <div className="progress-bar-main">
                <div className="progress-bar-main-fill" style={{ width: `${subj.percent}%`, background: getColor(subj.subject) }}></div>
              </div>
              <input type="range" min={0} max={100} value={subj.percent} onChange={e => handleChange(subj.id, e.target.value)} />
            </div>
          ))}
          {progress.length === 0 && (
            <div className="card-empty">{t('noSubjects')}</div>
          )}
        </div>
      </div>
    </div>
  );
}