import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  AlertCircle,
  MessageSquare,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import SkillCard from '../../components/SkillCard';

export default function ExploreSkills() {
  const { currentUser } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [requestSkill, setRequestSkill] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch all skills NOT belonging to the current user
    const q = query(
      collection(db, "skills"),
      where("userId", "!=", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const skillsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setSkills(skillsData.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    }, (err) => {
      setError("Failed to fetch skills. Please check your Firestore rules.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!requestSkill) return;
    
    setRequestLoading(true);
    try {
      await addDoc(collection(db, "requests"), {
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName,
        toUserId: requestSkill.userId,
        toUserName: requestSkill.userName,
        skillId: requestSkill.id,
        skillTitle: requestSkill.title,
        message: requestMessage,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setRequestSkill(null);
      setRequestMessage('');
      alert("Skill swap request sent! Wait for them to accept.");
    } catch (err) {
      setError("Failed to send request: " + err.message);
    } finally {
      setRequestLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || skill.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All', 'Development', 'Design', 'Marketing', 'Business', 'Languages', 
    'Music', 'Photography', 'Cooking', 'Health & Fitness', 'Other'
  ];

  if (loading) return (
    <div className="loading-center">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="explore-view animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>Explore Skills</h1>
          <p>Discover talented people and exchange your expertise.</p>
        </div>
      </div>

      <div className="explore-toolbar glass-card">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search skills (e.g. Photoshop, SEO...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={18} />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="msg-error" style={{ marginBottom: '24px' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {filteredSkills.length === 0 ? (
        <div className="empty-state glass-card">
          <Globe size={48} />
          <h3>No skills found</h3>
          <p>Try adjusting your search or category filters.</p>
          <button onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="skills-grid">
          {filteredSkills.map(skill => (
            <SkillCard 
              key={skill.id} 
              skill={skill} 
              isOwner={false}
              onSecondaryAction={(s) => setRequestSkill(s)}
            />
          ))}
        </div>
      )}

      {/* Request Swap Modal */}
      {requestSkill && (
        <div className="modal-overlay">
          <div className="modal-box glass animate-fadeIn">
            <div className="modal-header">
              <h2 className="modal-title">Request Skill Swap</h2>
              <button className="modal-close" onClick={() => setRequestSkill(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="request-preview">
              <div className="stat-icon bg-purple">
                <Zap size={24} />
              </div>
              <div className="request-info">
                <h4>{requestSkill.title}</h4>
                <p>Offered by {requestSkill.userName}</p>
              </div>
            </div>

            <form onSubmit={handleSendRequest} className="modal-form">
              <div className="form-group">
                <label>Custom Message</label>
                <textarea 
                  className="form-textarea"
                  placeholder="Explain why you want to swap and what you can offer in return..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setRequestSkill(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={requestLoading}>
                  {requestLoading ? 'Sending...' : 'Send Swap Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .explore-toolbar {
          display: flex;
          gap: 20px;
          padding: 20px;
          margin-bottom: 32px;
          align-items: center;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: var(--radius-md);
        }

        .search-box input {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 14px;
          width: 100%;
        }

        .filter-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: var(--radius-md);
        }

        .filter-box select {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .request-preview {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: var(--bg-glass);
          border-radius: var(--radius-md);
        }

        .request-info h4 {
          font-size: 16px;
        }

        .request-info p {
          font-size: 13px;
          color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .explore-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
