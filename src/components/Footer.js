import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <div className="logo-small">
                <img 
                  src="/logo.png" 
                  alt="Himalayan Flavours Hub Logo" 
                  className="footer-logo-img"
                />
                <div className="logo-text">
                  <span className="logo-title">HIMALAYAN FLAVOURS HUB</span>
                  <span className="logo-subtitle">From Top of the World</span>
                </div>
              </div>
            </div>
            <p className="footer-description">
              Bringing authentic Himalayan spices and flavors to your kitchen, 
              preserving traditional wisdom and quality for generations to come.
            </p>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#story">Our Story</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#about">About Us</a></li>
            </ul>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Himalayan Region, India</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>info@himalayanflavours.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+91 98765 43210</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">📘 Facebook</a>
              <a href="#" className="social-link">📷 Instagram</a>
              <a href="#" className="social-link">🐦 Twitter</a>
              <a href="#" className="social-link">💼 LinkedIn</a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p>&copy; 2025 Himalayan Flavours Hub. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Shipping Info</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 