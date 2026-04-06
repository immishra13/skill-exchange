import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Rocket, Zap } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Zap size={24} fill="var(--primary)" />
          </div>
          <span>Skill<span>Swap</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/explore" className="nav-link">Explore</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="nav-user">
                <Link to="/profile" className="nav-profile">
                  <div className="avatar-sm">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName} />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span>{currentUser.displayName || 'User'}</span>
                </Link>
                <button onClick={handleLogout} className="btn-icon-sm" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">
              <Rocket size={16} />
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu glass animate-fadeIn">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/explore" onClick={() => setIsMenuOpen(false)}>Explore</Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <Link to="/auth" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
