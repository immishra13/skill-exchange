import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  orderBy 
} from 'firebase/firestore';

export default function Requests() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    // Received Requests
    const qReceived = query(
      collection(db, "requests"),
      where("toUserId", "==", currentUser.uid)
    );

    const unsubscribeReceived = onSnapshot(qReceived, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReceivedRequests(data.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()));
    });

    // Sent Requests
    const qSent = query(
      collection(db, "requests"),
      where("fromUserId", "==", currentUser.uid)
    );

    const unsubscribeSent = onSnapshot(qSent, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSentRequests(data.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()));
      setLoading(false);
    });

    return () => {
      unsubscribeReceived();
      unsubscribeSent();
    };
  }, [currentUser]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (err) {
      setError("Failed to update request: " + err.message);
    }
  };

  const requestsToShow = activeTab === 'received' ? receivedRequests : sentRequests;

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="requests-view animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>Exchange Requests</h1>
          <p>Manage your skill swap invitations and collaborations.</p>
        </div>
      </div>

      <div className="tab-navigation glass-card">
        <button 
          className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          <ArrowDownLeft size={18} />
          Received ({receivedRequests.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          <ArrowUpRight size={18} />
          Sent ({sentRequests.length})
        </button>
      </div>

      {error && <div className="msg-error" style={{ marginBottom: '24px' }}><AlertCircle size={16} />{error}</div>}

      <div className="requests-container">
        {requestsToShow.length === 0 ? (
          <div className="empty-state glass-card">
            <MessageSquare size={48} />
            <h3>No {activeTab} requests</h3>
            <p>{activeTab === 'received' ? "You haven't received any swap invitations yet." : "You haven't sent any invitations yet."}</p>
          </div>
        ) : (
          <div className="requests-list">
            {requestsToShow.map(req => (
              <div key={req.id} className="request-card glass-card">
                <div className="request-header">
                  <div className="request-user">
                    <div className="avatar-sm">
                      {activeTab === 'received' ? req.fromUserName[0] : req.toUserName[0]}
                    </div>
                    <div>
                      <h4>{activeTab === 'received' ? req.fromUserName : req.toUserName}</h4>
                      <p>{req.status === 'pending' ? 'Interested in your skill' : `Status: ${req.status}`}</p>
                    </div>
                  </div>
                  <div className={`status-badge ${req.status}`}>
                    {req.status === 'pending' ? <Clock size={12} /> : 
                     req.status === 'accepted' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {req.status}
                  </div>
                </div>

                <div className="request-body">
                  <div className="skill-interest">
                    <span className="label">Requested Skill:</span>
                    <span className="skill-tag">{req.skillTitle}</span>
                  </div>
                  <p className="request-message">"{req.message}"</p>
                </div>

                {activeTab === 'received' && req.status === 'pending' && (
                  <div className="request-actions">
                    <button 
                      onClick={() => handleStatusUpdate(req.id, 'accepted')}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle2 size={16} />
                      Accept Swap
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(req.id, 'declined')}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={16} />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .tab-navigation {
          display: flex;
          padding: 8px;
          gap: 8px;
          margin-bottom: 32px;
          width: fit-content;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          background: none;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-glass);
        }

        .tab-btn.active {
          color: var(--primary-light);
          background: var(--bg-glass-hover);
          border: 1px solid var(--border-hover);
        }

        .requests-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .request-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .request-user {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .request-user h4 {
          font-size: 15px;
          color: var(--text-primary);
        }

        .request-user p {
          font-size: 12px;
          color: var(--text-muted);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .status-badge.accepted { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status-badge.declined { background: rgba(239, 68, 68, 0.1); color: var(--danger); }

        .skill-interest {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .skill-interest .label {
          font-size: 12px;
          color: var(--text-muted);
        }

        .skill-tag {
          padding: 3px 8px;
          background: rgba(124, 58, 237, 0.1);
          color: var(--primary-light);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .request-message {
          font-size: 14px;
          color: var(--text-secondary);
          font-style: italic;
          padding: 12px;
          background: var(--bg-glass);
          border-left: 3px solid var(--border);
          border-radius: 0 8px 8px 0;
        }

        .request-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        @media (max-width: 640px) {
          .requests-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
