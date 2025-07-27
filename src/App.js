import React from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import ProductsSection from './components/ProductsSection';
import Footer from './components/Footer';
import './App.css';

function App() {
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