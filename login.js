import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      console.log('RAW fetch response object:', res); 
      console.log('Login response data:', data);

      if (res.ok) {
        setMessage('Login successful! Welcome back.');
        setTimeout(() => {
  navigate('/dashboard');
  window.location.reload(); // Force re-check of isAuthenticated
}, 1000);
        if (data.token) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  setTimeout(() => navigate('/dashboard'), 1000);
} else {
  setMessage('Login failed: No token received.');
}
      } else {
        setMessage(data.error || 'Login failed.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="registration-main" style={{ justifyContent: 'center' }}>
      <div className="registration-card" style={{ maxWidth: 400, width: '100%' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button
            style={{
              border: 'none',
              background: 'none',
              borderBottom: '2px solid #6a11cb',
              color: '#6a11cb',
              fontWeight: 'bold',
              marginRight: 24,
              fontSize: 18,
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
          <button
            style={{
              border: 'none',
              background: 'none',
              color: '#888',
              fontWeight: 'bold',
              fontSize: 18,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </div>
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              Remember me
            </label>
            <span
  style={{ color: '#6a11cb', fontSize: 14, textDecoration: 'none', cursor: 'pointer' }}
  onClick={() => navigate('/forgot-password')}
>
  Forgot password?
</span>
          </div>
          <button type="submit">Log In</button>
        </form>
        {/* Divider */}
        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, height: 1, background: '#eee' }} />
          <span style={{ margin: '0 12px', color: '#888', fontSize: 14 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: '#eee' }} />
        </div>
        {/* Social Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
  <button
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #ddd',
      borderRadius: 6,
      background: '#fff',
      padding: '8px 0',
      cursor: 'pointer',
      minHeight: 48
    }}
    onClick={() => window.open('https://accounts.google.com/', '_blank')}
  >
    <img
      src="https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png"
      alt="Google"
      style={{ width: 32, height: 32, marginRight: 8, objectFit: 'contain', background: '#fff' }}
    />
    Connect with Google
  </button>
  <button
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #ddd',
      borderRadius: 6,
      background: '#fff',
      padding: '8px 0',
      cursor: 'pointer',
      minHeight: 48
    }}
    onClick={() => window.open('https://moodle.org/', '_blank')}
  >
    <img
      src="https://tse4.mm.bing.net/th?id=OIP.qUerFf_Hpro8xKmORncMJAHaE8&pid=Api&P=0&h=220"
      alt="Moodle"
      style={{ width: 32, height: 32, marginRight: 8, objectFit: 'contain', background: '#fff' }}
    />
    Connect to Moodle
  </button>
</div>
        {/* AI Assistant Box */}
        <div style={{
          background: '#6a11cb',
          color: '#fff',
          borderRadius: 8,
          padding: 16,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          marginTop: 16
        }}>
          <span style={{
            display: 'inline-block',
            background: '#fff',
            color: '#6a11cb',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            marginRight: 12
          }}>i</span>
          <div>
            <b>StudyFlow AI Assistant</b><br />
            Get 24/7 academic support with our AI tutor. Ask questions, get study tips, and receive personalized learning recommendations.
          </div>
        </div>
        {/* Message */}
        {message && <div className="message" style={{ color: message.includes('success') ? 'green' : 'red', marginTop: 12 }}>{message}</div>}
        {/* Link to Register */}
        <div style={{ marginTop: 16 }}>
          Don't have an account? <span style={{ color: '#6a11cb', cursor: 'pointer' }} onClick={() => navigate('/register')}>Sign Up</span>
        </div>
      </div>
    </div>
  ); 
}

export default Login;