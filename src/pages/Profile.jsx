import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  FileText, 
  Camera, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Navbar from '../components/Navbar';
import './Profile.css';

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    location: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({
            displayName: docSnap.data().displayName || currentUser.displayName || '',
            bio: docSnap.data().bio || '',
            location: docSnap.data().location || '',
            photoURL: docSnap.data().photoURL || currentUser.photoURL || ''
          });
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    }
    fetchProfile();
  }, [currentUser]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const storageRef = ref(storage, `profiles/${currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfile({ ...profile, photoURL: url });
      setSuccess("Photo uploaded successfully!");
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        ...profile,
        updatedAt: new Date()
      });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="container profile-container">
        <header className="profile-header">
          <Link to="/dashboard" className="auth-back">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <h1>Profile Settings</h1>
          <p>Update your personal information and how others see you.</p>
        </header>

        <div className="dashboard-grid">
          <div className="profile-main-panel glass-card animate-fadeIn">
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-section">
                <div className="avatar-upload-container">
                  <div className="profile-avatar-large">
                    {profile.photoURL ? (
                      <img src={profile.photoURL} alt="Profile" />
                    ) : (
                      <User size={64} />
                    )}
                    {uploading && (
                      <div className="avatar-overlay">
                        <Loader2 size={32} className="spin" />
                      </div>
                    )}
                  </div>
                  <label className="btn btn-secondary btn-sm">
                    <Camera size={16} />
                    {uploading ? 'Uploading...' : 'Change Photo'}
                    <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>

                <div className="form-group-grid">
                  <div className="form-group">
                    <label>Display Name</label>
                    <div className="input-with-icon">
                      <User size={18} />
                      <input 
                        type="text" 
                        className="form-input" 
                        value={profile.displayName}
                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address (read-only)</label>
                    <div className="input-with-icon">
                      <Mail size={18} />
                      <input 
                        type="email" 
                        className="form-input" 
                        value={currentUser.email} 
                        disabled 
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. London, UK"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <div className="input-with-icon items-start">
                    <FileText size={18} style={{ marginTop: '12px' }} />
                    <textarea 
                      className="form-textarea"
                      placeholder="Tell the community about your expertise and what you're passionate about."
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>

              {error && <div className="msg-error"><AlertCircle size={16} />{error}</div>}
              {success && <div className="msg-success"><CheckCircle2 size={16} />{success}</div>}

              <div className="form-footer">
                <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                  {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="profile-side-panel">
            <div className="glass-card panel-info">
              <h4>Profile Strength</h4>
              <div className="strength-meter">
                <div className="meter-fill" style={{ width: profile.bio ? '100%' : '50%' }}></div>
              </div>
              <p>{profile.bio ? 'Great! Your profile is complete.' : 'Adding a bio will help you get more swap requests.'}</p>
            </div>
            
            <div className="glass-card panel-tips">
              <h4>Tips for Success</h4>
              <ul>
                <li>Use a clear profile picture.</li>
                <li>Write a concise bio focusing on skills.</li>
                <li>Link your social portfolios.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
