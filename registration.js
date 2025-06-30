import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

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
    <div className="registration-main" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
      <div style={{ display: 'flex', boxShadow: '0 8px 32px rgba(44, 62, 80, 0.15)', borderRadius: 16, overflow: 'hidden', width: '1100px', minHeight: '700px', background: 'transparent' }}>
        <div className="registration-left" style={{
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          color: '#fff',
          borderRadius: '0',
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          minWidth: '400px',
          maxWidth: '520px',
          marginRight: 0,
          height: '100%',
          justifyContent: 'center',
          flex: 1
        }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: 18 }}>StudyFlow</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: 32 }}>
            Your complete academic companion. <b>Plan</b>, track, and excel in your studies.
          </p>
          {/* Provided Image */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV8-SeHf5btg5fnASeUJHPBO0NHJwZdfhytjQcoFi9aFpCG5dVZldpSLw&s"
            alt="Computer Education"
            style={{ width: '98%', margin: '32px 0', borderRadius: '16px', background: '#fff', padding: 16 }}
          />
          <div className="features-list" style={{ marginTop: 24 }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 12 }}>New to StudyFlow? Sign up to:</p>
            <ul style={{ paddingLeft: 28, fontSize: '1.1rem', lineHeight: 1.8 }}>
              <li>Create personalized study schedules</li>
              <li>Track assignments and deadlines</li>
              <li>Connect with classmates</li>
              <li>Access course materials</li>
            </ul>
          </div>
        </div>
        <div className="registration-card" style={{ borderRadius: 0, marginLeft: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required autoComplete="nope-fullname" />
            <input name="userEmail" type="email" placeholder="Email" value={form.email} onChange={handleChange} required autoComplete="nope-email" />
            {/* Hidden dummy password field to absorb browser autofill */}
            <input type="password" style={{ display: 'none' }} autoComplete="new-password" />
            <input name="newUserPassword" type="password" placeholder="Password" value={form.password} onChange={handleChange} required autoComplete="nope-password" />
            <input name="userAcademicYear" placeholder="Academic Year" value={form.academicYear} onChange={handleChange} required autoComplete="nope-academic" />
            <input name="userMajor" placeholder="Major" value={form.major} onChange={handleChange} required autoComplete="nope-major" />
            <button type="submit">Register</button>
          </form>
          {message && <div className="message" style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
          {/* Link to Login */}
          <div style={{ marginTop: 16 }}>
            Already have an account? <span style={{ color: '#6a11cb', cursor: 'pointer' }} onClick={() => navigate('/login')}>Log In</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;