import { supabase } from '../lib/supabase'

const unitService = {
  // Get all units
  async getAllUnits() {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching units:', error)
      return []
    }
  },

  // Get units by category
  async getUnitsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .order('name', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching units by category:', error)
      return []
    }
  },

  // Get all categories
  async getUnitCategories() {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('category')
        .eq('is_active', true)
        .order('category', { ascending: true })

      if (error) throw error
      
      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))]
      return categories
    } catch (error) {
      console.error('Error fetching unit categories:', error)
      return []
    }
  },

  // Create new unit
  async createUnit(unitData) {
    try {
      const { data, error } = await supabase
        .from('units')
        .insert([unitData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating unit:', error)
      throw error
    }
  },

  // Update unit
  async updateUnit(unitId, updateData) {
    try {
      const { data, error } = await supabase
        .from('units')
        .update(updateData)
        .eq('id', unitId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating unit:', error)
      throw error
    }
  },

  // Delete unit (soft delete)
  async deleteUnit(unitId) {
    try {
      const { data, error } = await supabase
        .from('units')
        .update({ is_active: false })
        .eq('id', unitId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error deleting unit:', error)
      throw error
    }
  }
}

export default unitService
