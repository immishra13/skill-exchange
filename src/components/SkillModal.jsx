import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Tag, Loader2, Info } from 'lucide-react';
import './SkillModal.css';

export default function SkillModal({ isOpen, onClose, onSave, initialData = null, loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Development',
    proficiency: 'Beginner',
    description: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        category: 'Development',
        proficiency: 'Beginner',
        description: '',
        tags: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const categories = [
    'Development', 'Design', 'Marketing', 'Business', 'Languages', 
    'Music', 'Photography', 'Cooking', 'Health & Fitness', 'Other'
  ];

  const proficiencies = ['Beginner', 'Intermediate', 'Expert'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag('');
    }
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box glass animate-fadeIn">
        <div className="modal-header">
          <h2 className="modal-title">{initialData ? 'Edit Skill' : 'Add New Skill'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Skill Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. React Development, Spanish, Yoga..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category</label>
              <select 
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Proficiency</label>
              <select 
                className="form-select"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
              >
                {proficiencies.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-textarea"
              placeholder="Tell others what you can share and how you can help them learn."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Tags (Optional)</label>
            <div className="tag-input-container">
              <input 
                type="text" 
                className="form-input"
                placeholder="Press add to include a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button type="button" onClick={addTag} className="btn btn-secondary btn-sm">
                <Plus size={16} />
                Add
              </button>
            </div>
            <div className="modal-tags">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="tag-badge">
                  {tag}
                  <button type="button" onClick={() => removeTag(idx)}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 size={18} className="spin" /> : (initialData ? 'Update Skill' : 'Create Skill')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
