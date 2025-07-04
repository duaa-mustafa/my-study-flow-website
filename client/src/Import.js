import React, { useState } from 'react';
import { useSettings } from './SettingsContext';
import { useAssignments } from './AssignmentsContext';

const TABS = [
  { label: 'Course Link', key: 'link' },
  { label: 'API Token', key: 'token' },
  { label: 'Calendar File', key: 'calendar' },
];

// Mock course data for University of Khartoum Computer Science
const MOCK_COURSE_DATA = {
  'https://lms.uofk.edu/course/view.php?id=2393': {
    courseName: 'Database Systems',
    assignments: [
      { name: 'Database Design Project', due: '2025-06-15', color: '#6a11cb', subject: 'Database Systems', priority: 'High' },
      { name: 'SQL Queries Assignment', due: '2025-06-20', color: '#43e97b', subject: 'Database Systems', priority: 'Medium' },
      { name: 'Normalization Exercise', due: '2025-06-25', color: '#2575fc', subject: 'Database Systems', priority: 'Medium' },
      { name: 'Final Database Project', due: '2025-07-05', color: '#ff9800', subject: 'Database Systems', priority: 'High' }
    ]
  },
  'https://lms.uofk.edu/course/view.php?id=2394': {
    courseName: 'Software Engineering',
    assignments: [
      { name: 'Requirements Analysis Document', due: '2025-06-18', color: '#6a11cb', subject: 'Software Engineering', priority: 'High' },
      { name: 'System Design Assignment', due: '2025-06-22', color: '#43e97b', subject: 'Software Engineering', priority: 'Medium' },
      { name: 'Testing Strategy Report', due: '2025-06-28', color: '#2575fc', subject: 'Software Engineering', priority: 'Medium' },
      { name: 'Final Project Presentation', due: '2025-07-10', color: '#ff9800', subject: 'Software Engineering', priority: 'High' }
    ]
  },
  'https://lms.uofk.edu/course/view.php?id=2395': {
    courseName: 'Operating Systems',
    assignments: [
      { name: 'Process Management Lab', due: '2025-06-16', color: '#6a11cb', subject: 'Operating Systems', priority: 'Medium' },
      { name: 'Memory Management Assignment', due: '2025-06-21', color: '#43e97b', subject: 'Operating Systems', priority: 'High' },
      { name: 'File System Implementation', due: '2025-06-26', color: '#2575fc', subject: 'Operating Systems', priority: 'Medium' },
      { name: 'Final OS Project', due: '2025-07-08', color: '#ff9800', subject: 'Operating Systems', priority: 'High' }
    ]
  },
  'https://lms.uofk.edu/course/view.php?id=2396': {
    courseName: 'Computer Networks',
    assignments: [
      { name: 'Network Protocol Analysis', due: '2025-06-17', color: '#6a11cb', subject: 'Computer Networks', priority: 'Medium' },
      { name: 'Network Security Assignment', due: '2025-06-23', color: '#43e97b', subject: 'Computer Networks', priority: 'High' },
      { name: 'Network Design Project', due: '2025-06-29', color: '#2575fc', subject: 'Computer Networks', priority: 'Medium' },
      { name: 'Final Network Implementation', due: '2025-07-12', color: '#ff9800', subject: 'Computer Networks', priority: 'High' }
    ]
  }
};

export default function Import() {
  const { t } = useSettings();
  const { addAssignment } = useAssignments();
  const [tab, setTab] = useState('link');
  const [input, setInput] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      // Check if the input URL matches any of our mock courses
      const courseData = MOCK_COURSE_DATA[input];
      
      if (courseData) {
        setCourseInfo(courseData.courseName);
        setAssignments(courseData.assignments);
      } else {
        // Default mock data for unknown courses
        setCourseInfo('Computer Science Course');
        setAssignments([
          { name: 'Database Assignment', due: '2025-06-20', color: '#6a11cb', subject: 'Computer Science', priority: 'High' },
          { name: 'Programming Project', due: '2025-06-25', color: '#43e97b', subject: 'Computer Science', priority: 'Medium' },
          { name: 'Algorithm Analysis', due: '2025-06-30', color: '#2575fc', subject: 'Computer Science', priority: 'Medium' },
          { name: 'Final Project', due: '2025-07-05', color: '#ff9800', subject: 'Computer Science', priority: 'High' }
        ]);
      }
      setLoading(false);
    }, 1500);
  };

  const handleImportAll = async () => {
    if (!assignments || assignments.length === 0) return;
    
    setImporting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Import each assignment one by one
      for (const assignment of assignments) {
        const assignmentData = {
          title: assignment.name,
          subject: assignment.subject,
          due: assignment.due,
          priority: assignment.priority,
          status: 'Incomplete'
        };

        const result = await addAssignment(assignmentData);
        if (result) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        alert(`✅ Successfully imported ${successCount} assignments!\n${errorCount > 0 ? `❌ ${errorCount} failed to import.` : ''}\n\nYou can now view them in your Assignments section.`);
        // Clear the imported assignments from display
        setAssignments(null);
        setCourseInfo(null);
      } else {
        alert('❌ Failed to import assignments. Please try again.');
      }
    } catch (error) {
      alert('❌ Error importing assignments. Please check your connection and try again.');
    } finally {
      setImporting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#e57373';
      case 'Medium': return '#ffb74d';
      case 'Low': return '#81c784';
      default: return '#6a11cb';
    }
  };

  return (
    <div className="card" style={{ maxWidth: 700, margin: '0 auto', borderRadius: 20, padding: 36, marginTop: 32 }}>
      <h2 className="page-title" style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 8 }}>{t('importFromMoodle')}</h2>
      <div style={{ color: '#888', fontSize: 17, marginBottom: 24 }}>{t('importFromMoodleDesc')}</div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
        {TABS.map(tTab => (
          <button
            key={tTab.key}
            className={tab === tTab.key ? "main-btn" : "main-btn-secondary"}
            onClick={() => { setTab(tTab.key); setInput(''); setAssignments(null); setCourseInfo(null); }}
          >
            {tTab.label}
          </button>
        ))}
      </div>
      <div style={{ background: '#f7f8fa', borderRadius: 12, padding: 24, marginBottom: 18 }}>
        {tab === 'link' && (
          <>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('pasteMoodleCourseLink')}</div>
            <input
              type="text"
              placeholder="https://lms.uofk.edu/course/view.php?id=2393"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', marginBottom: 12, fontSize: 16 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#888' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> {t('rememberMoodleCredentials')}
            </label>
          </>
        )}
        {tab === 'token' && (
          <>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('enterApiToken')}</div>
            <input
              type="text"
              placeholder={t('pasteApiToken')}
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', marginBottom: 12, fontSize: 16 }}
            />
          </>
        )}
        {tab === 'calendar' && (
          <>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('uploadCalendarFile')}</div>
            <input type="file" style={{ marginBottom: 12 }} />
          </>
        )}
        <button
          onClick={handleFetch}
          disabled={loading || !input}
          className={loading || !input ? "main-btn-disabled" : "main-btn"}
        >{loading ? t('fetching') : t('fetchAssignments')}</button>
        {assignments && (
          <div style={{ marginTop: 24 }}>
            {courseInfo && (
              <div style={{ fontWeight: 'bold', color: '#2575fc', marginBottom: 12, fontSize: 18 }}>
                📚 {courseInfo}
              </div>
            )}
            <div style={{ fontWeight: 'bold', color: '#2575fc', marginBottom: 8 }}>{t('assignmentsFound')}: {assignments.length}</div>
            {assignments.map((a, index) => (
              <div key={index} style={{ 
                background: a.color, 
                color: '#fff', 
                borderRadius: 8, 
                padding: '12px 18px', 
                marginBottom: 10, 
                fontWeight: 'bold', 
                fontSize: 16, 
                boxShadow: '0 2px 8px #e3e0ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div>{a.name}</div>
                  <div style={{ fontWeight: 'normal', fontSize: 14, opacity: 0.9 }}>{a.subject}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 'normal' }}>Due: {a.due}</div>
                  <div style={{ 
                    fontSize: 12, 
                    fontWeight: 'normal', 
                    background: getPriorityColor(a.priority),
                    padding: '2px 8px',
                    borderRadius: 4,
                    marginTop: 4
                  }}>
                    {a.priority}
                  </div>
                </div>
              </div>
            ))}
            <button 
              className={importing ? "main-btn-disabled" : "main-btn"}
              style={{ marginTop: 16, width: '100%' }}
              onClick={handleImportAll}
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Import All Assignments'}
            </button>
          </div>
        )}
      </div>
      <div style={{ background: '#f3eaff', borderRadius: 12, padding: 18, marginTop: 18 }}>
        <div style={{ fontWeight: 'bold', color: '#6a11cb', marginBottom: 6 }}>{t('needHelp')}</div>
        <ul style={{ color: '#6a11cb', fontSize: 15, margin: 0, paddingLeft: 20 }}>
          <li>{t('helpMoodleLogin')}</li>
          <li>{t('helpApiToken')}</li>
          <li>{t('helpCalendarExport')}</li>
        </ul>
      </div>
    </div>
  );
} 