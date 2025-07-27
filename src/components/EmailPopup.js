import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EmailPopup.css';

const EmailPopup = ({ isVisible, onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }

    setIsSubmitting(true);
    setIsValid(true);

    // Send email to server
    try {
      const response = await fetch('http://localhost:3001/api/collect-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit email');
      }

      const result = await response.json();
      
      // Store email in localStorage to remember the user
      localStorage.setItem('himalayanFlavoursEmail', email);
      
      onEmailSubmit(email);
    } catch (error) {
      console.error('Error submitting email:', error);
      // Still allow access even if server fails
      localStorage.setItem('himalayanFlavoursEmail', email);
      onEmailSubmit(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!isValid) {
      setIsValid(true);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="email-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="email-popup"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          >
            <div className="popup-header">
              <img 
                src="/logo.png" 
                alt="Himalayan Flavours Hub" 
                className="popup-logo"
              />
              <h2>Welcome to Himalayan Flavours Hub</h2>
              <p>Enter your email to explore our authentic Himalayan spices and flavors</p>
            </div>

            <form onSubmit={handleSubmit} className="email-form">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className={`email-input ${!isValid ? 'error' : ''}`}
                  required
                />
                {!isValid && (
                  <motion.span 
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Please enter a valid email address
                  </motion.span>
                )}
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <span className="loading">
                    <div className="spinner"></div>
                    Entering...
                  </span>
                ) : (
                  'Enter Website'
                )}
              </motion.button>
            </form>

            <div className="popup-footer">
              <p>By entering your email, you agree to receive updates about our products and special offers.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailPopup; 