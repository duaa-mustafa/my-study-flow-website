import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const badges = [
  { icon: '⭐', label: 'Consistency' },
  { icon: '🏆', label: 'Top Scorer' },
  { icon: '🔥', label: 'Streak Master' },
  { icon: '💡', label: 'Quiz Whiz' },
];

export default function Rewards() {
  const { t } = useSettings();
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
    <div id="main-content">
      <div className="card">
        <h2 className="page-title">{t('rewardsStreakSystem')}</h2>
        <div className="section-title">{t('trackProgressEarnRewards')}</div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <div className="reward-card reward-xp">
            <div className="section-title">{t('level')} {level}: {t('knowledgeSeeker')}</div>
            <div className="xp-value">{xp.toLocaleString()} XP</div>
            <div className="xp-bar-bg">
              <div className="xp-bar" style={{ width: `${(xp % 1000) / 10}%` }}></div>
            </div>
            <div className="today-xp">+150 XP {t('today')}</div>
            <button className="main-btn" disabled={bonusClaimed} onClick={claimBonus}>{bonusClaimed ? t('bonusClaimed') : t('claimDailyBonus')}</button>
          </div>
          <div className="reward-card reward-streak">
            <div className="section-title">{t('currentStreak')}</div>
            <div className="streak-value">{streak} {t('days')}</div>
            <div className="on-fire">{t('youreOnFire')}</div>
        </div>
          <div className="reward-card reward-badges">
            <div className="section-title">{t('badgesEarned')}</div>
            <div className="badges-list">{badges.map(b => <span key={b.label} title={t(b.label.toLowerCase().replace(/ /g, ''))} className="badge-icon">{b.icon}</span>)}</div>
            <button className="main-btn-secondary">{t('viewAllBadges')}</button>
          </div>
        </div>
        <div className="reward-card reward-login-streak">
          <div className="section-title">{t('dailyLoginStreak')}</div>
          <div className="login-streak-list">{loginStreak.map((s, i) => <span key={i} className="login-streak-day">{s ? '\u2713' : i + 1}</span>)}</div>
          <div className="on-fire">{t('reach8DaysUnlock')}</div>
        </div>
      </div>
    </div>
  );
} 