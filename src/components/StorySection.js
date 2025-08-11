import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { contentService } from '../contentService';
import './StorySection.css';

const StorySection = () => {
  const [ref1, inView1] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.3, triggerOnce: true });

  const [content, setContent] = useState({
    title: "Our Story",
    subtitle: "A journey from the pristine Himalayas to your kitchen, bringing authentic flavors and traditional wisdom passed down through generations.",
    chapters: [
      {
        number: "01",
        title: "The Sacred Mountains",
        content: "High in the majestic Himalayas, where the air is pure and the soil is rich with minerals, our story begins. These sacred mountains have been home to ancient spice routes and traditional farming practices for centuries. The unique altitude, climate, and soil composition create the perfect conditions for growing the most aromatic and flavorful spices in the world.",
        icon: "🏔️"
      },
      {
        number: "02",
        title: "Traditional Wisdom",
        content: "Our spices are harvested using time-honored methods passed down through generations. Local farmers, with their deep understanding of the land and seasons, carefully select and hand-pick each spice at the perfect moment of ripeness. The traditional mortar and pestle method ensures that the natural oils and flavors are preserved, creating the most authentic taste experience.",
        icon: "🌿"
      },
      {
        number: "03",
        title: "From Mountains to Your Table",
        content: "Every spice in our collection embarks on a carefully orchestrated journey from the Himalayan heights to your kitchen. We maintain the highest standards of quality control, ensuring that each batch preserves its natural aroma, flavor, and nutritional value. Our commitment to authenticity means you experience the true taste of the Himalayas in every dish you create.",
        icon: "🚚"
      }
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      const storyContent = await contentService.getSectionContent('story');
      if (storyContent) {
        setContent(storyContent);
      }
    };

    fetchContent();
  }, []);

  return (
    <section id="story" className="story-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {content.title}
        </motion.h2>
        
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {content.subtitle}
        </motion.p>

        <div className="story-chapters">
          {content.chapters.map((chapter, index) => (
            <motion.div 
              key={chapter.number}
              ref={index === 0 ? ref1 : index === 1 ? ref2 : ref3}
              className={`story-chapter ${index === 1 ? 'reverse' : ''}`}
              initial={{ opacity: 0, x: index === 1 ? 50 : -50 }}
              animate={index === 0 ? (inView1 ? { opacity: 1, x: 0 } : {}) : 
                       index === 1 ? (inView2 ? { opacity: 1, x: 0 } : {}) : 
                       (inView3 ? { opacity: 1, x: 0 } : {})}
              transition={{ duration: 0.8 }}
            >
              <div className="chapter-content">
                <div className="chapter-number">{chapter.number}</div>
                <h3>{chapter.title}</h3>
                <p>{chapter.content}</p>
                <div className="chapter-icon">{chapter.icon}</div>
              </div>
              <div className="chapter-visual">
                {index === 0 && (
                  <div className="mountain-scene">
                    <div className="mountain-range">
                      <div className="peak peak-1"></div>
                      <div className="peak peak-2"></div>
                      <div className="peak peak-3"></div>
                    </div>
                    <div className="clouds">
                      <div className="cloud cloud-1"></div>
                      <div className="cloud cloud-2"></div>
                    </div>
                  </div>
                )}
                {index === 1 && (
                  <div className="traditional-scene">
                    <div className="mortar-pestle">
                      <div className="mortar"></div>
                      <div className="pestle"></div>
                      <div className="spices">
                        <div className="spice spice-1"></div>
                        <div className="spice spice-2"></div>
                        <div className="spice spice-3"></div>
                      </div>
                    </div>
                    <div className="leaves-decoration">
                      <div className="leaf leaf-1"></div>
                      <div className="leaf leaf-2"></div>
                      <div className="leaf leaf-3"></div>
                    </div>
                  </div>
                )}
                {index === 2 && (
                  <div className="journey-scene">
                    <div className="road">
                      <div className="road-line"></div>
                    </div>
                    <div className="truck">
                      <div className="truck-body"></div>
                      <div className="truck-cabin"></div>
                      <div className="truck-wheels">
                        <div className="wheel wheel-1"></div>
                        <div className="wheel wheel-2"></div>
                      </div>
                    </div>
                    <div className="mountains-background">
                      <div className="mountain-bg mountain-bg-1"></div>
                      <div className="mountain-bg mountain-bg-2"></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorySection; 