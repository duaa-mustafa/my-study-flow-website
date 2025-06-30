import React, { useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

export default function SetAvailability() {
  const { t } = useSettings();
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
      const url = editing !== null
        ? `http://localhost:5000/availability/${slots[editing].id}`
        : 'http://localhost:5000/availability';

      const method = editing !== null ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Save failed');
      const result = await res.json();

      setSlots(editing !== null
        ? slots.map((s, i) => (i === editing ? result : s))
        : [...slots, result]);

      setForm({ day: '', start: '', end: '', best: false });
      setEditing(null);
    } catch {
      setError('Failed to save.');
    }
  };

  const handleEdit = idx => {
    const s = slots[idx];
    setForm({ day: s.day, start: s.start, end: s.end, best: s.best });
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
    <div id="main-content" style={{
      maxWidth: 800,
      margin: '40px auto',
      borderRadius: 20,
      padding: 36,
      minHeight: 500,
      background: 'linear-gradient(135deg, #f3eaff 0%, #e3e0ff 100%)',
      boxShadow: '0 4px 32px #e3e0ff',
    }}>
      <h1 style={{ fontWeight: 'bold', fontSize: 32, color: '#6a11cb', marginBottom: 32 }}>{t('setAvailability')}</h1>
      {error && <p style={{ color: '#e57373', fontWeight: 'bold', marginBottom: 18 }}>{t(error)}</p>}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: 14,
        marginBottom: 32,
        alignItems: 'center',
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 2px 8px #e3e0ff',
        padding: 20,
      }}>
        <select name="day" value={form.day} onChange={handleChange} required style={{
          flex: 1,
          padding: 14,
          borderRadius: 8,
          border: '1px solid #ccc',
          fontSize: 17,
        }}>
          <option value="">{t('selectDay')}</option>
          {[t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday')].map((day, idx) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <input name="start" type="time" value={form.start} onChange={handleChange} required style={{
          flex: 1,
          padding: 14,
          borderRadius: 8,
          border: '1px solid #ccc',
          fontSize: 17,
        }} placeholder={t('startTime')} />
        <input name="end" type="time" value={form.end} onChange={handleChange} required style={{
          flex: 1,
          padding: 14,
          borderRadius: 8,
          border: '1px solid #ccc',
          fontSize: 17,
        }} placeholder={t('endTime')} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold', color: '#6a11cb' }}>
          <input type="checkbox" name="best" checked={form.best} onChange={handleChange} style={{ accentColor: '#6a11cb' }} />
          {t('best')}
        </label>
        <button type="submit" style={{
          padding: '14px 28px',
          fontWeight: 'bold',
          fontSize: 17,
          marginLeft: 8,
          background: 'linear-gradient(90deg, #667eea 0%, #2575fc 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #e3e0ff',
          transition: 'background 0.2s',
        }}>{editing !== null ? t('update') : t('add')}</button>
      </form>

      <div style={{ marginTop: 18 }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: '#6a11cb', fontWeight: 'bold', fontSize: 22 }}>{t('loading')}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            {slots.length === 0 && <div style={{ color: '#888', fontSize: 20, fontStyle: 'italic' }}>{t('noAvailabilitySet')}</div>}
        {slots.map((slot, i) => (
              <div key={slot.id} style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 2px 12px #e3e0ff',
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: slot.best ? '8px solid #6a11cb' : '8px solid #bdbdbd',
                minHeight: 70,
                marginBottom: 8,
                position: 'relative',
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 22, color: '#222', marginBottom: 4 }}>{t(slot.day.toLowerCase())}</div>
                  <div style={{ color: '#6a11cb', fontWeight: 'bold', fontSize: 17 }}>{slot.start} - {slot.end} {slot.best && <span style={{ color: '#ffb74d', marginLeft: 8 }}>★ {t('best')}</span>}</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleEdit(i)} style={{
                    background: 'linear-gradient(90deg, #ffd200 0%, #ff512f 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 22px',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #e3e0ff',
                  }}>{t('edit')}</button>
                  <button onClick={() => handleDelete(i)} style={{
                    background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 22px',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #ffd200',
                  }}>{t('delete')}</button>
                </div>
              </div>
        ))}
          </div>
        )}
      </div>
    </div>
  );
}
