import React, { useState } from 'react';
import { login, signup } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Lock, ArrowRight, Eye, EyeOff, Mail, 
  GraduationCap, Book, Pencil, School, Globe,
  Brain, Lightbulb, Trophy, PenTool, Rocket
} from 'lucide-react';

const Auth = ({ mode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Clear error when switching between login/signup
  React.useEffect(() => {
    setError('');
  }, [mode]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 50;
    const y = (clientY / window.innerHeight - 0.5) * 50;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const authData = mode === 'login' 
        ? await login(email, password) 
        : await signup(username, email, password);
      
      localStorage.setItem('token', authData.token);
      localStorage.setItem('username', authData.username);
      localStorage.setItem('role', authData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="auth-container bg-animated animate-fade-in" 
      onMouseMove={handleMouseMove}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Layer 1: Luxury Aurora Mesh Gradient */}
      <div className="mesh-blob"></div>

      {/* Layer 2: Main AI Global Network Image (Parallax) */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '120%',
        height: '120%',
        backgroundImage: 'url("/assets/bg-premium.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        pointerEvents: 'none',
        transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
        transition: 'transform 0.8s ease-out'
      }}></div>

      {/* Layer 3: Education Themed Parallax Icons */}
      {[
        { Icon: GraduationCap, size: 130, speed: 0.5 },
        { Icon: Book, size: 90, speed: 0.3 },
        { Icon: Lightbulb, size: 70, speed: 0.6 },
        { Icon: Trophy, size: 100, speed: 0.4 },
        { Icon: School, size: 80, speed: 0.2 },
        { Icon: Brain, size: 110, speed: 0.7 }
      ].map((item, i) => {
        const colors = ['#EF4444', '#3B82F6', '#6366F1', '#EC4899'];
        const randomColor = colors[i % colors.length];
        return (
          <div 
            key={i} 
            style={{
              position: 'absolute',
              left: `${(i * 15 + 10) % 90}%`,
              top: `${(i * 20 + 5) % 90}%`,
              color: randomColor,
              opacity: 0.2,
              transform: `translate(${mousePos.x * item.speed}px, ${mousePos.y * item.speed}px)`,
              transition: 'transform 0.4s ease-out',
              pointerEvents: 'none',
              filter: `drop-shadow(0 0 15px ${randomColor})`
            }}
          >
            <item.Icon size={item.size} strokeWidth={1} />
          </div>
        );
      })}

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ 
              padding: '12px', 
              background: 'linear-gradient(135deg, var(--primary), #8B5CF6)', 
              borderRadius: '12px', 
              color: 'white',
              boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.5)'
            }}>
              <GraduationCap size={28} />
            </div>
            <span style={{ 
              fontSize: '1.75rem', 
              fontWeight: '900', 
              letterSpacing: '-0.04em', 
              color: 'var(--text-primary)',
              background: 'linear-gradient(to right, var(--text-primary), var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>ALPHA PORTAL</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px', color: 'var(--primary)' }}>
            {mode === 'login' ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'Enter your details to access your dashboard' : 'Create an account to manage your students'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: 'var(--error)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mode === 'signup' && (
            <div className="input-group">
              <label><User size={14} style={{ marginRight: '8px' }}/> Username</label>
              <input 
                className="input-control" 
                type="text" 
                placeholder="display_name" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="input-group">
            <label><Mail size={14} style={{ marginRight: '8px' }}/> Email Address</label>
            <input 
              className="input-control" 
              type="email" 
              placeholder="name@university.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label><Lock size={14} style={{ marginRight: '8px' }}/> Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="input-control" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '45px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: '52px' }}>
            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? (
            <p>Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link></p>
          ) : (
            <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
