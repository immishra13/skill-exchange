import React from 'react';
import { 
  Pencil, 
  Trash2, 
  Tag, 
  BarChart, 
  Calendar,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import './SkillCard.css';

export default function SkillCard({ skill, onEdit, onDelete, isOwner = false, onSecondaryAction }) {
  const { title, category, proficiency, description, tags, createdAt } = skill;

  return (
    <div className="skill-card animate-fadeIn">
      <div className="skill-card-header">
        <div className="category-wrapper">
          <span className="badge-category">{category}</span>
          <div className={`proficiency-indicator ${proficiency.toLowerCase()}`}>
            {proficiency}
          </div>
        </div>
        {isOwner ? (
          <div className="card-actions">
            <button onClick={() => onEdit(skill)} className="btn-icon-xs" title="Edit Skill">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(skill.id)} className="btn-icon-xs delete" title="Delete Skill">
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <button onClick={() => onSecondaryAction(skill)} className="btn-icon-xs" title="View Details">
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      <div className="skill-card-body">
        <h3 className="skill-title">{title}</h3>
        <p className="skill-description line-clamp-3">{description}</p>
        
        <div className="skill-tags">
          {tags && tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="tag-item">
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {tags && tags.length > 3 && (
            <span className="tag-more">+{tags.length - 3}</span>
          )}
        </div>
      </div>

      <div className="skill-card-footer">
        <div className="footer-info">
          <Calendar size={12} />
          <span>Added {new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
