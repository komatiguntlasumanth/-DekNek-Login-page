import React, { useEffect, useState } from 'react';
import { getStudents, deleteStudent, createStudent } from '../api';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, LogOut, Search, Award, 
  Clock, Calendar, BookMarked, Target, Rocket
} from 'lucide-react';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'Student';

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCourses();
  }, [token, navigate]);

  const fetchCourses = async () => {
    try {
      const data = await getStudents(token);
      // We treat the 'students' array from the backend as the courses this student is taking
      setCourses(data);
    } catch (err) {
      console.error(err);
      if (err.message.includes('401') || err.message.includes('token') || err.message.includes('Failed to fetch')) {
        // If unauthorized, token is bad
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDropCourse = async (id) => {
    if (window.confirm('Are you sure you want to drop this course?')) {
      try {
        await deleteStudent(token, id);
        setCourses(courses.filter(c => c.id !== id));
      } catch (err) {
        alert('Failed to drop course');
      }
    }
  };

  const handleRegisterCourse = async (e) => {
    e.preventDefault();
    try {
      // Auto-fill the backend requirements so the user only has to type the Course Name
      const payload = {
        firstName: username,
        lastName: 'Profile',
        email: `${username.toLowerCase().replace(/\s/g, '')}@university.edu`,
        course: newCourse,
        grade: 'In Progress',
        status: 'active'
      };
      
      const added = await createStudent(token, payload);
      setCourses([...courses, added]);
      setShowAddModal(false);
      setNewCourse('');
    } catch (err) {
      alert('Failed to register for course');
    }
  };

  // Calculate mock GPA
  const calculateGPA = () => {
    if (!courses.length) return '0.0';
    let total = 0;
    courses.forEach(c => {
      if (c.grade === 'A') total += 4.0;
      else if (c.grade === 'B') total += 3.0;
      else if (c.grade === 'C') total += 2.0;
      else total += 3.5; // default for 'In Progress' or other
    });
    return (total / courses.length).toFixed(1);
  };

  const stats = [
    { label: 'Current Exact GPA', value: calculateGPA(), icon: <Award size={20}/>, color: '#3B82F6' },
    { label: 'Enrolled Courses', value: courses.length, icon: <BookOpen size={20}/>, color: '#8B5CF6' },
    { label: 'Credits Earned', value: courses.length * 3, icon: <Target size={20}/>, color: '#10B981' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'linear-gradient(135deg, var(--primary), #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <GraduationCap size={32} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.1em', marginBottom: '4px' }}>ALPHA PORTAL</p>
            <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>{username}'s Dashboard</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', border: 'none' }}>
            <BookMarked size={20} /> Register Course
          </button>
          <button className="btn" onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card animate-fade-in" style={{ padding: '24px', animationDelay: `${i * 0.1}s`, borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px', color: 'var(--text)' }}>{stat.value}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="glass-card animate-fade-in" style={{ padding: '32px', animationDelay: '0.4s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>My Transcript & Schedule</h2>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input className="input-control" placeholder="Search courses..." style={{ paddingLeft: '40px', width: '250px', background: 'var(--background)' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-border)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Course Name</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Semester</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Grade</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading your schedule...</td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>You are not registered for any courses yet.</td></tr>
              ) : courses.map((course) => (
                <tr key={course.id} style={{ borderBottom: '1px solid var(--surface-border)', transition: 'background 0.2s' }} className="hover:bg-surface-border">
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '1rem' }}>{course.course}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CRN-{String(course.id).padStart(5, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Fall 2026</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                      background: course.status === 'active' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: course.status === 'active' ? '#3B82F6' : '#10B981'
                    }}>
                      {course.status === 'active' ? 'ENROLLED' : course.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '800', color: course.grade === 'In Progress' ? 'var(--text-secondary)' : 'var(--primary)', fontSize: '1.1rem' }}>
                    {course.grade}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => handleDropCourse(course.id)} className="btn" style={{ background: 'transparent', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', fontSize: '0.875rem' }}>
                      Drop
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} className="animate-fade-in">
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '32px', transform: 'translateY(0)', transition: 'transform 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: '#3B82F6' }}>
                <BookMarked size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Course Registration</h2>
            </div>
            
            <form onSubmit={handleRegisterCourse}>
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Search Course Catalog</label>
                <input 
                  className="input-control" 
                  value={newCourse} 
                  onChange={e => setNewCourse(e.target.value)} 
                  placeholder="e.g., Intro to Machine Learning (CS401)"
                  required
                  style={{ background: 'var(--background)' }}
                  autoFocus
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  This will register you for the selected course for the current semester.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button type="button" className="btn" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: '1px solid var(--surface-border)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', border: 'none' }}>Confirm Enrollment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
