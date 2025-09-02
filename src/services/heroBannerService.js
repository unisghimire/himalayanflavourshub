// Hero Banner Service for managing hero banner data
import { supabase } from '../lib/supabase'

export const heroBannerService = {
  // Default hero banners (empty array - no fallbacks)
  defaultBanners: [],

  // Get hero banners from database
  async getHeroBanners() {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error

      // Transform database data to match expected format
      return data.map(banner => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image_url,
        order: banner.order_index
      }))
    } catch (error) {
      console.error('Error loading hero banners from database:', error)
      return this.defaultBanners
    }
  },

  // Add new hero banner to database
  async addHeroBanner(banner) {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .insert([{
          title: banner.title,
          subtitle: banner.subtitle,
          image_url: banner.image,
          order_index: banner.order || 0,
          is_active: true
        }])
        .select()

      if (error) throw error

      // Return updated banners list
      return await this.getHeroBanners()
    } catch (error) {
      console.error('Error adding hero banner to database:', error)
      throw error
    }
  },

  // Update hero banner in database
  async updateHeroBanner(bannerId, updates) {
    try {
      const updateData = {}
      if (updates.title) updateData.title = updates.title
      if (updates.subtitle) updateData.subtitle = updates.subtitle
      if (updates.image) updateData.image_url = updates.image
      if (updates.order !== undefined) updateData.order_index = updates.order

      const { error } = await supabase
        .from('hero_banners')
        .update(updateData)
        .eq('id', bannerId)

      if (error) throw error

      // Return updated banners list
      return await this.getHeroBanners()
    } catch (error) {
      console.error('Error updating hero banner in database:', error)
      throw error
    }
  },

  // Delete hero banner from database
  async deleteHeroBanner(bannerId) {
    try {
      const { error } = await supabase
        .from('hero_banners')
        .delete()
        .eq('id', bannerId)

      if (error) throw error

      // Return updated banners list
      return await this.getHeroBanners()
    } catch (error) {
      console.error('Error deleting hero banner from database:', error)
      throw error
    }
  },

  // Get banner by ID from database
  async getBannerById(bannerId) {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('id', bannerId)
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        image: data.image_url,
        order: data.order_index
      }
    } catch (error) {
      console.error('Error getting hero banner by ID from database:', error)
      return null
    }
  },

  // Reorder banners in database
  async reorderBanners(bannerIds) {
    try {
      // Update order_index for each banner
      const updatePromises = bannerIds.map((id, index) => 
        supabase
          .from('hero_banners')
          .update({ order_index: index })
          .eq('id', id)
      )

      await Promise.all(updatePromises)

      // Return updated banners list
      return await this.getHeroBanners()
    } catch (error) {
      console.error('Error reordering hero banners in database:', error)
      throw error
    }
  }
}
