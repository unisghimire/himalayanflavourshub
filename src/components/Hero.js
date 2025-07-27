import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="mountains"></div>
        <div className="overlay"></div>
      </div>
      
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="logo-container">
            {/* Replace the CSS-drawn logo with your actual logo image */}
            <img 
              src="/logo.png" 
              alt="Himalayan Flavours Hub Logo" 
              className="hero-logo"
            />
          </div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            From Top of the World
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Discover authentic Himalayan spices and flavors, carefully sourced from the pristine mountains 
            and brought to your table with traditional wisdom and modern care.
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
          >
            <a href="#story" className="btn btn-primary">Our Story</a>
            <a href="#products" className="btn btn-secondary">Explore Products</a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 