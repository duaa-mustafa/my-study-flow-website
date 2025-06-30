import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const TABS = [
  { label: 'Course Link', key: 'link' },
  { label: 'API Token', key: 'token' },
  { label: 'Calendar File', key: 'calendar' },
];

export default function Import() {
  const { t } = useSettings();
  const [tab, setTab] = useState('link');
  const [input, setInput] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState(null);

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      setAssignments([
        { name: 'Database Assignment', due: '2025-06-20', color: '#6a11cb' },
        { name: 'Statistics Quiz', due: '2025-06-22', color: '#43e97b' },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="card" style={{ maxWidth: 700, margin: '0 auto', borderRadius: 20, padding: 36, marginTop: 32 }}>
      <h2 className="page-title" style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 8 }}>{t('importFromMoodle')}</h2>
      <div style={{ color: '#888', fontSize: 17, marginBottom: 24 }}>{t('importFromMoodleDesc')}</div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
        {TABS.map(tTab => (
          <button
            key={tTab.key}
            className={tab === tTab.key ? "main-btn" : "main-btn-secondary"}
            onClick={() => { setTab(tTab.key); setInput(''); setAssignments(null); }}
          >
            {tTab.label}
          </button>
        ))}
      </div>
      <div style={{ background: '#f7f8fa', borderRadius: 12, padding: 24, marginBottom: 18 }}>
        {tab === 'link' && (
          <>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('pasteMoodleCourseLink')}</div>
            <input
              type="text"
              placeholder="https://moodle.university.edu/course/view.php?id=1234"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', marginBottom: 12, fontSize: 16 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#888' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> {t('rememberMoodleCredentials')}
            </label>
          </>
        )}
        {tab === 'token' && (
          <>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('enterApiToken')}</div>
            <input
              type="text"
              placeholder={t('pasteApiToken')}
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', marginBottom: 12, fontSize: 16 }}
            />
          </>
        )}
        {tab === 'calendar' && (
          <>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('uploadCalendarFile')}</div>
            <input type="file" style={{ marginBottom: 12 }} />
          </>
        )}
        <button
          onClick={handleFetch}
          disabled={loading || !input}
          className={loading || !input ? "main-btn-disabled" : "main-btn"}
        >{loading ? t('fetching') : t('fetchAssignments')}</button>
        {assignments && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 'bold', color: '#2575fc', marginBottom: 8 }}>{t('assignmentsFound')}</div>
            {assignments.map(a => (
              <div key={a.name} style={{ background: a.color, color: '#fff', borderRadius: 8, padding: '10px 18px', marginBottom: 10, fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #e3e0ff' }}>{a.name} <span style={{ fontWeight: 'normal', fontSize: 14, marginLeft: 12 }}>{a.due}</span></div>
            ))}
          </div>
        )}
      </div>
      <div style={{ background: '#f3eaff', borderRadius: 12, padding: 18, marginTop: 18 }}>
        <div style={{ fontWeight: 'bold', color: '#6a11cb', marginBottom: 6 }}>{t('needHelp')}</div>
        <ul style={{ color: '#6a11cb', fontSize: 15, margin: 0, paddingLeft: 20 }}>
          <li>{t('helpMoodleLogin')}</li>
          <li>{t('helpApiToken')}</li>
          <li>{t('helpCalendarExport')}</li>
        </ul>
      </div>
    </div>
  );
} 