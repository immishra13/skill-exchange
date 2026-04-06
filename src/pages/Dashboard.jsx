import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MySkills from './DashboardViews/MySkills';
import ExploreSkills from './DashboardViews/ExploreSkills';
import Requests from './DashboardViews/Requests';
import Stats from './DashboardViews/Stats';
import { Search, Bell, User } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="dashboard-main">
        <header className="dashboard-header glass">
          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Search for skills, users..." />
          </div>
          
          <div className="header-actions">
            <button className="btn-icon">
              <Bell size={20} />
              <div className="badge-dot"></div>
            </button>
            <div className="header-user">
              <div className="avatar-sm">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>
        
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Stats />} />
            <Route path="/my-skills" element={<MySkills />} />
            <Route path="/explore" element={<ExploreSkills />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
