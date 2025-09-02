import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'

const TestimonialsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      review: "The authenticity of these spices is unmatched! The Himalayan black pepper has completely transformed my cooking. You can taste the difference that traditional farming makes.",
      image: "/images/sarah.jpg",
      product: "Himalayan Black Pepper"
    },
    {
      id: 2,
      name: "Raj Patel",
      location: "London, UK",
      rating: 5,
      review: "As someone who grew up with authentic Indian spices, I can confidently say these are the real deal. The Mountain Garam Masala brings back memories of my grandmother's cooking.",
      image: "/images/raj.jpg",
      product: "Mountain Garam Masala"
    },
    {
      id: 3,
      name: "Emma Chen",
      location: "Sydney, Australia",
      rating: 5,
      review: "I've been using the Sacred Cinnamon for months now, and it's incredible how much flavor it adds to everything. The quality is exceptional and the packaging keeps it fresh.",
      image: "/images/emma.jpg",
      product: "Sacred Cinnamon"
    },
    {
      id: 4,
      name: "Marco Rodriguez",
      location: "Barcelona, Spain",
      rating: 5,
      review: "The Golden Turmeric has become an essential part of my daily routine. Not only does it taste amazing, but I can feel the health benefits. Highly recommend!",
      image: "/images/marco.jpg",
      product: "Golden Turmeric"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      location: "Toronto, Canada",
      rating: 5,
      review: "Every spice I've ordered has exceeded my expectations. The freshness and aroma are incredible. It's like having a piece of the Himalayas in my kitchen.",
      image: "/images/lisa.jpg",
      product: "Wild Himalayan Thyme"
    },
    {
      id: 6,
      name: "Ahmed Hassan",
      location: "Dubai, UAE",
      rating: 5,
      review: "The Spice Route Blend is a masterpiece! It perfectly balances all the flavors and has become my go-to spice for special occasions. Outstanding quality.",
      image: "/images/ahmed.jpg",
      product: "Spice Route Blend"
    }
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-mountain-50 to-primary-50">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-mountain-800 mb-6">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-lg md:text-xl text-mountain-600 max-w-3xl mx-auto">
            Discover why thousands of food enthusiasts trust us for their authentic 
            Himalayan spice needs. Real reviews from real customers.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { number: "5,000+", label: "Happy Customers" },
            { number: "4.9/5", label: "Average Rating" },
            { number: "50+", label: "Countries Served" },
            { number: "98%", label: "Satisfaction Rate" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-mountain-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card relative group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Review */}
              <p className="text-mountain-700 mb-6 leading-relaxed italic">
                "{testimonial.review}"
              </p>

              {/* Product */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {testimonial.product}
                </span>
              </div>

              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-earth-200 rounded-full flex items-center justify-center">
                  <span className="font-display font-bold text-primary-700">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-mountain-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-mountain-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 border-2 border-primary-100 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-mountain-800 mb-4">
              Share Your Experience
            </h3>
            <p className="text-mountain-600 mb-6">
              We'd love to hear about your experience with our spices. 
              Your feedback helps us continue to deliver exceptional quality.
            </p>
            <button className="btn-primary">
              Write a Review
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection
