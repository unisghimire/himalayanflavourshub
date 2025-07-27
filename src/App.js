import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import ProductsSection from './components/ProductsSection';
import Footer from './components/Footer';
import EmailPopup from './components/EmailPopup';
import './App.css';

function App() {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [hasEnteredEmail, setHasEnteredEmail] = useState(false);

  useEffect(() => {
    // Check if user has already entered email
    const savedEmail = localStorage.getItem('himalayanFlavoursEmail');
    if (!savedEmail) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setShowEmailPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setHasEnteredEmail(true);
    }
  }, []);

  const handleEmailSubmit = (email) => {
    setShowEmailPopup(false);
    setHasEnteredEmail(true);
    console.log('Email submitted:', email);
    // Here you can add logic to send the email to your backend
  };

  // Don't render the main content until email is entered
  if (!hasEnteredEmail) {
    return (
      <div className="App">
        <EmailPopup 
          isVisible={showEmailPopup} 
          onEmailSubmit={handleEmailSubmit} 
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Hero />
      <StorySection />
      <ProductsSection />
      <Footer />
    </div>
  );
}

export default App; 