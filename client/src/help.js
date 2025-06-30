import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

export default function Help() {
  const { t } = useSettings();
  const faqs = [
    {
      q: t('faqAddSubjectQ'),
      a: t('faqAddSubjectA')
    },
    {
      q: t('faqScheduleTaskQ'),
      a: t('faqScheduleTaskA')
    },
    {
      q: t('faqUpdateProgressQ'),
      a: t('faqUpdateProgressA')
    },
    {
      q: t('faqMobileQ'),
      a: t('faqMobileA')
    }
  ];
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

  return (
    <div id="main-content" style={{ minHeight: '100vh', padding: 40 }}>
      <div className="card" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, padding: 36 }}>
        <h2 style={{ fontWeight: 'bold', fontSize: 30, color: '#6a11cb', marginBottom: 32, letterSpacing: 1 }}>{t('helpFaq')}</h2>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#6a11cb', marginBottom: 18 }}>{t('frequentlyAskedQuestions')}</h3>
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
                <div style={{ fontWeight: 'bold', fontSize: 18, color: '#333', marginBottom: 8 }}>{t('q')}: {item.q}</div>
                <div style={{ color: '#6a11cb', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>{t('a')}: {item.a}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#6a11cb', marginBottom: 12 }}>{t('askAQuestion')}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder={t('typeYourQuestion')}
              value={newQ}
              onChange={e => setNewQ(e.target.value)}
              style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              required
            />
            <button type="submit" style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>{t('ask')}</button>
          </form>
        </div>
        {questions.length > 0 && (
          <div>
            <h3 style={{ color: '#6a11cb', marginBottom: 18 }}>{t('yourQuestions')}</h3>
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
                  <div style={{ fontWeight: 'bold', fontSize: 18, color: '#333', marginBottom: 8 }}>{t('q')}: {item.q}</div>
                  <div style={{ color: '#6a11cb', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>{t('a')}: {item.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}