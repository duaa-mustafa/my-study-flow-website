import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSync, FaPalette, FaLock, FaTrash, FaLanguage, FaEye, FaUser, FaEnvelope, FaPhone, FaCalendar, FaUniversity, FaBook, FaIdBadge } from 'react-icons/fa';
import './App.css';

const TABS = [
  { label: 'Personal', key: 'personal', icon: <FaUserCircle /> },
  { label: 'Notify', key: 'notifications', icon: <FaBell /> },
  { label: 'Sync', key: 'sync', icon: <FaSync /> },
  { label: 'Theme', key: 'appearance', icon: <FaPalette /> },
  { label: 'Privacy', key: 'privacy', icon: <FaLock /> },
  { label: 'Account', key: 'account', icon: <FaTrash /> },
];

const defaultProfile = {
  firstName: '', lastName: '', email: '', phone: '', dob: '', timezone: '', bio: '', institution: '', major: '', gradYear: '', studentId: ''
};
const defaultNotif = { deadline: true, missed: true, motivational: true };

export default function Settings() {
  const [tab, setTab] = useState('personal');
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('profile')) || defaultProfile);
  const [notif, setNotif] = useState(() => JSON.parse(localStorage.getItem('notif')) || defaultNotif);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePic') || null);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium');
  const [contrast, setContrast] = useState(() => localStorage.getItem('contrast') || 'normal');
  const [syncStatus, setSyncStatus] = useState('Last synced: just now');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  // Save to localStorage on change
  useEffect(() => { localStorage.setItem('profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('notif', JSON.stringify(notif)); }, [notif]);
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('profilePic', profilePic); }, [profilePic]);
  useEffect(() => { localStorage.setItem('language', language); }, [language]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('contrast', contrast); }, [contrast]);

  useEffect(() => {
    let applied = theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applied = prefersDark ? 'dark' : 'light';
    }
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${applied}`);
  }, [theme]);

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
        <span className="settings-title-small">Settings</span>
        <span className="settings-header-desc">Personalize your StudyFlow experience</span>
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
              <div className="settings-profile-upload-hint">Upload your picture here</div>
            </div>
            {/* Right: Fields in grid */}
            <div className="settings-fields-grid">
              <div className="settings-fields-row">
                <label>First Name
                  <input className="settings-input" placeholder="First Name" value={profile.firstName} onChange={e => handleProfileChange('firstName', e.target.value)} />
                </label>
                <label>Last Name
                  <input className="settings-input" placeholder="Last Name" value={profile.lastName} onChange={e => handleProfileChange('lastName', e.target.value)} />
                </label>
              </div>
              <div className="settings-fields-row">
                <label>Email
                  <input className="settings-input" placeholder="Email" value={profile.email} onChange={e => handleProfileChange('email', e.target.value)} />
                </label>
                <label>Phone
                  <input className="settings-input" placeholder="Phone" value={profile.phone} onChange={e => handleProfileChange('phone', e.target.value)} />
                </label>
              </div>
              <div className="settings-fields-row">
                <label>Date of Birth
                  <input className="settings-input" type="date" placeholder="Date of Birth" value={profile.dob} onChange={e => handleProfileChange('dob', e.target.value)} />
                </label>
                <label>Timezone
                  <input className="settings-input" placeholder="Timezone" value={profile.timezone} onChange={e => handleProfileChange('timezone', e.target.value)} />
                </label>
              </div>
              <div className="settings-fields-row">
                <label>Institution
                  <input className="settings-input" placeholder="Institution" value={profile.institution} onChange={e => handleProfileChange('institution', e.target.value)} />
                </label>
                <label>Major
                  <input className="settings-input" placeholder="Major" value={profile.major} onChange={e => handleProfileChange('major', e.target.value)} />
                </label>
              </div>
              <div className="settings-fields-row">
                <label>Graduation Year
                  <input className="settings-input" placeholder="Graduation Year" value={profile.gradYear} onChange={e => handleProfileChange('gradYear', e.target.value)} />
                </label>
                <label>Student ID
                  <input className="settings-input" placeholder="Student ID" value={profile.studentId} onChange={e => handleProfileChange('studentId', e.target.value)} />
                </label>
              </div>
              {/* Bio full width */}
              <div className="settings-fields-row settings-fields-row-full">
                <label style={{ width: '100%' }}>Bio
                  <textarea className="settings-textarea" placeholder="Bio" value={profile.bio} onChange={e => handleProfileChange('bio', e.target.value)} />
                </label>
              </div>
            </div>
          </div>
        )}
        {/* Notifications Tab */}
        {tab === 'notifications' && (
          <div>
            <div className="settings-section-title"><FaBell /> Notifications</div>
            <div className="settings-switch-list">
              <label><input type="checkbox" checked={notif.deadline} onChange={() => handleNotifChange('deadline')} /> Deadline Notifications</label>
              <label><input type="checkbox" checked={notif.missed} onChange={() => handleNotifChange('missed')} /> Missed Task Alerts</label>
              <label><input type="checkbox" checked={notif.motivational} onChange={() => handleNotifChange('motivational')} /> Motivational Messages</label>
            </div>
          </div>
        )}
        {/* Sync Tab */}
        {tab === 'sync' && (
          <div>
            <div className="settings-section-title"><FaSync /> Sync</div>
            <button className="settings-btn-main" onClick={handleManualSync}>Manual Sync</button>
            <div className="settings-sync-status">{syncStatus}</div>
          </div>
        )}
        {/* Appearance Tab */}
        {tab === 'appearance' && (
          <div>
            <div className="settings-section-title"><FaPalette /> Theme</div>
            <div className="settings-radio-list">
              <label><input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} /> Light</label>
              <label><input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} /> Dark</label>
              <label><input type="radio" name="theme" checked={theme === 'system'} onChange={() => setTheme('system')} /> System</label>
            </div>
            <div className="settings-section-title" style={{ marginTop: 18 }}><FaEye /> Accessibility</div>
            <div className="settings-radio-list">
              <label>Font Size: <select className="settings-select" value={fontSize} onChange={e => setFontSize(e.target.value)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label>
              <label>Contrast: <select className="settings-select" value={contrast} onChange={e => setContrast(e.target.value)}><option value="normal">Normal</option><option value="high">High</option></select></label>
            </div>
            <div className="settings-section-title" style={{ marginTop: 18 }}><FaLanguage /> Language</div>
            <select className="settings-select" value={language} onChange={e => setLanguage(e.target.value)}><option value="en">English</option><option value="ar">Arabic</option><option value="fr">French</option><option value="es">Spanish</option></select>
          </div>
        )}
        {/* Privacy & Security Tab */}
        {tab === 'privacy' && (
          <div>
            <div className="settings-section-title"><FaLock /> Privacy</div>
            <button className="settings-btn-main" onClick={handleChangePassword}><FaLock style={{ marginRight: 8 }} />Change Password</button>
          </div>
        )}
        {/* Account Tab */}
        {tab === 'account' && (
          <div>
            <div className="settings-section-title"><FaTrash /> Account</div>
            <button className="settings-btn-danger" onClick={() => setShowDeleteConfirm(true)}><FaTrash style={{ marginRight: 8 }} /> Delete Account</button>
            <button className="settings-btn-secondary" onClick={handleSignOut}>Sign Out</button>
            {showDeleteConfirm && (
              <div className="settings-delete-confirm">
                Are you sure you want to delete your account? This action cannot be undone.<br /><br />
                <button className="settings-btn-danger" onClick={handleDeleteAccount}>Yes, Delete</button>
                <button className="settings-btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 