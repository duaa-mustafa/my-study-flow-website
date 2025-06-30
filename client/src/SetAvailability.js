import React, { useState, useEffect } from 'react';

export default function SetAvailability() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ day: '', start: '', end: '', best: false });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/availability', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSlots(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load availability.');
        setLoading(false);
      });
  }, [token]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editing !== null) {
        const res = await fetch(`http://localhost:5000/availability/${slots[editing].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();
        setSlots(slots.map((s, i) => (i === editing ? updated : s)));
        setEditing(null);
      } else {
        const res = await fetch('http://localhost:5000/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Add failed');
        const added = await res.json();
        setSlots([...slots, added]);
      }
      setForm({ day: '', start: '', end: '', best: false });
    } catch {
      setError('Failed to save.');
    }
  };

  const handleEdit = idx => {
    setForm({ day: slots[idx].day, start: slots[idx].start, end: slots[idx].end, best: slots[idx].best });
    setEditing(idx);
  };

  const handleDelete = async idx => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/availability/${slots[idx].id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setSlots(slots.filter((_, i) => i !== idx));
      if (editing === idx) setEditing(null);
    } catch {
      setError('Failed to delete.');
    }
  };

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>
      {/* Header */}
      <div className="card" style={{ borderRadius: 20, padding: '32px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 'bold' }}>
          📅 Set Your Availability
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Plan your study schedule and find your best focus times
        </p>
      </div>

      <div className="card" style={{ maxWidth: 800, margin: '0 auto', borderRadius: 20, padding: '40px', overflow: 'hidden' }}>
        {/* Add/Edit Form */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
            {editing !== null ? '✏️ Edit Time Slot' : '➕ Add New Time Slot'}
          </h3>
          <form onSubmit={handleSubmit} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Day</label>
              <select 
                name="day" 
                value={form.day} 
                onChange={handleChange} 
                required 
                style={{ 
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#fff'
                }}
              >
                <option value="">Select Day</option>
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => 
                  <option key={d} value={d}>{d}</option>
                )}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Start Time</label>
              <input 
                name="start" 
                type="time" 
                value={form.start} 
                onChange={handleChange} 
                required 
                style={{ 
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>End Time</label>
              <input 
                name="end" 
                type="time" 
                value={form.end} 
                onChange={handleChange} 
                required 
                style={{ 
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                name="best" 
                checked={form.best} 
                onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
              />
              <label style={{ fontWeight: 'bold', color: '#555' }}>Best time to study</label>
            </div>
            
            <button 
              type="submit" 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff', 
                border: 'none', 
                borderRadius: '12px', 
                padding: '14px 24px', 
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >
              {editing !== null ? '🔄 Update' : '➕ Add'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ 
            background: '#ff6b6b20', 
            color: '#ff6b6b', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #ff6b6b30'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            Loading your availability...
          </div>
        )}

        {/* Time Slots List */}
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
            📋 Your Time Slots ({slots.length})
          </h3>
          
          {slots.length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px dashed #dee2e6'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
              <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No availability set yet</div>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>Add your first time slot above to get started!</div>
            </div>
          )}
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {slots.map((slot, i) => (
              <div key={slot.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: slot.best ? 'linear-gradient(135deg, #43e97b20 0%, #38f9d720 100%)' : '#f8f9fa',
                borderRadius: '12px',
                border: `2px solid ${slot.best ? '#43e97b30' : '#e9ecef'}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }} onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }} onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>
                      {slot.best ? '⭐' : '🕐'}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>
                      {slot.day}
                    </span>
                    {slot.best && (
                      <span style={{
                        background: '#43e97b',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        BEST TIME
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#666', fontSize: '1rem' }}>
                    {slot.start} - {slot.end}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleEdit(i)} 
                    style={{ 
                      background: '#667eea20', 
                      color: '#667eea', 
                      border: 'none', 
                      borderRadius: '8px', 
                      padding: '8px 12px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(i)} 
                    style={{ 
                      background: '#ff6b6b20', 
                      color: '#ff6b6b', 
                      border: 'none', 
                      borderRadius: '8px', 
                      padding: '8px 12px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 