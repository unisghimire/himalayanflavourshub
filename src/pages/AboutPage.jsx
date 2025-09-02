import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mountain, Users, Award, Heart, Leaf, Star } from 'lucide-react'

const AboutPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const values = [
    {
      icon: Mountain,
      title: "Authenticity",
      description: "We source directly from traditional farmers in the Himalayas, preserving centuries-old cultivation methods."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Our practices support environmental conservation and sustainable farming in the Himalayan region."
    },
    {
      icon: Heart,
      title: "Quality",
      description: "Every spice is hand-selected and tested to ensure the highest quality reaches your kitchen."
    },
    {
      icon: Users,
      title: "Community",
      description: "We support local farming communities through fair trade practices and long-term partnerships."
    }
  ]

  const team = [
    {
      name: "Tenzin Norbu",
      role: "Founder & CEO",
      description: "Born in the Himalayas, Tenzin brings traditional knowledge and modern business acumen to preserve authentic flavors.",
      image: "/images/team-tenzin.jpg"
    },
    {
      name: "Sarah Miller",
      role: "Head of Quality",
      description: "With 15 years in food science, Sarah ensures every batch meets our stringent quality standards.",
      image: "/images/team-sarah.jpg"
    },
    {
      name: "Raj Sharma",
      role: "Supply Chain Director",
      description: "Raj manages our network of farmer partners across the Himalayan region, ensuring fair trade practices.",
      image: "/images/team-raj.jpg"
    }
  ]

  const stats = [
    { number: "500+", label: "Farmer Partners" },
    { number: "15", label: "Years of Excellence" },
    { number: "50+", label: "Countries Served" },
    { number: "10,000+", label: "Happy Customers" }
  ]

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
              Our <span className="text-yellow-200">Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              From the sacred peaks of the Himalayas to your kitchen, 
              we bring you authentic flavors with a story worth telling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-w-16 aspect-h-12 rounded-xl overflow-hidden mountain-shadow">
                <div className="w-full h-96 bg-gradient-to-br from-primary-200 to-earth-200 rounded-xl flex items-center justify-center">
                  <Mountain className="w-32 h-32 text-primary-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-mountain-800 mb-6">
                Born in the <span className="text-gradient">Mountains</span>
              </h2>
              <p className="text-lg text-mountain-600 mb-6 leading-relaxed">
                Our journey began fifteen years ago when our founder, Tenzin Norbu, 
                recognized that the world deserved to experience the authentic flavors 
                of his homeland - the majestic Himalayas.
              </p>
              <p className="text-lg text-mountain-600 mb-8 leading-relaxed">
                What started as a small family business has grown into a global 
                mission to preserve traditional farming methods while bringing 
                premium Himalayan spices to kitchens worldwide.
              </p>
              <div className="flex items-center space-x-4">
                <Award className="w-8 h-8 text-primary-600" />
                <span className="font-semibold text-mountain-800">
                  Certified Organic & Fair Trade
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-to-br from-mountain-50 to-primary-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-mountain-800 mb-6">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-lg md:text-xl text-mountain-600 max-w-3xl mx-auto">
              These core principles guide every decision we make, from sourcing 
              to delivery, ensuring authenticity and quality in everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-mountain-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-mountain-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Our Impact by the Numbers
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Building bridges between Himalayan communities and global kitchens
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-mountain-800 mb-6">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-lg md:text-xl text-mountain-600 max-w-3xl mx-auto">
              The passionate people behind our mission to bring authentic 
              Himalayan flavors to the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="card text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-primary-200 to-earth-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="font-display text-4xl font-bold text-primary-700">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-mountain-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-mountain-600 leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-gradient-to-r from-primary-500 to-earth-500 text-white">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Star className="w-16 h-16 mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              "To preserve and share the authentic flavors of the Himalayas while 
              supporting traditional farming communities and sustainable practices 
              that have been passed down through generations."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-mountain-50 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                Join Our Mission
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
