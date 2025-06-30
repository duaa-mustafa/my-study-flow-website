import React, { useEffect, useState } from 'react';

const priorityColors = {
  High: '#e57373',
  Medium: '#ffb74d',
  Low: '#81c784',
};

export default function Assignments() {
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
    const res = await fetch('http://localhost:5000/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...newAssignment, status: 'Incomplete' }),
    });
    const data = await res.json();
    if (res.ok) {
      setAssignments([...assignments, data]);
      setNewAssignment({ title: '', subject: '', due: '', priority: 'Medium' });
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
    <div className="card" style={{ maxWidth: 1100, margin: '40px auto', borderRadius: 20, padding: 36, minHeight: 500, background: 'linear-gradient(135deg, #f3eaff 0%, #e3e0ff 100%)' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 32, color: '#6a11cb', marginBottom: 32 }}>Assignments</h2>
      {/* Add Assignment Form */}
      <form onSubmit={handleAddAssignment} style={{ display: 'flex', gap: 14, marginBottom: 32, alignItems: 'center', background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #e3e0ff', padding: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={newAssignment.title}
          onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
          style={{ flex: 2, padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 17 }}
          required
        />
        <input
          type="text"
          placeholder="Subject"
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
          <option value="High">High 🔴</option>
          <option value="Medium">Medium 🟠</option>
          <option value="Low">Low 🟢</option>
        </select>
        <button className="main-btn" type="submit" style={{ padding: '14px 28px', fontWeight: 'bold', fontSize: 17, marginLeft: 8 }} disabled={adding}>
          {adding ? 'Adding...' : '+ Add Assignment'}
        </button>
      </form>
      {/* Assignment List */}
      {loading ? <div style={{ textAlign: 'center', marginTop: 40 }}>Loading assignments...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(370px, 1fr))', gap: 32, marginTop: 18 }}>
          {assignments.length === 0 && <div style={{ color: '#888', fontSize: 20, fontStyle: 'italic' }}>No assignments found.</div>}
          {assignments.map((a, idx) => (
            <div key={a.id || idx} style={{
              background: '#fff',
              borderRadius: 24,
              boxShadow: '0 4px 24px #e3e0ff',
              padding: 32,
              borderLeft: `8px solid ${priorityColors[a.priority || 'Medium']}`,
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: 8,
              position: 'relative',
              transition: 'box-shadow 0.2s',
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 26, color: '#222', marginBottom: 6 }}>{a.title}</div>
                <div style={{ color: '#6a11cb', fontWeight: 'bold', fontSize: 18, marginBottom: 2 }}>{a.subject}</div>
                <div style={{ color: '#888', fontSize: 15, marginBottom: 14 }}>Due: <b>{a.due || 'No Due Date'}</b></div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                  <span style={{ background: priorityColors[a.priority || 'Medium'], color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 'bold', fontSize: 15 }}>{a.priority || 'Medium'}</span>
                  <span style={{ background: a.status === 'Complete' ? '#90caf9' : '#bdbdbd', color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 'bold', fontSize: 15 }}>{a.status || 'Incomplete'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                {a.status === 'Complete' ? (
                  <button
                    onClick={() => handleMarkComplete(a.id, 'Incomplete')}
                    style={{
                      background: '#bdbdbd',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 22px',
                      fontWeight: 'bold',
                      fontSize: 16,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px #e3e0ff',
                    }}
                  >
                    Mark Incomplete
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkComplete(a.id, 'Complete')}
                    style={{
                      background: 'linear-gradient(90deg, #667eea 0%, #2575fc 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 22px',
                      fontWeight: 'bold',
                      fontSize: 16,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px #e3e0ff',
                    }}
                  >
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{
                    background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 22px',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #ffd200',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}