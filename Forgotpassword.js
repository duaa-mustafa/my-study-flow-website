import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would send a request to your backend to handle password reset
    setMessage('If this email is registered, you will receive password reset instructions.');
  };

  return (
    <div className="registration-main" style={{ justifyContent: 'center' }}>
      <div className="registration-card" style={{ maxWidth: 400, width: '100%' }}>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <div className="message" style={{ marginTop: 12 }}>{message}</div>}
      </div>
    </div>
  );
}

export default ForgotPassword;