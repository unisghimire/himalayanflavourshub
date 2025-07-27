import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './ProductsSection.css';

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'spices', name: 'Pure Spices' },
    { id: 'blends', name: 'Signature Blends' },
    { id: 'herbs', name: 'Fresh Herbs' }
  ];

  const products = [
    {
      id: 1,
      name: 'Himalayan Black Pepper',
      category: 'spices',
      description: 'Premium black pepper from the high-altitude regions, known for its intense aroma and bold flavor.',
      price: '$12.99',
      image: '🌶️',
      story: 'Harvested from ancient pepper vines that grow wild in the Himalayan foothills, this black pepper carries the essence of the mountains.'
    },
    {
      id: 2,
      name: 'Sacred Cinnamon',
      category: 'spices',
      description: 'Rare cinnamon bark from the sacred groves, with a sweet and warming aroma.',
      price: '$18.99',
      image: '🌿',
      story: 'This cinnamon comes from trees that have been growing for generations in protected groves, where they are harvested with traditional reverence.'
    },
    {
      id: 3,
      name: 'Mountain Garam Masala',
      category: 'blends',
      description: 'Our signature blend of 12 aromatic spices, perfect for authentic Indian cuisine.',
      price: '$24.99',
      image: '✨',
      story: 'This blend represents centuries of culinary wisdom, combining spices that complement each other in perfect harmony.'
    },
    {
      id: 4,
      name: 'Wild Himalayan Thyme',
      category: 'herbs',
      description: 'Wild-harvested thyme with intense flavor and medicinal properties.',
      price: '$15.99',
      image: '🌱',
      story: 'Collected from wild thyme that grows naturally in the alpine meadows, this herb carries the pure essence of the mountains.'
    },
    {
      id: 5,
      name: 'Golden Turmeric',
      category: 'spices',
      description: 'Pure turmeric root powder with exceptional color and anti-inflammatory properties.',
      price: '$14.99',
      image: '🟡',
      story: 'This turmeric is grown in the rich, mineral-dense soil of the Himalayas, giving it a deeper color and more potent properties.'
    },
    {
      id: 6,
      name: 'Spice Route Blend',
      category: 'blends',
      description: 'A tribute to the ancient spice routes, featuring rare spices from across the region.',
      price: '$29.99',
      image: '🗺️',
      story: 'This blend recreates the flavors that traveled along the ancient spice routes, bringing together the best spices from across the Himalayan region.'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section id="products" className="products-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Products
        </motion.h2>
        
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Each product tells a story of tradition, quality, and the pristine Himalayan environment. 
          Discover flavors that have been cherished for generations.
        </motion.p>

        <motion.div 
          className="category-filters"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        <motion.div 
          ref={ref}
          className="products-grid"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="product-image">
                <span className="product-emoji">{product.image}</span>
              </div>
              <div className="product-content">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-story">
                  <h4>Our Story</h4>
                  <p>{product.story}</p>
                </div>
                <div className="product-footer">
                  <span className="product-price">{product.price}</span>
                  <button className="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="products-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3>Experience the True Taste of the Himalayas</h3>
          <p>Join thousands of customers who have discovered the authentic flavors of our region.</p>
          <div className="cta-buttons">
            <a href="#contact" className="btn btn-primary">Contact Us</a>
            <a href="#story" className="btn btn-secondary">Learn More</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection; 