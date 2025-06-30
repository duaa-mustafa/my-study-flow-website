import React, { useState } from 'react';

export default function Notifications() {
  const [settings, setSettings] = useState({
    deadline: true,
    missed: true,
    motivational: true,
    style: 'both',
  });
  const [alert, setAlert] = useState('');

  const handleToggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const handleStyle = (val) => setSettings(s => ({ ...s, style: val }));

  return (
    <div className="card" style={{ maxWidth: 700, margin: '0 auto', borderRadius: 20, padding: 36, marginTop: 32 }}>
      <h2 className="page-title" style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 8 }}>Notification Center</h2>
      <div style={{ color: '#888', fontSize: 17, marginBottom: 24 }}>Manage how and when you receive alerts</div>
      <div style={{ background: '#f7f8fa', borderRadius: 12, padding: 24, marginBottom: 18 }}>
        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Task Dashboard</div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
          <button className="main-btn" onClick={() => setAlert('deadline')}>Show Deadline Alert</button>
          <button className="main-btn-danger" onClick={() => setAlert('missed')}>Show Missed Task Alert</button>
          <button className="main-btn-secondary" onClick={() => setAlert('motivational')}>Show Motivational Alert</button>
        </div>
        {alert && <div style={{ background: '#6a11cb', color: '#fff', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>{alert}</div>}
      </div>
      <div style={{ background: '#f3eaff', borderRadius: 12, padding: 24 }}>
        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Notification Settings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Deadline Notifications</span>
            <input type="checkbox" checked={settings.deadline} onChange={() => handleToggle('deadline')} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Missed Task Alerts</span>
            <input type="checkbox" checked={settings.missed} onChange={() => handleToggle('missed')} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Motivational Messages</span>
            <input type="checkbox" checked={settings.motivational} onChange={() => handleToggle('motivational')} />
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 8 }}>Notification Style</div>
          <label style={{ marginRight: 16 }}>
            <input type="radio" checked={settings.style === 'popup'} onChange={() => handleStyle('popup')} /> Pop-up
          </label>
          <label style={{ marginRight: 16 }}>
            <input type="radio" checked={settings.style === 'banner'} onChange={() => handleStyle('banner')} /> Banner
          </label>
          <label>
            <input type="radio" checked={settings.style === 'both'} onChange={() => handleStyle('both')} /> Both
          </label>
        </div>
      </div>
    </div>
  );
} 