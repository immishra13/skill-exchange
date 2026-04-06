import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Repeat, 
  User, 
  LogOut, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout, currentUser } = useAuth();

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'My Skills', icon: <BookOpen size={20} />, path: '/dashboard/my-skills' },
    { name: 'Explore', icon: <Search size={20} />, path: '/dashboard/explore' },
    { name: 'Requests', icon: <Repeat size={20} />, path: '/dashboard/requests' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  return (
    <aside className={`sidebar glass ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Zap size={24} fill="var(--primary)" />
          {isOpen && <span>Skill<span>Swap</span></span>}
        </div>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/dashboard'}
          >
            <div className="icon-wrapper">{item.icon}</div>
            {isOpen && <span>{item.name}</span>}
            {!isOpen && <div className="tooltip">{item.name}</div>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar-md">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="User" />
            ) : (
              <User size={20} />
            )}
          </div>
          {isOpen && (
            <div className="user-details">
              <p className="user-name">{currentUser?.displayName || 'User'}</p>
              <p className="user-email">{currentUser?.email}</p>
            </div>
          )}
        </div>
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
          {!isOpen && <div className="tooltip">Logout</div>}
        </button>
      </div>
    </aside>
  );
}
