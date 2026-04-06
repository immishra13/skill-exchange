import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  Users, 
  Repeat, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Calendar,
  Star
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function Stats() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    skillsOffered: 0,
    requestsSent: 0,
    requestsReceived: 0,
    completedSwaps: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!currentUser) return;
      try {
        // Mocking stats for now since we don't have data
        // In a real app, we'd query Firestore counts
        setStats({
          skillsOffered: 3,
          requestsSent: 5,
          requestsReceived: 8,
          completedSwaps: 12
        });

        // Mocking recent activity
        setRecentActivity([
          { id: 1, type: 'request', title: 'New request for Web Design', user: 'Sarah Miller', time: '2 hours ago', status: 'pending' },
          { id: 2, type: 'match', title: 'Python matching with React', user: 'Alex Chen', time: '5 hours ago', status: 'accepted' },
          { id: 3, type: 'complete', title: 'Completed Yoga for Spanish exchange', user: 'Maria Garcia', time: '1 day ago', status: 'completed' },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    }

    fetchStats();
  }, [currentUser]);

  if (loading) return (
    <div className="loading-center">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="stats-view animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Learner'}! 👋</h1>
          <p>Here's what's happening with your skill exchanges today.</p>
        </div>
        <div className="header-date glass">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon bg-purple">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <h3>Skills Offered</h3>
            <p>{stats.skillsOffered}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon bg-blue">
            <Repeat size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Requests</h3>
            <p>{stats.requestsSent + stats.requestsReceived}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon bg-cyan">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <h3>Completed Swaps</h3>
            <p>{stats.completedSwaps}</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon bg-green">
            <Star size={24} />
          </div>
          <div className="stat-info">
            <h3>Reputation Score</h3>
            <p>4.9/5</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="activity-panel glass-card">
          <div className="panel-header">
            <h3>Recent Activity</h3>
            <button className="btn-text">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon-sm ${activity.status}`}>
                  {activity.type === 'request' && <Clock size={16} />}
                  {activity.type === 'match' && <TrendingUp size={16} />}
                  {activity.type === 'complete' && <CheckCircle2 size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-subtitle">with <span>{activity.user}</span> • {activity.time}</p>
                </div>
                <div className={`status-badge-sm ${activity.status}`}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions-panel">
          <div className="promo-card glass-card">
            <div className="promo-content">
              <h4>Ready to learn something new?</h4>
              <p>Explore thousands of skills from our global community.</p>
              <button className="btn btn-primary btn-block">Explore Now</button>
            </div>
            <div className="promo-illustration">
              <Users size={48} />
            </div>
          </div>
          
          <div className="tips-card glass-card">
            <h4>Pro Swap Tip 💡</h4>
            <p>"Be specific about your proficiency level. It helps matches flow much smoother!"</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header-date {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          color: var(--text-secondary);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .activity-panel {
          padding: 32px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: var(--radius-md);
          transition: background 0.2s ease;
        }

        .activity-item:hover {
          background: var(--bg-glass);
        }

        .activity-icon-sm {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-card);
          border: 1px solid var(--border);
        }

        .activity-icon-sm.pending { color: var(--warning); background: rgba(245, 158, 11, 0.1); }
        .activity-icon-sm.accepted { color: var(--primary-light); background: rgba(124, 58, 237, 0.1); }
        .activity-icon-sm.completed { color: var(--success); background: rgba(16, 185, 129, 0.1); }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .activity-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .activity-subtitle span {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .status-badge-sm {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .status-badge-sm.pending { color: var(--warning); background: rgba(245, 158, 11, 0.1); }
        .status-badge-sm.accepted { color: var(--primary-light); background: rgba(124, 58, 237, 0.1); }
        .status-badge-sm.completed { color: var(--success); background: rgba(16, 185, 129, 0.1); }

        .quick-actions-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .promo-card {
          padding: 32px;
          background: var(--gradient-card);
          border-color: rgba(124, 58, 237, 0.2);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .promo-content h4 {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .promo-content p {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .tips-card {
          padding: 24px;
        }

        .tips-card h4 {
          font-size: 14px;
          margin-bottom: 8px;
        }

        .tips-card p {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
