import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const DEFAULT_WORK_MIN = 25;
const DEFAULT_BREAK_MIN = 5;
const DEFAULT_LONG_BREAK_MIN = 15;
const CYCLES = 4;

function playSound() {
  const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3');
  audio.play().catch(e => console.log('Audio play failed:', e));
}

export default function FocusMode() {
  const { t } = useSettings();
  const [minutes, setMinutes] = useState(DEFAULT_WORK_MIN);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [onBreak, setOnBreak] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [customDuration, setCustomDuration] = useState(DEFAULT_WORK_MIN);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const timerRef = useRef();

  const totalSeconds = minutes * 60 + seconds;
  const initialSeconds = (onBreak
    ? (cycle === CYCLES ? DEFAULT_LONG_BREAK_MIN : DEFAULT_BREAK_MIN)
    : customDuration) * 60;
  const progress = ((initialSeconds - totalSeconds) / initialSeconds) * 100;

  // --- Persistence logic with endTime ---
  useEffect(() => {
    // On mount, restore timer state if present
    const saved = JSON.parse(localStorage.getItem('pomodoroStateV2'));
    if (saved) {
      setCycle(saved.cycle);
      setOnBreak(saved.onBreak);
      setCompleted(saved.completed);
      setCustomDuration(saved.customDuration);
      // Always recalculate remaining time from endTime
      if (saved.endTime && saved.isRunning) {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((saved.endTime - now) / 1000));
        setMinutes(Math.floor(diff / 60));
        setSeconds(diff % 60);
        if (diff > 0) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
          // Move to next state if time is up
          if (!saved.onBreak) {
            setOnBreak(true);
            setMinutes(saved.cycle === CYCLES ? DEFAULT_LONG_BREAK_MIN : DEFAULT_BREAK_MIN);
            setSeconds(0);
          } else {
            setOnBreak(false);
            setMinutes(saved.customDuration);
            setSeconds(0);
            setCycle(saved.cycle < CYCLES ? saved.cycle + 1 : 1);
            setCompleted(saved.completed + 1);
          }
        }
      } else {
        setMinutes(saved.minutes);
        setSeconds(saved.seconds);
        setIsRunning(false);
      }
    }
  }, []);

  useEffect(() => {
    // Save timer state and endTime on every change
    let endTime = null;
    if (isRunning) {
      endTime = Date.now() + (minutes * 60 + seconds) * 1000;
    } else {
      const saved = JSON.parse(localStorage.getItem('pomodoroStateV2'));
      if (saved && saved.endTime && (minutes !== 0 || seconds !== 0)) {
        endTime = saved.endTime;
      }
    }
    localStorage.setItem('pomodoroStateV2', JSON.stringify({
      minutes, seconds, isRunning, cycle, onBreak, completed, customDuration, endTime
    }));
  }, [minutes, seconds, isRunning, cycle, onBreak, completed, customDuration]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s === 0) {
            if (minutes === 0) {
              clearInterval(timerRef.current);
              playSound();
              if (!onBreak) {
                if (cycle < CYCLES) {
                  setOnBreak(true);
                  setMinutes(DEFAULT_BREAK_MIN);
                  setSeconds(0);
                } else {
                  setOnBreak(true);
                  setMinutes(DEFAULT_LONG_BREAK_MIN);
                  setSeconds(0);
                }
              } else {
                setOnBreak(false);
                setMinutes(customDuration);
                setSeconds(0);
                setCycle(c => (c < CYCLES ? c + 1 : 1));
                setCompleted(c => c + 1);
              }
              // Enhanced notification
              const message = onBreak ? 'Break over! Time to focus.' : 'Session complete! Take a break.';
              if (Notification.permission === 'granted') {
                new Notification('StudyFlow Focus Mode', { body: message, icon: '/favicon.ico' });
              } else {
                window.alert(message);
              }
              return 0;
            }
            setMinutes(m => m - 1);
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, minutes, onBreak, cycle, customDuration]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setMinutes(customDuration);
    setSeconds(0);
    setCycle(1);
    setOnBreak(false);
    setCompleted(0);
  };

  const handleCustomDuration = (duration) => {
    setCustomDuration(duration);
    setMinutes(duration);
    setSeconds(0);
    setIsRunning(false);
    setCycle(1);
    setOnBreak(false);
    setCompleted(0);
    // Save new endTime for the new duration
    const newEndTime = Date.now() + duration * 60 * 1000;
    const saved = JSON.parse(localStorage.getItem('pomodoroStateV2')) || {};
    localStorage.setItem('pomodoroStateV2', JSON.stringify({
      ...saved,
      minutes: duration,
      seconds: 0,
      isRunning: false,
      cycle: 1,
      onBreak: false,
      completed: 0,
      customDuration: duration,
      endTime: newEndTime
    }));
  };

  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // --- Dynamic Break Button ---
  const handleStartBreak = () => {
    setIsRunning(false);
    setOnBreak(true);
    setMinutes(DEFAULT_BREAK_MIN);
    setSeconds(0);
    // Save break end time
    const breakEnd = Date.now() + DEFAULT_BREAK_MIN * 60 * 1000;
    const saved = JSON.parse(localStorage.getItem('pomodoroStateV2')) || {};
    localStorage.setItem('pomodoroStateV2', JSON.stringify({
      ...saved,
      isRunning: true,
      onBreak: true,
      minutes: DEFAULT_BREAK_MIN,
      seconds: 0,
      endTime: breakEnd
    }));
    setIsRunning(true);
  };

  return (
    <div id="main-content" className="card focus-card" style={{ maxWidth: 600, margin: '40px auto', borderRadius: 24, padding: 40, textAlign: 'center', boxShadow: '0 8px 32px #6a11cb22', background: 'linear-gradient(135deg, #f3eaff 0%, #e3e0ff 100%)' }}>
      <h2 className="page-title" style={{ marginBottom: 30, fontSize: 28, fontWeight: 'bold', color: '#6a11cb' }}>{t('focusMode')}</h2>
      <div className="count-badge" style={{ display: 'inline-block', background: 'linear-gradient(90deg, #6a11cb 0%, #43e97b 100%)', color: '#fff', borderRadius: 16, padding: '6px 22px', fontWeight: 'bold', fontSize: 18, marginBottom: 18, boxShadow: '0 2px 8px #b3b8d1' }}>
        {t('session')} {cycle}
      </div>
      <div className="focus-section-title" style={{ color: '#2575fc', fontWeight: 'bold', fontSize: 18, margin: '18px 0 8px 0' }}>{t('quickDuration')}</div>
      <div style={{ marginBottom: 24 }}>
        {[25, 30, 45, 60, 90, 120].map((min) => (
          <button
            key={min}
            className={`quick-btn${customDuration === min ? ' selected' : ''}`}
            onClick={() => handleCustomDuration(min)}
            style={{ opacity: 1, marginRight: 8, marginBottom: 8 }}
          >
            {min}{t('min')}
          </button>
        ))}
      </div>
      {/* Timer Display */}
      <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="80" stroke="#e3e0ff" strokeWidth="8" fill="none" />
          <circle cx="100" cy="100" r="80" stroke="#6a11cb" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 80}`} strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
        </svg>
        <div style={{ position: 'absolute', fontSize: 36, fontWeight: 'bold', color: '#6a11cb' }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 25 }}>
        <button className="main-btn" onClick={handleStart} disabled={isRunning} style={{ cursor: isRunning ? 'not-allowed' : 'pointer' }}>{t('start')}</button>
        <button className="main-btn-secondary" onClick={handlePause} disabled={!isRunning} style={{ cursor: !isRunning ? 'not-allowed' : 'pointer' }}>{t('pause')}</button>
        <button className="main-btn-danger" onClick={handleReset}>{t('reset')}</button>
        <button className="main-btn" onClick={handleStartBreak} style={{ background: '#43e97b', color: '#fff' }}>{t('break')}</button>
      </div>
      <div className="count-badge" style={{ display: 'inline-block', background: 'linear-gradient(90deg, #43e97b 0%, #6a11cb 100%)', color: '#fff', borderRadius: 16, padding: '6px 22px', fontWeight: 'bold', fontSize: 16, marginBottom: 18, marginTop: 8, boxShadow: '0 2px 8px #b3b8d1' }}>
        {t('completedSessions')}: {completed}
      </div>
      {/* Notification Permission */}
      <div style={{ margin: '18px 0' }}>
        <button onClick={requestNotificationPermission} className="main-btn-secondary" style={{ fontSize: 14, padding: '8px 18px' }}>{t('enableNotifications')}</button>
      </div>
      <div className="focus-section-title" style={{ color: '#2575fc', fontWeight: 'bold', fontSize: 18, margin: '18px 0 8px 0' }}>{t('howPomodoroWorks')}</div>
      <div style={{ background: '#f3eaff', borderRadius: 15, padding: 20, fontSize: 15, textAlign: 'left', color: '#23283a', boxShadow: '0 2px 8px #e3e0ff' }}>
        <b>1.</b> {t('workForDuration')}<br />
        <b>2.</b> {t('takeShortBreak')}<br />
        <b>3.</b> {t('afterSessionsLongBreak')}<br />
        <b>4.</b> {t('repeatStayFocused')}
      </div>
    </div>
  );
} 