import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { contentService } from '../contentService';
import './ProductsSection.css';

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const [content, setContent] = useState({
    title: "Our Products",
    subtitle: "Each product tells a story of tradition, quality, and the pristine Himalayan environment. Discover flavors that have been cherished for generations.",
    categories: [
      { id: 'all', name: 'All Products' },
      { id: 'spices', name: 'Pure Spices' },
      { id: 'blends', name: 'Signature Blends' },
      { id: 'herbs', name: 'Fresh Herbs' }
    ],
    products: [
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
    ],
    cta: {
      title: "Experience the True Taste of the Himalayas",
      subtitle: "Join thousands of customers who have discovered the authentic flavors of our region.",
      primaryButtonText: "Contact Us",
      secondaryButtonText: "Learn More",
      primaryButtonLink: "#contact",
      secondaryButtonLink: "#story"
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      const productsContent = await contentService.getSectionContent('products');
      if (productsContent) {
        setContent(productsContent);
      }
    };

    fetchContent();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? content.products 
    : content.products.filter(product => product.category === selectedCategory);

  // Function to render product image
  const renderProductImage = (product) => {
    console.log('Product image data:', product.name, product.image, product.icon);
    
    // If product has a custom image URL, display it
    if (product.image && (product.image.startsWith('http') || product.image.startsWith('https'))) {
      return (
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-custom-image"
          onError={(e) => {
            console.error('Image failed to load:', product.image);
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    // If product has an emoji icon, display it
    if (product.icon && !product.icon.startsWith('http')) {
      return <span className="product-emoji">{product.icon}</span>;
    }
    
    // If product has a non-URL image (like emoji), display it
    if (product.image && !product.image.startsWith('http') && product.image !== '') {
      return <span className="product-emoji">{product.image}</span>;
    }
    
    // Fallback to default emoji
    return <span className="product-emoji">🌿</span>;
  };

  return (
    <section className="products-section" id="products">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>{content.title}</h2>
          <p>{content.subtitle}</p>
        </motion.div>

        <motion.div 
          className="category-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {content.categories.map((category) => (
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
                {renderProductImage(product)}
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
          className="cta-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>{content.cta.title}</h3>
          <p>{content.cta.subtitle}</p>
          <div className="cta-buttons">
            <a href={content.cta.primaryButtonLink} className="btn btn-primary">
              {content.cta.primaryButtonText}
            </a>
            <a href={content.cta.secondaryButtonLink} className="btn btn-secondary">
              {content.cta.secondaryButtonText}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection; 