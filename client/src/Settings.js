import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSync, FaPalette, FaLock, FaTrash, FaLanguage, FaEye, FaUser } from 'react-icons/fa';
import './App.css';
import { useSettings } from './SettingsContext';

const defaultProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  timezone: '',
  institution: '',
  major: '',
  gradYear: '',
  studentId: '',
  bio: ''
};
const defaultNotif = {
  deadline: true,
  missed: true,
  motivational: true
};

export default function Settings() {
  const { language, setLanguage, fontSize, setFontSize, contrast, setContrast, t } = useSettings();

  const TABS = [
    { label: t('personal'), key: 'personal', icon: <FaUserCircle /> },
    { label: t('notify'), key: 'notifications', icon: <FaBell /> },
    { label: t('sync'), key: 'sync', icon: <FaSync /> },
    { label: t('theme'), key: 'appearance', icon: <FaPalette /> },
    { label: t('privacy'), key: 'privacy', icon: <FaLock /> },
    { label: t('account'), key: 'account', icon: <FaTrash /> },
  ];

  const [tab, setTab] = useState('personal');
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('profile')) || defaultProfile);
  const [notif, setNotif] = useState(() => JSON.parse(localStorage.getItem('notif')) || defaultNotif);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePic') || null);
  const [syncStatus, setSyncStatus] = useState('Last synced: just now');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  // Save to localStorage on change
  useEffect(() => { localStorage.setItem('profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('notif', JSON.stringify(notif)); }, [notif]);
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('profilePic', profilePic); }, [profilePic]);

  useEffect(() => {
    let applied = theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applied = prefersDark ? 'dark' : 'light';
    }
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${applied}`);
  }, [theme]);

  useEffect(() => {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.remove('high-contrast');
    if (contrast === 'high') document.body.classList.add('high-contrast');
  }, [contrast]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePic(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    alert('Password change feature coming soon!');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    alert('Account deletion feature coming soon!');
  };

  const handleManualSync = () => {
    setSyncStatus('Last synced: just now');
    alert('Manual sync complete!');
  };

  // Dynamic handlers
  const handleProfileChange = (field, value) => setProfile(p => ({ ...p, [field]: value }));
  const handleNotifChange = (field) => setNotif(n => ({ ...n, [field]: !n[field] }));

  return (
    <div className="settings-bg">
      {/* Small Settings Title Top Left */}
      <div className="settings-header-row">
        <span className="settings-title-small">{t('settings')}</span>
        <span className="settings-header-desc">{t('personalize')}</span>
      </div>
      {/* Tabs */}
      <div className="settings-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`settings-tab-btn${tab === t.key ? ' active' : ''}`}
            style={{ fontSize: 15, color: tab === t.key ? '#fff' : '#2575fc', background: tab === t.key ? 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)' : 'none', minWidth: 90 }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="settings-card">
        {/* Personal Info Tab */}
        {tab === 'personal' && (
          <div className="settings-personal-grid">
            {/* Left: Profile Picture */}
            <div className="settings-profile-col">
              <div className="settings-profile-avatar-wrap">
                <img
                  src={profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                  alt="Profile"
                  className="settings-profile-avatar"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
                  }}
                />
                <label className="settings-profile-upload-overlay">
                  <FaUser />
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} />
                </label>
              </div>
              <div className="settings-profile-upload-hint">{t('uploadPic')}</div>
            </div>
            {/* Right: Fields in grid */}
            <div className="settings-fields-grid">
              <div className="settings-fields-row">
                <label>{t('firstName')}
                  <input className="settings-input" placeholder={t('firstName')} value={profile.firstName} onChange={e => handleProfileChange('firstName', e.target.value)} />
                </label>
                <label>{t('lastName')}
                  <input className="settings-input" placeholder={t('lastName')} value={profile.lastName} onChange={e => handleProfileChange('lastName', e.target.value)} />
                </label>
              </div>
              <div className="settings-fields-row">
                <label>{t('email')}
                  <input className="settings-input" placeholder={t('email')} value={profile.email} onChange={e => handleProfileChange('email', e.target.value)} />
                </label>
                <label>{t('phone')}
                  <input className="settings-input" placeholder={t('phone')} value={profile.phone} onChange={e => handleProfileChange('phone', e.target.value)} />
                </label>
              </div>
              <div className="settings-fields-row">
                <label>{t('dob')}
                  <input className="settings-input" type="date" placeholder={t('dob')} value={profile.dob} onChange={e => handleProfileChange('dob', e.target.value)} />
                </label>
                <label>{t('timezone')}
                  <input className="settings-input" placeholder={t('timezone')} value={profile.timezone} onChange={e => handleProfileChange('timezone', e.target.value)} />
                </label>
              </div>
              <div className="settings-fields-row">
                <label>{t('institution')}
                  <input className="settings-input" placeholder={t('institution')} value={profile.institution} onChange={e => handleProfileChange('institution', e.target.value)} />
                </label>
                <label>{t('major')}
                  <input className="settings-input" placeholder={t('major')} value={profile.major} onChange={e => handleProfileChange('major', e.target.value)} />
                </label>
              </div>
              <div className="settings-fields-row">
                <label>{t('gradYear')}
                  <input className="settings-input" placeholder={t('gradYear')} value={profile.gradYear} onChange={e => handleProfileChange('gradYear', e.target.value)} />
                </label>
                <label>{t('studentId')}
                  <input className="settings-input" placeholder={t('studentId')} value={profile.studentId} onChange={e => handleProfileChange('studentId', e.target.value)} />
                </label>
              </div>
              {/* Bio full width */}
              <div className="settings-fields-row settings-fields-row-full">
                <label style={{ width: '100%' }}>{t('bio')}
                  <textarea className="settings-textarea" placeholder={t('bio')} value={profile.bio} onChange={e => handleProfileChange('bio', e.target.value)} />
                </label>
              </div>
            </div>
          </div>
        )}
        {/* Notifications Tab */}
        {tab === 'notifications' && (
          <div>
            <div className="settings-section-title"><FaBell /> {t('notifications')}</div>
            <div className="settings-switch-list">
              <label><input type="checkbox" checked={notif.deadline} onChange={() => handleNotifChange('deadline')} /> {t('deadlineNotif')}</label>
              <label><input type="checkbox" checked={notif.missed} onChange={() => handleNotifChange('missed')} /> {t('missedTask')}</label>
              <label><input type="checkbox" checked={notif.motivational} onChange={() => handleNotifChange('motivational')} /> {t('motivational')}</label>
            </div>
          </div>
        )}
        {/* Sync Tab */}
        {tab === 'sync' && (
          <div>
            <div className="settings-section-title"><FaSync /> {t('sync')}</div>
            <button className="settings-btn-main" onClick={handleManualSync}>{t('syncBtn')}</button>
            <div className="settings-sync-status">{t('lastSynced')}: {syncStatus}</div>
          </div>
        )}
        {/* Appearance Tab */}
        {tab === 'appearance' && (
          <div>
            <div className="settings-section-title"><FaPalette /> {t('themeTab')}</div>
            <div className="settings-radio-list">
              <label><input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} /> {t('light')}</label>
              <label><input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} /> {t('dark')}</label>
              <label><input type="radio" name="theme" checked={theme === 'system'} onChange={() => setTheme('system')} /> {t('system')}</label>
            </div>
            <div className="settings-section-title" style={{ marginTop: 18 }}><FaEye /> {t('accessibility')}</div>
            <div className="settings-radio-list">
              <label>{t('fontSize')}: <select className="settings-select" value={fontSize} onChange={e => setFontSize(e.target.value)}><option value="small">{t('small')}</option><option value="medium">{t('medium')}</option><option value="large">{t('large')}</option></select></label>
              <label>{t('contrast')}: <select className="settings-select" value={contrast} onChange={e => setContrast(e.target.value)}><option value="normal">{t('normal')}</option><option value="high">{t('high')}</option></select></label>
            </div>
            <div className="settings-section-title" style={{ marginTop: 18 }}><FaLanguage /> {t('language')}</div>
            <select className="settings-select" value={language} onChange={e => setLanguage(e.target.value)}><option value="en">English</option><option value="ar">العربية</option></select>
          </div>
        )}
        {/* Privacy & Security Tab */}
        {tab === 'privacy' && (
          <div>
            <div className="settings-section-title"><FaLock /> {t('privacyTab')}</div>
            <button className="settings-btn-main" onClick={handleChangePassword}><FaLock style={{ marginRight: 8 }} />{t('changePassword')}</button>
          </div>
        )}
        {/* Account Tab */}
        {tab === 'account' && (
          <div>
            <div className="settings-section-title"><FaTrash /> {t('accountTab')}</div>
            <button className="settings-btn-danger" onClick={() => setShowDeleteConfirm(true)}><FaTrash style={{ marginRight: 8 }} /> {t('deleteAccount')}</button>
            <button className="settings-btn-secondary" onClick={handleSignOut}>{t('signOut')}</button>
            {showDeleteConfirm && (
              <div className="settings-delete-confirm">
                {t('deleteConfirm')}
                <br /><br />
                <button className="settings-btn-danger" onClick={handleDeleteAccount}>{t('yesDelete')}</button>
                <button className="settings-btn-secondary" onClick={() => setShowDeleteConfirm(false)}>{t('cancel')}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 