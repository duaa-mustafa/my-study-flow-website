import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import './registration.css';

const SIDEBAR_WIDTH = 180;

const topNavItems = [
  { label: 'Dashboard', route: '/dashboard' },
  { label: 'Assignments', route: '/assignments' },
  { label: 'Import from Moodle', route: '/import' },
  { label: 'Analytics/Grade', route: '/analytics' },
  { label: 'Rewards and Streak', route: '/rewards' },
  { label: 'Focus Mode', route: '/focus' },
];

export default function Layout() {
  const location = useLocation();
  const theme = localStorage.getItem('theme') || 'light';
  let applied = theme;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applied = prefersDark ? 'dark' : 'light';
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarIcons = [
    { icon: '📚', label: 'Subjects', route: '/subjects' },
    { icon: '📅', label: 'Calendar', route: '/calendar' },
    { icon: '📈', label: 'Progress', route: '/progress' },
    { icon: '⏰', label: 'Set Availability', route: '/set-availability' },
    { icon: '🎯', label: 'Focus Mode', route: '/focus' },
    { icon: '❓', label: 'Help', route: '/help' },
  ];
  return (
    <div className={`theme-${applied}`} style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 180 : 60, background: '#2d2f4a', color: '#fff', display: 'flex', flexDirection: 'column', padding: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, transition: 'width 0.2s' }}>
        {sidebarOpen ? (
          <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', marginRight: 8 }}>
                ←
              </button>
              <h2 style={{ fontWeight: 'bold', letterSpacing: 1, fontSize: 22, margin: 0 }}>StudyFlow</h2>
            </div>
            <nav style={{ flex: 1 }}>
              {sidebarIcons.map((item) => (
                <NavLink
                  key={item.route}
                  to={item.route}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0 10px 12px',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? '#6a11cb' : '#fff',
                    background: isActive ? 'rgba(106,17,203,0.08)' : 'none',
                    borderRadius: 8,
                    marginBottom: 4,
                    textDecoration: 'none',
                    fontSize: 18,
                    transition: 'background 0.2s',
                  })}
                >
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center' }}>
              <img src={require('./logo.svg').default} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 10, background: '#fff' }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 14 }}>User</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>Student</div>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', margin: 20 }}>
            ☰
          </button>
        )}
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 180 : 60 }}>
        {/* Top Navigation Bar */}
        <div style={{
          background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
          color: '#fff',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          boxShadow: '0 2px 8px #e3e0ff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          marginLeft: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {topNavItems.map(item => (
              <Link
                key={item.route}
                to={item.route}
                style={{
                  color: location.pathname === item.route ? '#fff' : '#f3eaff',
                  fontWeight: location.pathname === item.route ? 'bold' : 'normal',
                  textDecoration: 'none',
                  fontSize: 16,
                  borderBottom: location.pathname === item.route ? '2px solid #fff' : 'none',
                  padding: '8px 0',
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/notifications" style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textDecoration: 'none', marginRight: 10 }}>🔔</Link>
            <Link to="/settings" style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textDecoration: 'none', marginRight: 10 }}>⚙️</Link>
            <img src={require('./logo.svg').default} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', background: '#f7f8fa' }} />
          </div>
        </div>
        {/* Main Content */}
        <div style={{ flex: 1, padding: 32, minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
} 