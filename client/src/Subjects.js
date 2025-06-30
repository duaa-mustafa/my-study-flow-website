import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const initialSubjects = [
  { id: 1, name: 'Statistics', academicYear: '2025', major: 'Information Technology' },
  { id: 2, name: 'Software Engineering', academicYear: '2025', major: 'Information Technology' },
  { id: 3, name: 'Operating System', academicYear: '2025', major: 'Information Technology' },
  { id: 4, name: 'Networks', academicYear: '2025', major: 'Information Technology' },
];

// Generate a color for each subject (based on name hash)
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

export default function Subjects() {
  const { t } = useSettings();
  const [subjects, setSubjects] = useState(initialSubjects);
  const [showForm, setShowForm] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', academicYear: '', major: '' });

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.academicYear || !newSubject.major) return;
    setSubjects([...subjects, { id: Date.now(), ...newSubject }]);
    setNewSubject({ name: '', academicYear: '', major: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div id="main-content" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f8fa 60%, #e3e0ff 100%)', padding: 40 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(106,17,203,0.10)', padding: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 className="page-title">{t('subjects')}</h2>
          <button className="main-btn" onClick={() => setShowForm(true)}>{t('addSubject')}</button>
        </div>
        {/* Add Subject Modal */}
        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <form onSubmit={handleAddSubject} style={{ background: '#fff', borderRadius: 16, padding: 36, minWidth: 340, boxShadow: '0 4px 24px rgba(44,62,80,0.15)' }}>
              <h2 style={{ marginBottom: 18, color: '#6a11cb' }}>{t('addNewSubject')}</h2>
              <input placeholder={t('subjectName')} value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
              <input placeholder={t('academicYear')} value={newSubject.academicYear} onChange={e => setNewSubject({ ...newSubject, academicYear: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
              <input placeholder={t('major')} value={newSubject.major} onChange={e => setNewSubject({ ...newSubject, major: e.target.value })} style={{ width: '100%', marginBottom: 18, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>{t('cancel')}</button>
                <button type="submit" style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>{t('add')}</button>
              </div>
            </form>
          </div>
        )}
        {/* Subjects Cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, marginTop: 12 }}>
          {subjects.map(subject => (
            <div
              key={subject.id}
              style={{
                flex: '1 1 260px',
                minWidth: 260,
                background: '#fafbfc',
                borderRadius: 18,
                boxShadow: '0 2px 12px #e3e0ff',
                padding: 28,
                borderTop: `8px solid transparent`,
                borderImage: `${getColor(subject.name)} 1`,
                position: 'relative',
                transition: 'box-shadow 0.2s',
                marginBottom: 8,
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px #c471f5'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px #e3e0ff'}
            >
              <div className="section-title">{subject.name}</div>
              <div>{t('year')}: {subject.academicYear}</div>
              <div>{t('major')}: <b>{t(subject.major.replace(/\s+/g, '').toLowerCase()) || subject.major}</b></div>
              <button className="main-btn" onClick={() => handleDelete(subject.id)}>{t('delete')}</button>
            </div>
          ))}
          {subjects.length === 0 && (
            <div className="card-empty">{t('noSubjects')}</div>
          )}
        </div>
      </div>
    </div>
  );
}