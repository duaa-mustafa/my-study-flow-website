import React, { useState } from 'react';

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f8fa 60%, #e3e0ff 100%)', padding: 40 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(106,17,203,0.10)', padding: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: 30, color: '#6a11cb', letterSpacing: 1 }}>Subjects</h2>
          <button style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #e3e0ff' }} onClick={() => setShowForm(true)}>+ Add Subject</button>
        </div>
        {/* Add Subject Modal */}
        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <form onSubmit={handleAddSubject} style={{ background: '#fff', borderRadius: 16, padding: 36, minWidth: 340, boxShadow: '0 4px 24px rgba(44,62,80,0.15)' }}>
              <h2 style={{ marginBottom: 18, color: '#6a11cb' }}>Add New Subject</h2>
              <input placeholder="Subject Name" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
              <input placeholder="Academic Year" value={newSubject.academicYear} onChange={e => setNewSubject({ ...newSubject, academicYear: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
              <input placeholder="Major" value={newSubject.major} onChange={e => setNewSubject({ ...newSubject, major: e.target.value })} style={{ width: '100%', marginBottom: 18, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Add</button>
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
              <div style={{ fontWeight: 'bold', fontSize: 22, color: '#333', marginBottom: 8 }}>{subject.name}</div>
              <div style={{ color: '#6a11cb', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>Year: {subject.academicYear}</div>
              <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Major: <b>{subject.major}</b></div>
              <button onClick={() => handleDelete(subject.id)} style={{ background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14, position: 'absolute', top: 18, right: 18, boxShadow: '0 2px 8px #ffd200' }}>Delete</button>
            </div>
          ))}
          {subjects.length === 0 && (
            <div style={{ color: '#888', fontStyle: 'italic', fontSize: 18, margin: '40px auto' }}>No subjects found.</div>
          )}
        </div>
      </div>
    </div>
  );
}