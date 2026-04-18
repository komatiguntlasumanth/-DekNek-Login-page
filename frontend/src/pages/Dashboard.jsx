import React, { useEffect, useState } from 'react';
import { getStudents, deleteStudent, createStudent } from '../api';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Plus, LogOut, Search, MoreVertical, 
  GraduationCap, BookOpen, CheckCircle, Clock 
} from 'lucide-react';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: '', lastName: '', email: '', course: '', grade: 'A', status: 'active'
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchStudents();
  }, [token, navigate]);

  const fetchStudents = async () => {
    try {
      const data = await getStudents(token);
      setStudents(data);
    } catch (err) {
      console.error(err);
      if (err.message.includes('401') || err.message.includes('token')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this student transcript?')) {
      try {
        await deleteStudent(token, id);
        setStudents(students.filter(s => s.id !== id));
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const added = await createStudent(token, newStudent);
      setStudents([...students, added]);
      setShowAddModal(false);
      setNewStudent({ firstName: '', lastName: '', email: '', course: '', grade: 'A', status: 'active' });
    } catch (err) {
      alert('Failed to add student');
    }
  };

  const stats = [
    { label: 'Total Students', value: students?.length || 0, icon: <Users size={20}/>, color: '#7C3AED' },
    { label: 'Active Courses', value: new Set(students?.map(s => s.course) || []).size, icon: <BookOpen size={20}/>, color: '#4F46E5' },
    { label: 'Graduated', value: (students?.filter(s => s.status === 'graduated') || []).length, icon: <CheckCircle size={20}/>, color: '#10B981' },
    { label: 'Pending', value: (students?.filter(s => s.status === 'on-leave') || []).length, icon: <Clock size={20}/>, color: '#F59E0B' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }} className="animate-fade-in">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Your Student Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {username} | Accessing your private dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={20} /> Enroll Student
          </button>
          <button className="btn" onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card animate-fade-in" style={{ padding: '24px', animationDelay: `${i * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: `${stat.color}22`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <h3 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '4px' }}>{stat.value}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="glass-card animate-fade-in" style={{ padding: '32px', animationDelay: '0.4s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Enrollments</h2>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input className="input-control" placeholder="Search students..." style={{ paddingLeft: '40px', width: '300px' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Student</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Course</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Grade</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Loading students...</td></tr>
              ) : students.map((student) => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--surface-border)', transition: 'background 0.3s' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: '500' }}>{student.firstName} {student.lastName}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{student.course}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                      background: student.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: student.status === 'active' ? '#10B981' : '#F59E0B'
                    }}>
                      {student.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600', color: 'var(--primary)' }}>{student.grade}</td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => handleDelete(student.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '4px' }}>
                      Delete
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '500px', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>Enroll New Student</h2>
            <form onSubmit={handleAddStudent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="input-group">
                  <label>First Name</label>
                  <input className="input-control" value={newStudent.firstName} onChange={e => setNewStudent({...newStudent, firstName: e.target.value})} required/>
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input className="input-control" value={newStudent.lastName} onChange={e => setNewStudent({...newStudent, lastName: e.target.value})} required/>
                </div>
              </div>
              <div className="input-group">
                <label>Email</label>
                <input className="input-control" type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} required/>
              </div>
              <div className="input-group">
                <label>Course</label>
                <input className="input-control" value={newStudent.course} onChange={e => setNewStudent({...newStudent, course: e.target.value})} required/>
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button type="button" className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
