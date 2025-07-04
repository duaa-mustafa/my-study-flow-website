import React, { useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { useAssignments } from './AssignmentsContext';

const initialUnscheduledTasks = [
  { id: 1, name: 'Software Engineering Project', duration: '1 hour', priority: 'High' },
  { id: 2, name: 'Database Assignment', duration: '2 hours', priority: 'Medium' },
  { id: 3, name: 'Operating System Reading', duration: '45 minutes', priority: 'Low' },
  { id: 4, name: 'Network Protocol Analysis', duration: '1.5 hours', priority: 'Medium' },
  { id: 5, name: 'Database Review', duration: '30 minutes', priority: 'Low' },
];

const initialScheduledTasks = [
  {
    id: 6,
    name: 'Database Assignment',
    day: 3, // Wednesday
    start: '10:00',
    end: '12:00',
    color: '#b39ddb',
    priority: 'Medium',
  },
  {
    id: 7,
    name: 'Network Protocol Analysis',
    day: 5, // Friday
    start: '1:00',
    end: '2:30',
    color: '#ffccbc',
    priority: 'Medium',
  },
  {
    id: 8,
    name: 'Operating System Reading',
    day: 4, // Thursday
    start: '3:00',
    end: '4:00',
    color: '#c8e6c9',
    priority: 'Low',
  },
];

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const dates = [4, 5, 6, 7, 8, 9, 10];
const times = [
  '8:00', '9:00', '10:00', '11:00', '12:00',
  '1:00', '2:00', '3:00', '4:00',
];

const priorityColors = {
  High: '#e57373',
  Medium: '#ffb74d',
  Low: '#81c784',
};

// Assignment type durations
const assignmentDurations = {
  'Database Systems': '3 hours',
  'Software Engineering': '4 hours',
  'Operating Systems': '2.5 hours',
  'Computer Networks': '3 hours',
  'Computer Science': '2 hours',
  'default': '2 hours'
};

function Calendar() {
  const { t } = useSettings();
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const [unscheduledTasks, setUnscheduledTasks] = useState(initialUnscheduledTasks);
  const [scheduledTasks, setScheduledTasks] = useState(initialScheduledTasks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', duration: '', priority: 'Medium' });
  const [cellToSchedule, setCellToSchedule] = useState(null); // { day, time }
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // Get duration based on assignment subject
  const getAssignmentDuration = (subject) => {
    return assignmentDurations[subject] || assignmentDurations['default'];
  };

  // Auto-schedule assignments based on due dates
  const autoScheduleAssignments = (assignmentTasks) => {
    const autoScheduled = [];
    const remainingTasks = [];

    assignmentTasks.forEach((task, index) => {
      if (task.due) {
        // Calculate days until due date
        const dueDate = new Date(task.due);
        const today = new Date();
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        // Auto-schedule if due within 7 days
        if (daysUntilDue <= 7 && daysUntilDue > 0) {
          // Find available time slot (simple algorithm)
          const dayIndex = Math.min(daysUntilDue - 1, 6); // 0-6 for days
          const timeSlot = '10:00'; // Default time
          
          const autoScheduledTask = {
            ...task,
            day: dayIndex,
            start: timeSlot,
            end: getEndTime(timeSlot, task.duration),
            color: priorityColors[task.priority],
            autoScheduled: true
          };
          
          autoScheduled.push(autoScheduledTask);
        } else {
          remainingTasks.push(task);
        }
      } else {
        remainingTasks.push(task);
      }
    });

    return { autoScheduled, remainingTasks };
  };

  // Convert assignments to unscheduled tasks format
  useEffect(() => {
    if (assignments && assignments.length > 0) {
      const assignmentTasks = assignments
        .filter(assignment => assignment.status !== 'Complete') // Only show incomplete assignments
        .map(assignment => ({
          id: `assignment-${assignment.id}`,
          name: assignment.title,
          duration: getAssignmentDuration(assignment.subject),
          priority: assignment.priority || 'Medium',
          subject: assignment.subject,
          due: assignment.due,
          type: 'assignment',
          assignmentId: assignment.id
        }));

      // Auto-schedule assignments
      const { autoScheduled, remainingTasks } = autoScheduleAssignments(assignmentTasks);
      
      // Add auto-scheduled tasks to calendar
      if (autoScheduled.length > 0) {
        setScheduledTasks(prev => [...prev, ...autoScheduled]);
      }

      // Combine manual tasks with remaining assignment tasks
      setUnscheduledTasks([...initialUnscheduledTasks, ...remainingTasks]);
    }
  }, [assignments]);

  // Add new unscheduled task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.name || !newTask.duration) return;
    setUnscheduledTasks([...unscheduledTasks, {
      id: Date.now(),
      ...newTask
    }]);
    setNewTask({ name: '', duration: '', priority: 'Medium' });
    setShowAddForm(false);
  };

  // Click a cell to schedule a task
  const handleCellClick = (day, time) => {
    setCellToSchedule({ day, time });
    setSelectedTaskId(unscheduledTasks.length > 0 ? unscheduledTasks[0].id : '');
  };

  // Confirm scheduling
  const handleSchedule = (e) => {
    e.preventDefault();
    const task = unscheduledTasks.find(t => t.id === Number(selectedTaskId) || t.id === selectedTaskId);
    if (!task) return;
    setScheduledTasks([
      ...scheduledTasks,
      {
        id: task.id,
        name: task.name,
        day: cellToSchedule.day,
        start: cellToSchedule.time,
        end: getEndTime(cellToSchedule.time, task.duration),
        color: priorityColors[task.priority],
        priority: task.priority,
        type: task.type,
        assignmentId: task.assignmentId,
        subject: task.subject,
        due: task.due,
        autoScheduled: false
      }
    ]);
    setUnscheduledTasks(unscheduledTasks.filter(t => t.id !== task.id));
    setCellToSchedule(null);
    setSelectedTaskId('');
  };

  // Unschedule a task (move back to unscheduled)
  const handleUnschedule = (taskId) => {
    const task = scheduledTasks.find(t => t.id === taskId);
    if (!task) return;
    setUnscheduledTasks([...unscheduledTasks, {
      id: task.id,
      name: task.name,
      duration: getDuration(task.start, task.end),
      priority: task.priority,
      type: task.type,
      assignmentId: task.assignmentId,
      subject: task.subject,
      due: task.due
    }]);
    setScheduledTasks(scheduledTasks.filter(t => t.id !== taskId));
  };

  return (
    <div id="main-content" style={{ minHeight: '100vh' }}>
      {/* Add Task Modal */}
      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <form onSubmit={handleAddTask} style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 24px rgba(44,62,80,0.15)' }}>
            <h2 style={{ marginBottom: 18 }}>{t('addNewTask')}</h2>
            <input placeholder={t('taskName')} value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required />
            <input placeholder={t('durationExample')} value={newTask.duration} onChange={e => setNewTask({ ...newTask, duration: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required />
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} style={{ width: '100%', marginBottom: 18, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
              <option value="High">{t('highPriority')}</option>
              <option value="Medium">{t('mediumPriority')}</option>
              <option value="Low">{t('lowPriority')}</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setShowAddForm(false)} style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>{t('cancel')}</button>
              <button type="submit" style={{ background: '#6a11cb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>{t('add')}</button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Task Modal */}
      {cellToSchedule && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <form onSubmit={handleSchedule} style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 24px rgba(44,62,80,0.15)' }}>
            <h2 style={{ marginBottom: 18 }}>{t('scheduleTask')}</h2>
            <select value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)} style={{ width: '100%', marginBottom: 18, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
              {unscheduledTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.name} ({task.duration})
                  {task.type === 'assignment' && ` - Due: ${task.due}`}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setCellToSchedule(null)} style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>{t('cancel')}</button>
              <button type="submit" style={{ background: '#6a11cb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>{t('schedule')}</button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: 'flex', padding: '2vw', gap: '2vw', width: '100%', boxSizing: 'border-box' }}>
        {/* Unscheduled Tasks Sidebar */}
        <div className="calendar-sidebar">
          <div className="page-title" style={{marginBottom: 18}}>{t('unscheduledTasks')}</div>
          {assignmentsLoading && <div className="card-empty">Loading assignments...</div>}
          {!assignmentsLoading && unscheduledTasks.length === 0 && <div className="card-empty">{t('noUnscheduledTasks')}</div>}
          {unscheduledTasks.map((task, i) => (
            <div key={task.id} className="unscheduled-task-card" style={{ 
              borderLeftColor: task.priority === 'High' ? '#e57373' : task.priority === 'Medium' ? '#ffb74d' : '#81c784',
              borderLeftWidth: task.type === 'assignment' ? '4px' : '2px',
              background: task.type === 'assignment' ? '#f8f9ff' : '#fff',
              border: task.type === 'assignment' ? '1px solid #e3e0ff' : '1px solid #eee'
            }}>
              <div className="unscheduled-task-title">
                {task.name}
                {task.type === 'assignment' && (
                  <span style={{ fontSize: '0.8rem', color: '#6a11cb', marginLeft: 8 }}>
                    📚 {task.subject}
                  </span>
                )}
              </div>
              <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}>{task.duration}</div>
              {task.type === 'assignment' && task.due && (
                <div style={{ color: '#ff9800', fontSize: '0.9rem', marginBottom: 4 }}>
                  📅 Due: {task.due}
                </div>
              )}
              <span className={
                task.priority === 'High' ? 'unscheduled-task-priority-high' :
                task.priority === 'Medium' ? 'unscheduled-task-priority-medium' :
                'unscheduled-task-priority-low'
              }>
                {t(task.priority.toLowerCase() + 'Priority')}
                {task.type === 'assignment' && ' (Assignment)'}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(44,62,80,0.07)', padding: 24, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
          {/* Week Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="section-title">{t('weekRange')}</span>
              <button style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '4px 14px', fontWeight: 'bold', color: '#6a11cb', cursor: 'pointer' }}>{t('today')}</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '4px 14px', fontWeight: 'bold', color: '#6a11cb', cursor: 'pointer' }}>{t('week')}</button>
              <button style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '4px 14px', fontWeight: 'bold', color: '#6a11cb', cursor: 'pointer' }}>{t('month')}</button>
              <button style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '4px 14px', fontWeight: 'bold', color: '#6a11cb', cursor: 'pointer' }}>{t('timeBlocked')}</button>
              <button style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '4px 14px', fontWeight: 'bold', color: '#6a11cb', cursor: 'pointer' }}>{t('flexible')}</button>
            </div>
          </div>

          {/* Calendar Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: 80 }}></th>
                  {days.map((day, i) => (
                    <th key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#6a11cb', fontSize: 15, padding: 6 }}>{t(day)}<br /><span style={{ color: '#888', fontWeight: 'normal' }}>{dates[i]}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time, rowIdx) => (
                  <tr key={time}>
                    <td style={{ textAlign: 'right', color: '#888', fontSize: 14, padding: 6 }}>{time}</td>
                    {days.map((day, colIdx) => {
                      // Find a task scheduled for this cell
                      const task = scheduledTasks.find(t => t.day === colIdx && t.start === time);
                      if (task) {
                        return (
                          <td key={colIdx} rowSpan={getRowSpan(task)} style={{ 
                            background: task.color, 
                            borderRadius: 8, 
                            textAlign: 'center', 
                            fontWeight: 'bold', 
                            color: '#333', 
                            fontSize: 14, 
                            position: 'relative', 
                            minWidth: 80, 
                            border: task.type === 'assignment' ? '2px solid #6a11cb' : '1px solid #fff',
                            cursor: 'pointer',
                            boxShadow: task.autoScheduled ? '0 2px 8px rgba(106,17,203,0.3)' : 'none'
                          }} onDoubleClick={() => handleUnschedule(task.id)}>
                            {task.name}
                            {task.type === 'assignment' && (
                              <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: 2 }}>
                                📚 {task.subject}
                              </div>
                            )}
                            <br />
                            <span style={{ fontWeight: 'normal', fontSize: 12 }}>{task.start} AM - {task.end} PM</span>
                            {task.type === 'assignment' && task.due && (
                              <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: 2 }}>
                                📅 Due: {task.due}
                              </div>
                            )}
                            {task.autoScheduled && (
                              <div style={{ fontSize: '0.7rem', color: '#fff', marginTop: 2, background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4 }}>
                                🤖 Auto-scheduled
                              </div>
                            )}
                            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>[Double-click to unschedule]</div>
                          </td>
                        );
                      }
                      // If this cell is covered by a rowSpan, skip rendering
                      if (isCellCovered(scheduledTasks, colIdx, time, rowIdx)) {
                        return null;
                      }
                      return <td key={colIdx} style={{ border: '1px solid #f0f0f0', minWidth: 80, height: 40, cursor: unscheduledTasks.length > 0 ? 'pointer' : 'default', background: '#fafbfc' }} onClick={() => unscheduledTasks.length > 0 && handleCellClick(colIdx, time)}></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to determine rowSpan for a task
function getRowSpan(task) {
  const startHour = parseInt(task.start);
  const endHour = parseInt(task.end);
  return endHour - startHour || 1;
}

// Helper to check if a cell is covered by a rowSpan
function isCellCovered(tasks, dayIdx, time, rowIdx) {
  for (const t of tasks) {
    if (t.day === dayIdx) {
      const startIdx = times.indexOf(t.start);
      const endIdx = times.indexOf(t.end);
      if (rowIdx > startIdx && rowIdx < endIdx) {
        return true;
      }
    }
  }
  return false;
}

// Helper to get end time from start and duration
function getEndTime(start, duration) {
  let [h, m] = start.split(':').map(Number);
  let dur = duration.toLowerCase();
  let addH = 0, addM = 0;
  if (dur.includes('hour')) addH = parseInt(dur);
  if (dur.includes('minute')) addM = parseInt(dur);
  m += addM;
  h += addH + Math.floor(m / 60);
  m = m % 60;
  return `${h}:${m === 0 ? '00' : m}`;
}

// Helper to get duration string from start and end
function getDuration(start, end) {
  let [h1, m1] = start.split(':').map(Number);
  let [h2, m2] = end.split(':').map(Number);
  let mins = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (mins >= 60) return `${Math.floor(mins / 60)} hour${Math.floor(mins / 60) > 1 ? 's' : ''}`;
  return `${mins} minutes`;
}

export default Calendar;