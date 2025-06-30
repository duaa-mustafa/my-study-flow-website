import React, { useEffect, useState } from 'react';
import { useSettings } from './SettingsContext';

const priorityColors = {
  High: '#e57373',
  Medium: '#ffb74d',
  Low: '#81c784',
};

export default function Assignments() {
  const { t, language } = useSettings();
  const token = localStorage.getItem('token');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    due: '',
    priority: 'Medium',
  });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line
  }, [token]);

  const fetchAssignments = () => {
    setLoading(true);
    fetch('http://localhost:5000/assignments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setAssignments(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newAssignment, status: 'Incomplete' }),
      });
      if (!res.ok) {
        if (res.status === 403) {
          setError(t('assignmentAddForbidden'));
        } else {
          setError(t('assignmentAddError'));
        }
        setAdding(false);
        return;
      }
      const data = await res.json();
      setAssignments([...assignments, data]);
      setNewAssignment({ title: '', subject: '', due: '', priority: 'Medium' });
    } catch (err) {
      setError(t('assignmentAddError'));
    }
    setAdding(false);
  };

  const handleMarkComplete = async (id, status) => {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;
    await fetch(`http://localhost:5000/assignments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...assignment, status }),
    });
    setAssignments(assignments.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/assignments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div id="main-content" className="card" style={{ maxWidth: 1100, margin: '40px auto', borderRadius: 20, padding: 36, minHeight: 500, background: 'linear-gradient(135deg, #f3eaff 0%, #e3e0ff 100%)' }}>
      <h2 className="page-title">{t('assignments')}</h2>
      {/* Add Assignment Form */}
      <form onSubmit={handleAddAssignment} className="card assignment-form">
        <input
          type="text"
          placeholder={t('title')}
          value={newAssignment.title}
          onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
          style={{ flex: 2, padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 17 }}
          required
        />
        <input
          type="text"
          placeholder={t('subject')}
          value={newAssignment.subject}
          onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })}
          style={{ flex: 1, padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 17 }}
          required
        />
        <input
          type="date"
          value={newAssignment.due}
          onChange={e => setNewAssignment({ ...newAssignment, due: e.target.value })}
          style={{ flex: 1, padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 17 }}
        />
        <select
          value={newAssignment.priority}
          onChange={e => setNewAssignment({ ...newAssignment, priority: e.target.value })}
          style={{ flex: 1, padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 17 }}
        >
          <option value="High">{t('highPriority')}</option>
          <option value="Medium">{t('mediumPriority')}</option>
          <option value="Low">{t('lowPriority')}</option>
        </select>
        <button className="main-btn" type="submit" disabled={adding}>
          {adding ? t('adding') : t('addAssignment')}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {/* Assignment List */}
      {loading ? <div className="card-empty">{t('loadingAssignments')}</div> : (
        <div className="assignment-list">
          {assignments.length === 0 && <div className="card-empty">{t('noAssignments')}</div>}
          {assignments.map((a, idx) => (
            <div key={a.id || idx} className="card assignment-item">
              <div className="section-title">{a.title}</div>
              <div>{a.subject}</div>
              <div>{t('due')}: <b>{a.due || t('noDueDate')}</b></div>
              <div>
                <span>{t(a.priority?.toLowerCase() + 'Priority') || a.priority || 'Medium'}</span>
                <span>{t(a.status?.toLowerCase() || 'incomplete')}</span>
              </div>
              <div>
                {a.status === 'Complete' ? (
                  <button className="main-btn-secondary" onClick={() => handleMarkComplete(a.id, 'Incomplete')}>
                    {t('markIncomplete')}
                  </button>
                ) : (
                  <button className="main-btn" onClick={() => handleMarkComplete(a.id, 'Complete')}>
                    {t('markComplete')}
                  </button>
                )}
                <button className="main-btn-secondary" onClick={() => handleDelete(a.id)}>{t('delete')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}