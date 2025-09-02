import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ContactPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "info@himalayanflavours.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 98765 43210",
      description: "Mon-Fri, 9AM-6PM IST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Himalayan Region, India",
      description: "By appointment only"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "9:00 AM - 6:00 PM",
      description: "Monday to Friday"
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-mountain-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-earth-600 text-white py-20">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get in <span className="text-yellow-200">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Have questions about our spices? Want to know more about our story? 
              We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="card text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-mountain-800 mb-2">
                    {info.title}
                  </h3>
                  <p className="font-medium text-mountain-700 mb-1">
                    {info.details}
                  </p>
                  <p className="text-sm text-mountain-600">
                    {info.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="section-padding bg-gradient-to-br from-mountain-50 to-primary-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="card"
            >
              <div className="flex items-center mb-6">
                <MessageCircle className="w-8 h-8 text-primary-600 mr-3" />
                <h2 className="font-display text-2xl font-bold text-mountain-800">
                  Send us a Message
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="bulk-order">Bulk Orders</option>
                    <option value="shipping">Shipping & Returns</option>
                    <option value="partnership">Partnership</option>
                    <option value="general">General Question</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold text-mountain-800 mb-8">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "Where do you source your spices?",
                    answer: "We source directly from traditional farmers in the Himalayan region, ensuring authenticity and supporting local communities through fair trade practices."
                  },
                  {
                    question: "How fresh are your spices?",
                    answer: "All our spices are harvested seasonally and processed immediately to lock in flavor and aroma. We guarantee freshness with a 3-year shelf life from harvest date."
                  },
                  {
                    question: "Do you offer bulk orders?",
                    answer: "Yes! We offer special pricing for restaurants, retailers, and large quantity orders. Contact us for custom pricing and wholesale opportunities."
                  },
                  {
                    question: "What is your return policy?",
                    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, we'll provide a full refund or exchange."
                  },
                  {
                    question: "How long does shipping take?",
                    answer: "Standard shipping takes 3-7 business days within the US. International shipping varies by location. We also offer expedited shipping options."
                  }
                ].map((faq, index) => (
                  <div key={index} className="card">
                    <h3 className="font-semibold text-mountain-800 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-mountain-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Contact */}
              <div className="mt-8 card bg-primary-50 border-primary-200">
                <h3 className="font-display text-lg font-semibold text-mountain-800 mb-4">
                  Need immediate help?
                </h3>
                <p className="text-mountain-600 mb-4">
                  For urgent inquiries, you can reach us directly:
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:info@himalayanflavours.com"
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    <span>info@himalayanflavours.com</span>
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 98765 43210</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-mountain-800 mb-6">
              Our Himalayan <span className="text-gradient">Roots</span>
            </h2>
            <p className="text-lg text-mountain-600 max-w-3xl mx-auto">
              While we serve customers worldwide, our heart remains in the 
              majestic Himalayan region where our story began.
            </p>
          </motion.div>

          <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden mountain-shadow">
            <div className="w-full h-96 bg-gradient-to-br from-primary-200 to-earth-200 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-mountain-800 mb-2">
                  Himalayan Region
                </h3>
                <p className="text-mountain-600">
                  Where tradition meets quality
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
