import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const mockData = {
  gpa: 3.78,
  gpaChange: 0.12,
  completion: 87,
  completionChange: -3,
  studyHours: 42.5,
  studyHoursChange: 5.2,
  attendance: 95,
  attendanceChange: 0,
  gradeTrends: [90, 92, 88, 94, 96, 91, 89, 93],
  missedTasks: [5, 3, 7, 2, 4, 6, 3, 5],
  weeks: ['W1','W2','W3','W4','W5','W6','W7','W8'],
};

export default function Analytics() {
  const { t } = useSettings();
  const [period, setPeriod] = useState('semester');
  return (
    <div style={{ minHeight: '100vh', padding: 40 }}>
      <div className="card analytics-card" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, padding: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 className="page-title" style={{ fontWeight: 'bold', fontSize: 28 }}>{t('gradesPerformanceAnalytics')}</h2>
          <div>
            <button style={{ background: '#f3eaff', color: '#6a11cb', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 'bold', cursor: 'pointer', marginRight: 12 }}>{t('exportReport')}</button>
            <button style={{ background: '#e3fcec', color: '#2575fc', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 'bold', cursor: 'pointer' }}>{t('filter')}</button>
          </div>
        </div>
        <div style={{ color: 'var(--analytics-desc-color, #888)', fontSize: 17, marginBottom: 24 }}>{t('trackAcademicProgress')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px #23244a22' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#6a11cb' }}>{mockData.gpa.toFixed(2)}</div>
            <div style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 16 }}>{mockData.gpaChange >= 0 ? '+' : ''}{mockData.gpaChange}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px #23244a22' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#2575fc' }}>{mockData.completion}%</div>
            <div style={{ color: '#f77', fontWeight: 'bold', fontSize: 16 }}>{mockData.completionChange >= 0 ? '+' : ''}{mockData.completionChange}%</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px #23244a22' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#43e97b' }}>{mockData.studyHours}</div>
            <div style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 16 }}>+{mockData.studyHoursChange}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px #23244a22' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#ffb347' }}>{mockData.attendance}%</div>
            <div style={{ color: '#43e97b', fontWeight: 'bold', fontSize: 16 }}>{mockData.attendanceChange >= 0 ? '+' : ''}{mockData.attendanceChange}%</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, minHeight: 220, color: '#b3b8d1', boxShadow: '0 2px 8px #23244a22' }}>
            <div style={{ color: '#b3b8d1', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>{t('gradeTrends')}</div>
            <svg width="100%" height="80" viewBox="0 0 200 80">
              <polyline points="10,70 50,40 90,50 130,30 170,60" fill="none" stroke="#6a11cb" strokeWidth="3" />
              <polyline points="10,60 50,30 90,40 130,20 170,50" fill="none" stroke="#43e97b" strokeWidth="3" />
              <polyline points="10,50 50,20 90,30 130,10 170,40" fill="none" stroke="#2575fc" strokeWidth="3" />
            </svg>
            <div style={{ color: '#b3b8d1', fontSize: 13, marginTop: 8 }}>{t('weeklyMonthlySemester')}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, minHeight: 220, color: '#b3b8d1', boxShadow: '0 2px 8px #23244a22' }}>
            <div style={{ color: '#b3b8d1', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>{t('missedTasks')}</div>
            <svg width="100%" height="80" viewBox="0 0 200 80">
              <rect x="20" y="40" width="20" height="30" fill="#f77" />
              <rect x="60" y="20" width="20" height="50" fill="#2575fc" />
              <rect x="100" y="30" width="20" height="40" fill="#43e97b" />
              <rect x="140" y="50" width="20" height="20" fill="#ffb347" />
            </svg>
            <div style={{ color: '#b3b8d1', fontSize: 13, marginTop: 8 }}>{t('bySubjectWeekType')}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 