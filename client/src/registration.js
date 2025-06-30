import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';
import { useSettings } from './SettingsContext';

function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    academicYear: '',
    major: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useSettings();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful! You can now log in.');
        setTimeout(() => navigate('/login'), 1000); // Redirect after 1s
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="registration-main" style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'inherit'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.15)',
        borderRadius: 16,
        overflow: 'hidden',
        width: '900px',
        minHeight: '600px',
        background: 'transparent'
      }}>
        <div className="registration-left" style={{
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          color: '#fff',
          padding: '48px 32px',
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 18 }}>StudyFlow</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: 24 }}>{t('registrationDesc')}</p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV8-SeHf5btg5fnASeUJHPBO0NHJwZdfhytjQcoFi9aFpCG5dVZldpSLw&s"
            alt={t('computerEducation')}
            style={{ width: '100%', margin: '24px 0', borderRadius: '12px', background: '#fff', padding: 10 }}
          />
          <div className="features-list" style={{ marginTop: 16 }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 10 }}>{t('newToStudyFlow')}</p>
            <ul style={{ paddingLeft: 20, fontSize: '1rem', lineHeight: 1.7 }}>
              <li>{t('createPersonalizedSchedules')}</li>
              <li>{t('trackAssignmentsDeadlines')}</li>
              <li>{t('connectWithClassmates')}</li>
              <li>{t('accessCourseMaterials')}</li>
            </ul>
          </div>
        </div>
        <div className="registration-card" style={{
          borderRadius: 0,
          marginLeft: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2>{t('signUp')}</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input name="fullName" placeholder={t('fullName')} value={form.fullName} onChange={handleChange} required autoComplete="nope-fullname" />
            <input name="email" type="email" placeholder={t('email')} value={form.email} onChange={handleChange} required autoComplete="email" />
            <input name="password" type="password" placeholder={t('password')} value={form.password} onChange={handleChange} required autoComplete="new-password" />
            <input name="academicYear" placeholder={t('academicYear')} value={form.academicYear} onChange={handleChange} required autoComplete="nope-academic" />
            <input name="major" placeholder={t('major')} value={form.major} onChange={handleChange} required autoComplete="nope-major" />
            <button type="submit">{t('register')}</button>
          </form>
          {message && <div className="message" style={{ color: message.includes('success') ? 'green' : 'red' }}>{t(message)}</div>}
          <div style={{ marginTop: 16 }}>
            {t('alreadyHaveAccount')} <span style={{ color: '#6a11cb', cursor: 'pointer' }} onClick={() => navigate('/login')}>{t('logIn')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
