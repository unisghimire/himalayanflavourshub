import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import ProductsSection from './components/ProductsSection';
import Footer from './components/Footer';
import EmailPopup from './components/EmailPopup';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { authService, supabase } from './supabase';
import './App.css';

function App() {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [hasEnteredEmail, setHasEnteredEmail] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

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

    // Check if admin is already authenticated and has admin role
    const checkAdminAuth = async () => {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const isAdmin = await authService.isAdmin();
        setIsAdminLoggedIn(isAdmin);
      } else {
        setIsAdminLoggedIn(false);
      }
    };
    
    checkAdminAuth();

    // Handle OAuth callback
    const handleOAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const isAdmin = await authService.isAdmin();
        setIsAdminLoggedIn(isAdmin);
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const isAdmin = await authService.isAdmin();
        setIsAdminLoggedIn(isAdmin);
      } else if (event === 'SIGNED_OUT') {
        setIsAdminLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEmailSubmit = (email) => {
    setShowEmailPopup(false);
    setHasEnteredEmail(true);
    console.log('Email submitted:', email);
    
    // Email is now stored in Supabase via EmailPopup component
    // We only need to store the user's email preference locally
    localStorage.setItem('himalayanFlavoursEmail', email);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = async () => {
    try {
      await authService.signOut();
      setIsAdminLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Still set logged out state even if Supabase logout fails
      setIsAdminLoggedIn(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={
            isAdminLoggedIn ? (
              <AdminPanel onLogout={handleAdminLogout} />
            ) : (
              <Login onLoginSuccess={handleAdminLogin} />
            )
          } />
          <Route path="/" element={
            <>
              <Hero />
              <StorySection />
              <ProductsSection />
              <Footer />
              {/* Show EmailPopup as overlay if email hasn't been entered */}
              {!hasEnteredEmail && (
                <EmailPopup 
                  isVisible={showEmailPopup} 
                  onEmailSubmit={handleEmailSubmit} 
                />
              )}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 