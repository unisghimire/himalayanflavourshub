import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Gift, Bell, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const NewsletterSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call to newsletter service
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSubscribed(true)
      setEmail('')
      toast.success('Welcome to our newsletter! Check your email for a special discount.')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Get special discounts and early access to new products"
    },
    {
      icon: Bell,
      title: "Latest Updates",
      description: "Be the first to know about new spice arrivals and recipes"
    },
    {
      icon: Mail,
      title: "Spice Tips",
      description: "Receive cooking tips and traditional recipes from the Himalayas"
    }
  ]

  if (isSubscribed) {
    return (
      <section className="section-padding bg-gradient-to-r from-primary-500 to-earth-500">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="bg-white rounded-2xl p-8 md:p-12"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-mountain-800 mb-4">
              Welcome to the Family!
            </h2>
            <p className="text-lg text-mountain-600 mb-6">
              Thank you for subscribing to our newsletter. You'll receive a special 
              welcome discount in your email shortly.
            </p>
            <p className="text-mountain-500">
              Keep an eye on your inbox for exclusive offers, recipes, and updates 
              from the Himalayas.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-gradient-to-r from-primary-500 to-earth-500">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Stay Connected with the
              <span className="block text-yellow-200">Mountains</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Join our community of spice enthusiasts and receive exclusive offers, 
              traditional recipes, and updates on our latest products straight from 
              the Himalayas.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-white/80">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-white/80">
              <div className="text-center">
                <div className="font-bold text-xl">10K+</div>
                <div className="text-sm">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">Weekly</div>
                <div className="text-sm">Updates</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">No Spam</div>
                <div className="text-sm">Promise</div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-10 mountain-shadow"
          >
            <div className="text-center mb-8">
              <Mail className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-mountain-800 mb-2">
                Get 15% Off Your First Order
              </h3>
              <p className="text-mountain-600">
                Subscribe to our newsletter and receive an exclusive welcome discount
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input-field"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Subscribe & Get 15% Off</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-mountain-500 text-center mt-4">
              By subscribing, you agree to our privacy policy. Unsubscribe anytime.
            </p>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 mt-6 text-mountain-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Secure & Private</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
