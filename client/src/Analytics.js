import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

// Example mock data for summary cards
const summaryData = {
  gpa: 3.78,
  gpaChange: 0.12,
  gpaPercent: 94.5,
  completed: 87,
  completedChange: -3,
  completedTotal: 42,
  completedOutOf: 48,
  studyHours: 42.5,
  studyHoursChange: 5.2,
  studyHoursPercent: 60,
  attendance: 95,
  attendanceChange: 0,
  attendanceTotal: 19,
  attendanceOutOf: 20,
};

// Mock data for different time periods
const timePeriodData = {
  'Current Semester': {
    gpa: 3.78,
    gpaChange: 0.12,
    completed: 87,
    completedChange: -3,
    studyHours: 42.5,
    studyHoursChange: 5.2,
    attendance: 95,
    attendanceChange: 0,
  },
  'Last Semester': {
    gpa: 3.65,
    gpaChange: -0.08,
    completed: 92,
    completedChange: 2,
    studyHours: 38.2,
    studyHoursChange: -2.1,
    attendance: 92,
    attendanceChange: -3,
  },
  'Current Year': {
    gpa: 3.72,
    gpaChange: 0.15,
    completed: 89,
    completedChange: 1,
    studyHours: 45.8,
    studyHoursChange: 8.5,
    attendance: 94,
    attendanceChange: 2,
  },
  'All Time': {
    gpa: 3.68,
    gpaChange: 0.22,
    completed: 91,
    completedChange: 4,
    studyHours: 41.3,
    studyHoursChange: 3.7,
    attendance: 93,
    attendanceChange: 1,
  },
};

// Mock data for Grade Trends
const gradeTrendsWeekly = [
  { week: 'W1', Engineering: 92, Networks: 85, Systems: 80, AI: 75 },
  { week: 'W2', Engineering: 94, Networks: 87, Systems: 81, AI: 76 },
  { week: 'W3', Engineering: 95, Networks: 88, Systems: 82, AI: 77 },
  { week: 'W4', Engineering: 96, Networks: 89, Systems: 83, AI: 78 },
  { week: 'W5', Engineering: 97, Networks: 90, Systems: 84, AI: 79 },
  { week: 'W6', Engineering: 97, Networks: 91, Systems: 85, AI: 80 },
  { week: 'W7', Engineering: 98, Networks: 92, Systems: 86, AI: 81 },
  { week: 'W8', Engineering: 98, Networks: 93, Systems: 87, AI: 82 },
];
const gradeTrendsMonthly = [
  { month: 'Jan', Engineering: 90, Networks: 82, Systems: 78, AI: 70 },
  { month: 'Feb', Engineering: 92, Networks: 85, Systems: 80, AI: 75 },
  { month: 'Mar', Engineering: 94, Networks: 87, Systems: 81, AI: 76 },
  { month: 'Apr', Engineering: 96, Networks: 89, Systems: 83, AI: 78 },
];
const gradeTrendsSemester = [
  { sem: 'Sem1', Engineering: 88, Networks: 80, Systems: 75, AI: 68 },
  { sem: 'Sem2', Engineering: 95, Networks: 90, Systems: 85, AI: 80 },
];

// Mock data for Missed Tasks
const missedTasksBySubject = [
  { subject: 'Engineering', Missed: 10, Completed: 2 },
  { subject: 'Networks', Missed: 8, Completed: 3 },
  { subject: 'Systems', Missed: 7, Completed: 4 },
  { subject: 'AI', Missed: 5, Completed: 5 },
];
const missedTasksByWeek = [
  { week: 'W1', Missed: 3, Completed: 5 },
  { week: 'W2', Missed: 2, Completed: 6 },
  { week: 'W3', Missed: 4, Completed: 4 },
  { week: 'W4', Missed: 1, Completed: 7 },
  { week: 'W5', Missed: 2, Completed: 6 },
  { week: 'W6', Missed: 3, Completed: 5 },
  { week: 'W7', Missed: 2, Completed: 6 },
  { week: 'W8', Missed: 1, Completed: 7 },
];
const missedTasksByType = [
  { type: 'Assignment', Missed: 6, Completed: 12 },
  { type: 'Quiz', Missed: 2, Completed: 8 },
  { type: 'Project', Missed: 1, Completed: 3 },
  { type: 'Lab', Missed: 2, Completed: 5 },
];

const trendTabs = ['Weekly', 'Monthly', 'Semester'];
const missedTabs = ['By Subject', 'By Week', 'By Type'];

export default function Analytics() {
  const [trendTab, setTrendTab] = useState('Weekly');
  const [missedTab, setMissedTab] = useState('By Subject');
  const [period, setPeriod] = useState('Current Semester');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentData, setCurrentData] = useState(timePeriodData['Current Semester']);
  
  // Filter state
  const [selectedSubjects, setSelectedSubjects] = useState(['Engineering', 'Networks', 'Systems', 'AI']);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState(['Assignment', 'Quiz', 'Project', 'Lab']);
  const [gradeRange, setGradeRange] = useState(60);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Handle time period change
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    setCurrentData(timePeriodData[newPeriod]);
  };

  // Handle refresh - generate new random data
  const handleRefresh = () => {
    const newData = {
      gpa: (3.5 + Math.random() * 0.5).toFixed(2),
      gpaChange: (Math.random() * 0.4 - 0.2).toFixed(2),
      completed: Math.floor(80 + Math.random() * 20),
      completedChange: Math.floor(Math.random() * 10 - 5),
      studyHours: (30 + Math.random() * 30).toFixed(1),
      studyHoursChange: (Math.random() * 10 - 5).toFixed(1),
      attendance: Math.floor(85 + Math.random() * 15),
      attendanceChange: Math.floor(Math.random() * 10 - 5),
    };
    setCurrentData(newData);
  };

  // Handle export report
  const handleExport = () => {
    const exportData = {
      period: period,
      summary: currentData,
      gradeTrends: gradeTrendsData,
      missedTasks: missedTasksData,
      filters: {
        subjects: selectedSubjects,
        taskTypes: selectedTaskTypes,
        gradeRange: gradeRange
      },
      exportDate: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${period.toLowerCase().replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle filter
  const handleFilter = () => {
    setShowFilterModal(true);
  };

  // Handle subject selection
  const handleSubjectChange = (subject, checked) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subject]);
    } else {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    }
  };

  // Handle task type selection
  const handleTaskTypeChange = (type, checked) => {
    if (checked) {
      setSelectedTaskTypes([...selectedTaskTypes, type]);
    } else {
      setSelectedTaskTypes(selectedTaskTypes.filter(t => t !== type));
    }
  };

  // Apply filters
  const applyFilters = () => {
    setFiltersApplied(true);
    setShowFilterModal(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedSubjects(['Engineering', 'Networks', 'Systems', 'AI']);
    setSelectedTaskTypes(['Assignment', 'Quiz', 'Project', 'Lab']);
    setGradeRange(60);
    setFiltersApplied(false);
  };

  // Select chart data based on tab and apply filters
  let gradeTrendsData, xKey;
  if (trendTab === 'Weekly') {
    gradeTrendsData = gradeTrendsWeekly;
    xKey = 'week';
  } else if (trendTab === 'Monthly') {
    gradeTrendsData = gradeTrendsMonthly;
    xKey = 'month';
  } else {
    gradeTrendsData = gradeTrendsSemester;
    xKey = 'sem';
  }

  // Apply subject filters to grade trends
  if (filtersApplied) {
    gradeTrendsData = gradeTrendsData.map(item => {
      const filteredItem = { [xKey]: item[xKey] };
      selectedSubjects.forEach(subject => {
        if (item[subject] !== undefined) {
          filteredItem[subject] = item[subject];
        }
      });
      return filteredItem;
    });
  }

  let missedTasksData, missedXKey;
  if (missedTab === 'By Subject') {
    missedTasksData = missedTasksBySubject;
    missedXKey = 'subject';
  } else if (missedTab === 'By Week') {
    missedTasksData = missedTasksByWeek;
    missedXKey = 'week';
  } else {
    missedTasksData = missedTasksByType;
    missedXKey = 'type';
  }

  // Apply filters to missed tasks
  if (filtersApplied) {
    if (missedTab === 'By Subject') {
      missedTasksData = missedTasksData.filter(item => selectedSubjects.includes(item.subject));
    } else if (missedTab === 'By Type') {
      missedTasksData = missedTasksData.filter(item => selectedTaskTypes.includes(item.type));
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      <div style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', padding: '32px 0 16px 0', borderRadius: '0 0 32px 32px', marginBottom: 32 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontWeight: 'bold', fontSize: 32, margin: 0 }}>Grades & Performance Analytics</h2>
            <div style={{ fontSize: 18, opacity: 0.9, marginTop: 4 }}>Track your academic progress and identify areas for improvement</div>
          </div>
          <button onClick={handleExport} style={{ background: '#fff', color: '#6a11cb', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #b3b8d1', cursor: 'pointer' }}>Export Report</button>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>Time Period:</div>
          <select value={period} onChange={e => handlePeriodChange(e.target.value)} style={{ fontSize: 16, padding: '8px 18px', borderRadius: 8, border: '1px solid #ccc' }}>
            <option>Current Semester</option>
            <option>Last Semester</option>
            <option>Current Year</option>
            <option>All Time</option>
          </select>
          <div style={{ flex: 1 }} />
          {filtersApplied && (
            <button onClick={resetFilters} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 'bold', fontSize: 15, marginRight: 8, cursor: 'pointer' }}>Clear Filters</button>
          )}
          <button onClick={handleRefresh} style={{ background: '#fff', color: '#6a11cb', border: '1px solid #eee', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 15, marginRight: 8, boxShadow: '0 2px 8px #e3e0ff', cursor: 'pointer' }}>Refresh</button>
          <button onClick={handleFilter} style={{ background: '#fff', color: '#6a11cb', border: '1px solid #eee', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 15, boxShadow: '0 2px 8px #e3e0ff', cursor: 'pointer' }}>Filter</button>
        </div>
        {/* Summary Cards */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <SummaryCard
            label="Current GPA"
            value={currentData.gpa}
            sub="out of 4.0"
            change={currentData.gpaChange}
            percent={Math.round(currentData.gpa * 25)}
            color="#6a11cb"
          />
          <SummaryCard
            label="Completed Tasks"
            value={currentData.completed + '%'}
            sub={`${Math.floor(currentData.completed * 0.5)} of ${Math.floor(currentData.completed * 0.55)} tasks`}
            change={currentData.completedChange}
            percent={currentData.completed}
            color="#2575fc"
          />
          <SummaryCard
            label="Study Hours"
            value={currentData.studyHours}
            sub="hours this month"
            change={currentData.studyHoursChange}
            percent={Math.round((currentData.studyHours / 60) * 100)}
            color="#43e97b"
          />
          <SummaryCard
            label="Attendance Rate"
            value={currentData.attendance + '%'}
            sub={`${Math.floor(currentData.attendance * 0.2)} of ${Math.floor(currentData.attendance * 0.21)} classes`}
            change={currentData.attendanceChange}
            percent={currentData.attendance}
            color="#ff9800"
          />
        </div>
        {/* Analytics Cards */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Grade Trends Card */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #6a11cb12', padding: 28, minWidth: 380, flex: 2, maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 'bold', fontSize: 18, color: '#2575fc' }}>Grade Trends</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {trendTabs.map(tab => (
                  <button key={tab} onClick={() => setTrendTab(tab)} style={{ background: trendTab === tab ? 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)' : '#f7f8fa', color: trendTab === tab ? '#fff' : '#2575fc', border: 'none', borderRadius: 8, padding: '4px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>{tab}</button>
                ))}
              </div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gradeTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xKey} />
                  <YAxis domain={[gradeRange, 100]} />
                  <Tooltip />
                  <Legend />
                  {selectedSubjects.includes('Engineering') && <Line type="monotone" dataKey="Engineering" stroke="#6a11cb" strokeWidth={3} />}
                  {selectedSubjects.includes('Networks') && <Line type="monotone" dataKey="Networks" stroke="#2575fc" strokeWidth={3} />}
                  {selectedSubjects.includes('Systems') && <Line type="monotone" dataKey="Systems" stroke="#43e97b" strokeWidth={3} />}
                  {selectedSubjects.includes('AI') && <Line type="monotone" dataKey="AI" stroke="#ff9800" strokeWidth={3} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Missed Tasks Card */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #6a11cb12', padding: 28, minWidth: 320, flex: 1, maxWidth: 420 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 'bold', fontSize: 18, color: '#2575fc' }}>Missed Tasks</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {missedTabs.map(tab => (
                  <button key={tab} onClick={() => setMissedTab(tab)} style={{ background: missedTab === tab ? 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)' : '#f7f8fa', color: missedTab === tab ? '#fff' : '#2575fc', border: 'none', borderRadius: 8, padding: '4px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>{tab}</button>
                ))}
              </div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={missedTasksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={missedXKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Missed" fill="#e57373" />
                  <Bar dataKey="Completed" fill="#43e97b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 500, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, color: '#2575fc' }}>Filter Analytics</h3>
              <button onClick={() => setShowFilterModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Subjects:</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Engineering', 'Networks', 'Systems', 'AI'].map(subject => (
                  <label key={subject} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input 
                      type="checkbox" 
                      checked={selectedSubjects.includes(subject)}
                      onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                      style={{ margin: 0 }} 
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Task Types:</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Assignment', 'Quiz', 'Project', 'Lab'].map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTaskTypes.includes(type)}
                      onChange={(e) => handleTaskTypeChange(type, e.target.checked)}
                      style={{ margin: 0 }} 
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Grade Range:</label>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={gradeRange} 
                  onChange={(e) => setGradeRange(parseInt(e.target.value))}
                  style={{ flex: 1 }} 
                />
                <span>{gradeRange}% - 100%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowFilterModal(false)} style={{ background: '#f7f8fa', color: '#666', border: '1px solid #ddd', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button onClick={applyFilters} style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SummaryCard component
function SummaryCard({ label, value, sub, change, percent, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #6a11cb12', padding: 28, minWidth: 240, flex: 1, maxWidth: 270, textAlign: 'center', position: 'relative' }}>
      <div style={{ fontWeight: 'bold', fontSize: 17, color: '#222', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 'bold', color }}>{value}
        <span style={{ fontSize: 16, color: change > 0 ? '#43e97b' : change < 0 ? '#e57373' : '#888', marginLeft: 8 }}>{change > 0 ? `+${change}` : change}</span>
      </div>
      <div style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>{sub}</div>
      <div style={{ position: 'absolute', top: 24, right: 24, fontWeight: 'bold', color, fontSize: 15, background: '#f7f8fa', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${color}` }}>{percent}%</div>
    </div>
  );
} 