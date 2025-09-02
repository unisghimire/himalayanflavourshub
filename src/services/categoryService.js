import { supabase } from '../lib/supabase'

// Categories Service
export const categoryService = {
  // Get all active categories
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  // Get category by slug
  async getCategoryBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  },

  // Get category with products
  async getCategoryWithProducts(slug) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          products(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('products.is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching category with products:', error)
      return null
    }
  },

  // Update category
  async updateCategory(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }
}

// Collections Service
export const collectionService = {
  // Get all active collections
  async getAllCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          categories(name, slug)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching collections:', error)
      return []
    }
  },

  // Get featured collections
  async getFeaturedCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          categories(name, slug)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching featured collections:', error)
      return []
    }
  },

  // Get collection by slug
  async getCollectionBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          categories(name, slug)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching collection:', error)
      return null
    }
  },

  // Get collection with products
  async getCollectionWithProducts(slug) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          categories(name, slug),
          products(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('products.is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching collection with products:', error)
      return null
    }
  }
}

// Products Service
export const productService = {
  // Get all active products
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          collections(name, slug)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from('featured_products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  },

  // Get trending products
  async getTrendingProducts() {
    try {
      const { data, error } = await supabase
        .from('trending_products')
        .select('*')
        .order('rating', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching trending products:', error)
      return []
    }
  },

  // Get products by category
  async getProductsByCategory(categorySlug) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          collections(name, slug)
        `)
        .eq('is_active', true)
        .eq('categories.slug', categorySlug)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  },

  // Get products by collection
  async getProductsByCollection(collectionSlug) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          collections(name, slug)
        `)
        .eq('is_active', true)
        .eq('collections.slug', collectionSlug)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching products by collection:', error)
      return []
    }
  },

  // Get product by slug
  async getProductBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          collections(name, slug)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  },

  // Search products
  async searchProducts(query) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          collections(name, slug)
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  },

  // Update product
  async updateProduct(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  // Update product image
  async updateProductImage(productId, imageUrl) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ 
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating product image:', error)
      throw error
    }
  },

  // Create product
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          slug: productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}

// Category Products View Service
export const categoryProductsService = {
  // Get all categories with product counts
  async getCategoryProducts() {
    try {
      const { data, error } = await supabase
        .from('category_products')
        .select('*')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching category products:', error)
      return []
    }
  }
}
