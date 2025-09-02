import React from 'react'
import HeroSection from '../components/home/HeroSection'
import BannerCarousel from '../components/home/BannerCarousel'
import ProductsPreview from '../components/home/ProductsPreview'
import TestimonialsSection from '../components/home/TestimonialsSection'
import NewsletterSection from '../components/home/NewsletterSection'

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <BannerCarousel />
      <ProductsPreview />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  )
}

export default HomePage
