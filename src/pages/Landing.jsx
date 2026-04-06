import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Shield, Users, BookOpen, ChevronRight, Star, Globe, Zap, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-background">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        
        <div className="container">
          <div className="hero-content animate-fadeIn">
            <div className="badge-glow">
              <span className="badge-text">New: Skill Exchange 2.0</span>
              <div className="badge-glow-effect"></div>
            </div>
            
            <h1 className="hero-title">
              Master New Skills <br />
              <span>Through Exchange</span>
            </h1>
            
            <p className="hero-description">
              The world's most elegant platform for peer-to-peer learning. 
              Share your expertise and unlock the knowledge of thousands for free.
            </p>
            
            <div className="hero-actions">
              <Link to="/auth" className="btn btn-primary btn-lg">
                <Rocket size={18} />
                Start Swapping Now
              </Link>
              <Link to="/explore" className="btn btn-secondary btn-lg">
                Explore Skills
                <ChevronRight size={18} />
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Skills Listed</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">5k+</span>
                <span className="stat-label">Successful Swaps</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why SkillSwap?</h2>
            <p className="section-subtitle">Experience a new era of collaborative learning designed for the modern era.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon bg-purple">
                <Zap size={24} />
              </div>
              <h3>Instant Matching</h3>
              <p>Find the perfect skill match in seconds with our advanced filtering and recommendation engine.</p>
            </div>
            
            <div className="feature-card glass-card">
              <div className="feature-icon bg-blue">
                <Shield size={24} />
              </div>
              <h3>Secure Exchange</h3>
              <p>Built-in request management and progress tracking ensure a safe and productive learning experience.</p>
            </div>
            
            <div className="feature-card glass-card">
              <div className="feature-icon bg-cyan">
                <Users size={24} />
              </div>
              <h3>Global Community</h3>
              <p>Connect with experts from around the globe across hundreds of categories and disciplines.</p>
            </div>
            
            <div className="feature-card glass-card">
              <div className="feature-icon bg-green">
                <Star size={24} />
              </div>
              <h3>Level Up Faster</h3>
              <p>1-to-1 mentorship accelerates your growth far beyond passive online courses or video tutorials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="trust-section">
        <div className="container">
          <p className="trust-label">TRUSTED BY DEVELOPERS AND CREATIVES FROM</p>
          <div className="trust-logos">
            <div className="trust-logo">GOOGLE</div>
            <div className="trust-logo">META</div>
            <div className="trust-logo">Vercel</div>
            <div className="trust-logo">Microsoft</div>
            <div className="trust-logo">Adobe</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card">
            <div className="cta-content">
              <h2>Ready to share your talent?</h2>
              <p>Join thousands of members who are growing together through the power of exchange.</p>
              <Link to="/auth" className="btn btn-primary btn-lg">
                Join Now — It's Free
              </Link>
            </div>
            <div className="cta-image-placeholder">
              <div className="floating-icons">
                 <div className="icon"><BookOpen /></div>
                 <div className="icon"><Globe /></div>
                 <div className="icon"><CheckCircle /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="navbar-logo">
                <div className="logo-icon">
                  <Zap size={24} fill="var(--primary)" />
                </div>
                <span>Skill<span>Swap</span></span>
              </Link>
              <p>The premium peer-to-peer skill exchange platform.</p>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <Link to="/explore">Explore</Link>
              <Link to="/auth">Sign Up</Link>
              <Link to="/pricing">Pricing</Link>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/careers">Careers</Link>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 SkillSwap Cloud Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
