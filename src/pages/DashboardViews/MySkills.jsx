import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import SkillCard from '../../components/SkillCard';
import SkillModal from '../../components/SkillModal';

export default function MySkills() {
  const { currentUser } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "skills"), 
      where("userId", "==", currentUser.uid)
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

  const handleCreateOrUpdate = async (formData) => {
    setModalLoading(true);
    setError('');
    try {
      if (currentSkill) {
        // Update
        const skillRef = doc(db, "skills", currentSkill.id);
        await updateDoc(skillRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create
        await addDoc(collection(db, "skills"), {
          ...formData,
          userId: currentUser.uid,
          userName: currentUser.displayName,
          userPhoto: currentUser.photoURL,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      setError("Operation failed: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteDoc(doc(db, "skills", skillId));
      } catch (err) {
        setError("Delete failed: " + err.message);
      }
    }
  };

  const openEditModal = (skill) => {
    setCurrentSkill(skill);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentSkill(null);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="my-skills-view animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>My Skills</h1>
          <p>Manage the expertise you share with the community.</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} />
          Add New Skill
        </button>
      </div>

      {error && (
        <div className="msg-error" style={{ marginBottom: '24px' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {skills.length === 0 ? (
        <div className="empty-state glass-card">
          <BookOpen size={48} />
          <h3>No skills added yet</h3>
          <p>Start your exchange journey by listing what you're good at.</p>
          <button onClick={openCreateModal} className="btn btn-secondary">
            Get Started
          </button>
        </div>
      ) : (
        <div className="skills-grid">
          {skills.map(skill => (
            <SkillCard 
              key={skill.id} 
              skill={skill} 
              isOwner={true}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <SkillModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdate}
        initialData={currentSkill}
        loading={modalLoading}
      />

      <style jsx>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        @media (max-width: 640px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
