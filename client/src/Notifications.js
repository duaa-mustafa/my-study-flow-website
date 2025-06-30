import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

export default function Notifications() {
  const { t } = useSettings();
  const [settings, setSettings] = useState({
    deadline: true,
    missed: true,
    motivational: true,
    style: 'both',
  });
  const [alert, setAlert] = useState('');

  const handleToggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const handleStyle = (val) => setSettings(s => ({ ...s, style: val }));

  // Detect dark mode (basic: check if body or parent has 'dark' class)
  const isDark = document.body.classList.contains('dark') || document.documentElement.classList.contains('dark');

  return (
    <div id="main-content" className="card" style={{ maxWidth: 700, margin: '0 auto', borderRadius: 20, padding: 36, marginTop: 32 }}>
      <h2
        className="page-title"
        style={{
          fontWeight: 'bold',
          fontSize: 28,
          marginBottom: 8,
          color: isDark ? '#b388ff' : '#6a11cb',
        }}
      >
        {t('notificationCenter')}
      </h2>
      <div style={{ color: isDark ? '#bbb' : '#888', fontSize: 17, marginBottom: 24 }}>
        {t('manageAlerts')}
      </div>
      <div
        style={{
          background: isDark ? '#23243a' : '#f7f8fa',
          borderRadius: 12,
          padding: 24,
          marginBottom: 18,
          boxShadow: isDark ? '0 2px 8px #18192a' : '0 2px 8px #e3e0ff',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12, color: isDark ? '#fff' : '#222' }}>
          {t('taskDashboard')}
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
          <button
            className="main-btn"
            style={{
              background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
              border: 'none',
              borderRadius: 10,
              boxShadow: '0 2px 8px #6a11cb44',
              padding: '18px 0',
              width: 180,
            }}
            onClick={() => setAlert(t('deadlineAlert'))}
          >
            {t('showDeadlineAlert')}
          </button>
          <button
            className="main-btn-danger"
            style={{
              background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
              border: 'none',
              borderRadius: 10,
              boxShadow: '0 2px 8px #ff512f44',
              padding: '18px 0',
              width: 180,
            }}
            onClick={() => setAlert(t('missedTaskAlert'))}
          >
            {t('showMissedTaskAlert')}
          </button>
          <button
            className="main-btn-secondary"
            style={{
              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
              color: '#222',
              fontWeight: 'bold',
              fontSize: 16,
              border: 'none',
              borderRadius: 10,
              boxShadow: '0 2px 8px #43e97b44',
              padding: '18px 0',
              width: 180,
            }}
            onClick={() => setAlert(t('motivationalAlert'))}
          >
            {t('showMotivationalAlert')}
          </button>
        </div>
        {alert && (
          <div
            style={{
              background: '#6a11cb',
              color: '#fff',
              borderRadius: 8,
              padding: '10px 18px',
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 12,
              textAlign: 'center',
              boxShadow: '0 2px 8px #6a11cb44',
            }}
          >
            {alert}
          </div>
        )}
      </div>
      <div
        style={{
          background: isDark ? '#18192a' : '#f3eaff',
          borderRadius: 12,
          padding: 24,
          boxShadow: isDark ? '0 2px 8px #18192a' : '0 2px 8px #e3e0ff',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12, color: isDark ? '#fff' : '#222' }}>
          {t('notificationSettings')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: isDark ? '#fff' : '#222' }}>{t('deadlineNotifications')}</span>
            <input type="checkbox" checked={settings.deadline} onChange={() => handleToggle('deadline')} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: isDark ? '#fff' : '#222' }}>{t('missedTaskAlerts')}</span>
            <input type="checkbox" checked={settings.missed} onChange={() => handleToggle('missed')} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: isDark ? '#fff' : '#222' }}>{t('motivationalMessages')}</span>
            <input type="checkbox" checked={settings.motivational} onChange={() => handleToggle('motivational')} />
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 8, color: isDark ? '#fff' : '#222' }}>
            {t('notificationStyle')}
          </div>
          <label style={{ marginRight: 16, color: isDark ? '#fff' : '#222' }}>
            <input type="radio" checked={settings.style === 'popup'} onChange={() => handleStyle('popup')} /> {t('popup')}
          </label>
          <label style={{ marginRight: 16, color: isDark ? '#fff' : '#222' }}>
            <input type="radio" checked={settings.style === 'banner'} onChange={() => handleStyle('banner')} /> {t('banner')}
          </label>
          <label style={{ color: isDark ? '#fff' : '#222' }}>
            <input type="radio" checked={settings.style === 'both'} onChange={() => handleStyle('both')} /> {t('both')}
          </label>
        </div>
      </div>
    </div>
  );
} 