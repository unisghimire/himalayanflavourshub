import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './StorySection.css';

const StorySection = () => {
  const [ref1, inView1] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section id="story" className="story-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Story
        </motion.h2>
        
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A journey from the pristine Himalayas to your kitchen, bringing authentic flavors 
          and traditional wisdom passed down through generations.
        </motion.p>

        <div className="story-chapters">
          {/* Chapter 1: The Mountains */}
          <motion.div 
            ref={ref1}
            className="story-chapter"
            initial={{ opacity: 0, x: -50 }}
            animate={inView1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="chapter-content">
              <div className="chapter-number">01</div>
              <h3>The Sacred Mountains</h3>
              <p>
                High in the majestic Himalayas, where the air is pure and the soil is rich 
                with minerals, our story begins. These sacred mountains have been home to 
                ancient spice routes and traditional farming practices for centuries. 
                The unique altitude, climate, and soil composition create the perfect 
                conditions for growing the most aromatic and flavorful spices in the world.
              </p>
              <div className="chapter-icon">🏔️</div>
            </div>
            <div className="chapter-visual">
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
            </div>
          </motion.div>

          {/* Chapter 2: The Tradition */}
          <motion.div 
            ref={ref2}
            className="story-chapter reverse"
            initial={{ opacity: 0, x: 50 }}
            animate={inView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="chapter-content">
              <div className="chapter-number">02</div>
              <h3>Traditional Wisdom</h3>
              <p>
                Our spices are harvested using time-honored methods passed down through 
                generations. Local farmers, with their deep understanding of the land and 
                seasons, carefully select and hand-pick each spice at the perfect moment 
                of ripeness. The traditional mortar and pestle method ensures that the 
                natural oils and flavors are preserved, creating the most authentic taste 
                experience.
              </p>
              <div className="chapter-icon">🌿</div>
            </div>
            <div className="chapter-visual">
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
            </div>
          </motion.div>

          {/* Chapter 3: The Journey */}
          <motion.div 
            ref={ref3}
            className="story-chapter"
            initial={{ opacity: 0, x: -50 }}
            animate={inView3 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="chapter-content">
              <div className="chapter-number">03</div>
              <h3>From Mountains to Your Table</h3>
              <p>
                Every spice in our collection embarks on a carefully orchestrated journey 
                from the Himalayan heights to your kitchen. We maintain the highest standards 
                of quality control, ensuring that each batch preserves its natural aroma, 
                flavor, and nutritional value. Our commitment to authenticity means you 
                experience the true taste of the Himalayas in every dish you create.
              </p>
              <div className="chapter-icon">🚚</div>
            </div>
            <div className="chapter-visual">
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection; 