// Hero Banner Service for managing hero banner data
import { supabase } from '../lib/supabase'

export const heroBannerService = {
  // Default hero banners (empty array - no fallbacks)
  defaultBanners: [],

  // Get hero banners from localStorage or return default
  getHeroBanners() {
    try {
      const storedBanners = localStorage.getItem('heroBanners')
      if (storedBanners) {
        return JSON.parse(storedBanners)
      }
    } catch (error) {
      console.error('Error loading hero banners from localStorage:', error)
    }
    return this.defaultBanners
  },

  // Save hero banners to localStorage
  saveHeroBanners(banners) {
    try {
      localStorage.setItem('heroBanners', JSON.stringify(banners))
      return true
    } catch (error) {
      console.error('Error saving hero banners to localStorage:', error)
      return false
    }
  },

  // Update hero banner
  updateHeroBanner(bannerId, updates) {
    const banners = this.getHeroBanners()
    const updatedBanners = banners.map(banner => 
      banner.id === bannerId ? { ...banner, ...updates } : banner
    )
    this.saveHeroBanners(updatedBanners)
    return updatedBanners
  },

  // Add new hero banner
  addHeroBanner(banner) {
    const banners = this.getHeroBanners()
    const newBanner = {
      ...banner,
      id: Date.now(),
      order: banners.length
    }
    const updatedBanners = [...banners, newBanner]
    this.saveHeroBanners(updatedBanners)
    return updatedBanners
  },

  // Delete hero banner
  deleteHeroBanner(bannerId) {
    const banners = this.getHeroBanners()
    const updatedBanners = banners.filter(banner => banner.id !== bannerId)
    this.saveHeroBanners(updatedBanners)
    return updatedBanners
  },

  // Get banner by ID
  getBannerById(bannerId) {
    const banners = this.getHeroBanners()
    return banners.find(banner => banner.id === bannerId)
  },

  // Reorder banners
  reorderBanners(bannerIds) {
    const banners = this.getHeroBanners()
    const reorderedBanners = bannerIds.map((id, index) => {
      const banner = banners.find(b => b.id === id)
      return { ...banner, order: index }
    })
    this.saveHeroBanners(reorderedBanners)
    return reorderedBanners
  }
}
