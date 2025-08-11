import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contentService } from '../contentService';
import './Hero.css';

const Hero = () => {
  const [content, setContent] = useState({
    title: "From Top of the World",
    subtitle: "Discover authentic Himalayan spices and flavors, carefully sourced from the pristine mountains and brought to your table with traditional wisdom and modern care.",
    primaryButtonText: "Our Story",
    secondaryButtonText: "Explore Products",
    primaryButtonLink: "#story",
    secondaryButtonLink: "#products"
  });

  useEffect(() => {
    const fetchContent = async () => {
      const heroContent = await contentService.getSectionContent('hero');
      if (heroContent) {
        setContent(heroContent);
      }
    };

    fetchContent();
  }, []);

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
            {content.title}
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {content.subtitle}
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
          >
            <a href={content.primaryButtonLink} className="btn btn-primary">{content.primaryButtonText}</a>
            <a href={content.secondaryButtonLink} className="btn btn-secondary">{content.secondaryButtonText}</a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 