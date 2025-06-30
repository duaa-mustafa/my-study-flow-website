import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AssignmentsContext = createContext();

export function useAssignments() {
  return useContext(AssignmentsContext);
}

const DEFAULT_ASSIGNMENTS = [
  { title: 'Database Assignment', subject: 'Database', due: '2025-06-28', priority: 'High', status: 'Incomplete' },
  { title: 'Software Engineering Project', subject: 'Software Engineering', due: '2025-06-30', priority: 'Medium', status: 'Incomplete' },
  { title: 'Statistics Quiz', subject: 'Statistics', due: '2025-07-01', priority: 'Low', status: 'Complete' },
  { title: 'Operating Systems Homework', subject: 'Operating Systems', due: '2025-07-03', priority: 'High', status: 'Incomplete' },
  { title: 'Networks Lab', subject: 'Networks', due: '2025-07-05', priority: 'Medium', status: 'Incomplete' },
  { title: 'AI Project Proposal', subject: 'Artificial Intelligence', due: '2025-07-10', priority: 'High', status: 'Incomplete' },
  { title: 'Math Midterm', subject: 'Mathematics', due: '2025-07-12', priority: 'High', status: 'Incomplete' },
  { title: 'English Essay', subject: 'English', due: '2025-07-15', priority: 'Low', status: 'Incomplete' },
  { title: 'Database Presentation', subject: 'Database', due: '2025-07-18', priority: 'Medium', status: 'Incomplete' },
  { title: 'Software Engineering Final', subject: 'Software Engineering', due: '2025-07-20', priority: 'High', status: 'Incomplete' },
];

export function AssignmentsProvider({ children }) {
  const token = localStorage.getItem('token');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignments = useCallback(() => {
    setLoading(true);
    fetch('http://localhost:5000/assignments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setAssignments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setAssignments([]);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (token) fetchAssignments();
  }, [token, fetchAssignments]);

  const addAssignment = async (assignment) => {
    setError('');
    try {
      const res = await fetch('http://localhost:5000/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(assignment),
      });
      if (!res.ok) throw new Error('Add failed');
      const added = await res.json();
      setAssignments(prev => [...prev, added]);
      return added;
    } catch {
      setError('Failed to add assignment.');
      return null;
    }
  };

  const updateAssignment = async (id, updatedFields) => {
    setError('');
    try {
      const assignment = assignments.find(a => a.id === id);
      if (!assignment) return null;
      const updatedAssignment = { ...assignment, ...updatedFields };
      const res = await fetch(`http://localhost:5000/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedAssignment),
      });
      if (!res.ok) throw new Error('Update failed');
      const serverAssignment = await res.json();
      setAssignments(prev => prev.map(a => a.id === id ? serverAssignment : a));
      return serverAssignment;
    } catch {
      setError('Failed to update assignment.');
      return null;
    }
  };

  const deleteAssignment = async (id) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/assignments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setAssignments(prev => prev.filter(a => a.id !== id));
      return true;
    } catch {
      setError('Failed to delete assignment.');
      return false;
    }
  };

  return (
    <AssignmentsContext.Provider value={{ assignments, loading, error, fetchAssignments, addAssignment, updateAssignment, deleteAssignment }}>
      {children}
    </AssignmentsContext.Provider>
  );
} 