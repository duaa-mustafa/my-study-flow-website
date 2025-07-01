import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from './SettingsContext';

// Mock API functions
const fetchTasks = () => new Promise(resolve => setTimeout(() => resolve([
  { id: 1, text: 'Complete Database Normalization Exercise', time: '2:00 PM', done: false },
  { id: 2, text: 'Review Statistics Probability Concepts', time: '4:30 PM', done: false },
  { id: 3, text: 'Work on Software Engineering Project Plan', time: '7:00 PM', done: false },
  { id: 4, text: 'Study Operating System Process Management', time: '8:30 PM', done: false },
  { id: 5, text: 'Complete Network Protocols Assignment', time: '9:15 PM', done: false },
]), 800));
const fetchProgress = () => new Promise(resolve => setTimeout(() => resolve([
  { subject: 'Database', percent: 85, color: '#6a11cb' },
  { subject: 'Statistics', percent: 72, color: '#43e97b' },
  { subject: 'Software Engineering', percent: 60, color: '#2575fc' },
  { subject: 'Operating System', percent: 45, color: '#ff9800' },
]), 800));
const fetchDeadlines = () => new Promise(resolve => setTimeout(() => resolve([
  { name: 'Statistics Quiz', date: 'Tomorrow, 10:00 AM', color: '#e57373' },
  { name: 'Software Engineering Project', date: 'Friday, 2:00 PM', color: '#6a11cb' },
]), 800));

function countTasksDone(assignments) {
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  return safeAssignments.filter(a => (a.status || '').toLowerCase() === 'complete').length;
}

function countDeadlines(assignments) {
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const now = new Date();
  return safeAssignments.filter(a => {
    if (!a.due) return false;
    const dueDate = new Date(a.due);
    return dueDate >= now && (a.status || '').toLowerCase() !== 'complete';
  }).length;
}

export default function Dashboard() {
  const { t, fontSize, contrast, language } = useSettings();
  const [tasks, setTasks] = useState(null);
  const [subjectProgress, setSubjectProgress] = useState(null);
  const [deadlines, setDeadlines] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState([
    { from: 'ai', text: t('aiWelcome') },
    { from: 'user', text: t('aiSampleQ') },
    { from: 'ai', text: t('aiNormExplain') },
  ]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({ studyHours: 12.5, tasksCompleted: 0, streakDays: 5, upcomingDeadlines: 0 });
  const token = localStorage.getItem('token');

  // Get user full name from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const fullName = user?.fullName || 'User';

  // Mock data for beautiful widgets
  const quickActions = [
    { icon: '🎯', label: t('startFocusSession'), route: '/focus', color: '#667eea' },
    { icon: '📅', label: t('setAvailability'), route: '/set-availability', color: '#43e97b' },
    { icon: '📚', label: t('viewSubjects'), route: '/subjects', color: '#f093fb' },
    { icon: '📝', label: t('addAssignment'), route: '/assignments', color: '#4facfe' }
  ];

  const recentTasks = [
    { title: 'Math Assignment', subject: 'Mathematics', due: 'Today', priority: 'high' },
    { title: 'Essay Draft', subject: 'English', due: 'Tomorrow', priority: 'medium' },
    { title: 'Lab Report', subject: 'Physics', due: 'Friday', priority: 'low' }
  ];

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/assignments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setAssignments(Array.isArray(data) ? data : []);
        setStats(s => ({
          ...s,
          tasksCompleted: countTasksDone(data),
          upcomingDeadlines: countDeadlines(data),
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchProgress(), fetchDeadlines()]).then(([tasks, progress, deadlines]) => {
      setTasks(tasks);
      setSubjectProgress(progress);
      setDeadlines(deadlines);
    });
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetch('http://localhost:5000/assignments', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setAssignments(Array.isArray(data) ? data : []);
          setStats(s => ({
            ...s,
            tasksCompleted: countTasksDone(data),
            upcomingDeadlines: countDeadlines(data),
          }));
        });
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [token]);

  const handleTaskToggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessage = { from: 'user', text: input };
    setChat(prev => [...prev, newMessage]);
    setInput('');
    setAiLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setChat(prev => [...prev, { 
        from: 'ai', 
        text: 'I understand you\'re asking about ' + input + '. Let me help you with that!' 
      }]);
      setAiLoading(false);
    }, 1000);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80, fontSize: 22, color: '#6a11cb' }}>{t('loadingDashboard') || 'Loading dashboard...'}</div>;

  return (
    <div
      id="main-content"
      className={`dashboard-container font-${fontSize} ${contrast === 'high' ? 'high-contrast' : ''}`}
      style={{ padding: '32px', minHeight: '100vh' }}
      lang={language}
    >
      {/* Welcome Header */}
      <div className="card" style={{ borderRadius: 20, padding: '32px', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 'bold' }}>
          {t('welcomeBack') || 'Welcome back!'} 👋
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          {t('readyToCrush') || 'Ready to crush your study goals today?'}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        {/* Study Hours */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '3px solid #667eea20',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', color: '#667eea', marginBottom: 8 }}>⏰</div>
          <div style={{ color: '#666', fontSize: '1.1rem', marginBottom: 4 }}>{t('studyHours') || 'Study Hours'}</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#667eea' }}>{stats.studyHours} {t('hours') || 'hrs'}</div>
        </div>
        {/* Tasks Done - visually enhanced */}
        <div style={{
          background: 'linear-gradient(135deg, #e0fff4 0%, #f3fff9 100%)',
          borderRadius: 16,
          padding: '24px',
          boxShadow: '0 4px 20px #43e97b22',
          border: '3px solid #43e97b40',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 160,
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 8, color: '#43e97b', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 12px #43e97b22', padding: 12, display: 'inline-block' }}>✅</div>
          <div style={{ color: '#43e97b', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 4 }}>{t('tasksDone') || 'Tasks Done'}</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#43e97b' }}>{stats.tasksCompleted}</div>
        </div>
        {/* Streak */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '3px solid #f093fb20',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', color: '#f093fb', marginBottom: 8 }}>🔥</div>
          <div style={{ color: '#f093fb', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>{t('streak')}</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#f093fb' }}>{stats.streakDays} {t('days')}</div>
        </div>
        {/* Deadlines */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '3px solid #4facfe20',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', color: '#4facfe', marginBottom: 8 }}>📅</div>
          <div style={{ color: '#4facfe', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>{t('deadlines')}</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#4facfe' }}>{stats.upcomingDeadlines}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
          {t('quickActions')} 🚀
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          {quickActions.map((action, i) => (
            <Link key={i} to={action.route} style={{ textDecoration: 'none' }}>
              <div style={{
                background: `linear-gradient(135deg, ${action.color}20 0%, ${action.color}10 100%)`,
                border: `2px solid ${action.color}30`,
                borderRadius: 16,
                padding: '24px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }} onMouseEnter={e => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }} onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{action.icon}</div>
                <div style={{ color: '#333', fontWeight: 'bold', fontSize: '1rem' }}>{action.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Recent Tasks */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: '24px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
        }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
            📋 {t('recentTasks')}
          </h3>
          <div>
            {recentTasks.map((task, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '8px',
                background: '#f8f9fa',
                borderRadius: 8,
                border: `2px solid ${task.priority === 'high' ? '#ff6b6b' : task.priority === 'medium' ? '#ffd93d' : '#6bcf7f'}20`
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{task.title}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{task.subject} • {t('due')} {t(task.due.toLowerCase())}</div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: 12,
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: task.priority === 'high' ? '#ff6b6b20' : task.priority === 'medium' ? '#ffd93d20' : '#6bcf7f20',
                  color: task.priority === 'high' ? '#ff6b6b' : task.priority === 'medium' ? '#e67700' : '#6bcf7f'
                }}>
                  {t(task.priority)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: '24px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '1.5rem', marginRight: '12px' }}>🤖</div>
            <h3 style={{ fontSize: '1.3rem', color: '#333', fontWeight: 'bold' }}>{t('aiAssistant')}</h3>
          </div>
          
          <div style={{ 
            flex: 1, 
            background: '#f8f9fa', 
            borderRadius: 12, 
            padding: '16px', 
            marginBottom: '16px',
            overflowY: 'auto',
            maxHeight: '300px'
          }}>
            {chat.map((msg, i) => (
              <div key={i} style={{ 
                marginBottom: '12px', 
                textAlign: msg.from === 'user' ? 'right' : 'left' 
              }}>
                <div style={{ 
                  display: 'inline-block', 
                  background: msg.from === 'user' ? '#667eea' : '#fff', 
                  color: msg.from === 'user' ? '#fff' : '#333', 
                  borderRadius: 12, 
                  padding: '8px 12px', 
                  fontSize: '0.9rem', 
                  maxWidth: '80%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div style={{ color: '#667eea', fontSize: '0.9rem', margin: '8px 0' }}>
                {t('aiTyping')}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('askMeAnything')}
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: 8,
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                background: '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {t('send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
