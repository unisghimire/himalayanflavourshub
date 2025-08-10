import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { emailService } from '../supabase';
import './EmailPopup.css';

const EmailPopup = ({ isVisible, onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Store email in Supabase
      await emailService.addEmail(email);
      
      // Store email in localStorage as backup and for user experience
      localStorage.setItem('himalayanFlavoursEmail', email);
      
      // Call the parent callback
      onEmailSubmit(email);
      
      console.log('Email collected and stored in Supabase:', email);
    } catch (error) {
      console.error('Error submitting email:', error);
      setError('Failed to submit email. Please try again.');
      
      // Still allow access even if Supabase fails
      localStorage.setItem('himalayanFlavoursEmail', email);
      onEmailSubmit(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="email-popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="email-popup"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="popup-header">
          <h2>Welcome to Himalayan Flavours Hub!</h2>
          <p>Enter your email to unlock exclusive content and stay updated with our latest offerings.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="email-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={isSubmitting}
              className="email-input"
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Get Access'}
          </button>
        </form>
        
        <div className="popup-footer">
          <p>By entering your email, you agree to receive updates from Himalayan Flavours Hub.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailPopup; 