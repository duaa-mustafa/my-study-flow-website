import React, { useState } from 'react';

const faqs = [
  {
    q: 'How do I add a new subject?',
    a: 'Go to the Subjects page and click the "+ Add Subject" button.'
  },
  {
    q: 'How can I schedule a task on the calendar?',
    a: 'Click an empty cell in the calendar grid and select a task from the unscheduled list.'
  },
  {
    q: 'How do I update my progress?',
    a: 'Go to the Progress page and use the slider to update your progress for each subject.'
  },
  {
    q: 'Can I use StudyFlow on my phone?',
    a: 'Yes! StudyFlow is mobile-friendly and works in your browser.'
  }
];

function getColor(i) {
  const colors = [
    'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)',
    'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
    'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
    'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
    'linear-gradient(90deg, #c471f5 0%, #fa71cd 100%)',
  ];
  return colors[i % colors.length];
}

export default function Help() {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQ.trim()) return;
    setQuestions([
      ...questions,
      { q: newQ, a: 'Our AI assistant will get back to you soon!' }
    ]);
    setNewQ('');
  };

  return (
    <div style={{ minHeight: '100vh', padding: 40 }}>
      <div className="card" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, padding: 36 }}>
        <h2 style={{ fontWeight: 'bold', fontSize: 30, color: '#6a11cb', marginBottom: 32, letterSpacing: 1 }}>Help & FAQ</h2>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#6a11cb', marginBottom: 18 }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {faqs.map((item, i) => (
              <div key={i} style={{
                flex: '1 1 260px',
                minWidth: 260,
                background: '#fafbfc',
                borderRadius: 18,
                boxShadow: '0 2px 12px #e3e0ff',
                padding: 24,
                borderTop: `8px solid transparent`,
                borderImage: `${getColor(i)} 1`,
                position: 'relative',
                marginBottom: 8,
                overflow: 'hidden',
              }}>
                <div style={{ fontWeight: 'bold', fontSize: 18, color: '#333', marginBottom: 8 }}>Q: {item.q}</div>
                <div style={{ color: '#6a11cb', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>A: {item.a}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#6a11cb', marginBottom: 12 }}>Ask a Question</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Type your question..."
              value={newQ}
              onChange={e => setNewQ(e.target.value)}
              style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              required
            />
            <button type="submit" style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Ask</button>
          </form>
        </div>
        {questions.length > 0 && (
          <div>
            <h3 style={{ color: '#6a11cb', marginBottom: 18 }}>Your Questions</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {questions.map((item, i) => (
                <div key={i} style={{
                  flex: '1 1 260px',
                  minWidth: 260,
                  background: '#fafbfc',
                  borderRadius: 18,
                  boxShadow: '0 2px 12px #e3e0ff',
                  padding: 24,
                  borderTop: `8px solid transparent`,
                  borderImage: `${getColor(i + 3)} 1`,
                  position: 'relative',
                  marginBottom: 8,
                  overflow: 'hidden',
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: 18, color: '#333', marginBottom: 8 }}>Q: {item.q}</div>
                  <div style={{ color: '#6a11cb', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>A: {item.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}