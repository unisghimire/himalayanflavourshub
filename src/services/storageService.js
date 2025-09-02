import { supabase } from '../lib/supabase'

// Storage Service for handling file uploads
export const storageService = {
  // Upload product image
  async uploadProductImage(file, productId = null) {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = productId 
        ? `product_${productId}_${Date.now()}.${fileExt}`
        : `product_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const filePath = `products/${fileName}`
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return {
        success: true,
        path: filePath,
        url: publicUrl
      }
    } catch (error) {
      console.error('Error uploading product image:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Upload category image
  async uploadCategoryImage(file, categoryId = null) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = categoryId 
        ? `category_${categoryId}_${Date.now()}.${fileExt}`
        : `category_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const filePath = `categories/${fileName}`
      
      const { data, error } = await supabase.storage
        .from('category-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(filePath)

      return {
        success: true,
        path: filePath,
        url: publicUrl
      }
    } catch (error) {
      console.error('Error uploading category image:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Upload gallery images
  async uploadGalleryImages(files, productId) {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `gallery_${productId}_${index}_${Date.now()}.${fileExt}`
        const filePath = `gallery/${fileName}`
        
        const { data, error } = await supabase.storage
          .from('gallery-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(filePath)

        return {
          path: filePath,
          url: publicUrl
        }
      })

      const results = await Promise.all(uploadPromises)
      
      return {
        success: true,
        images: results
      }
    } catch (error) {
      console.error('Error uploading gallery images:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Delete image
  async deleteImage(bucket, filePath) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting image:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Delete product image by URL
  async deleteProductImage(imageUrl) {
    try {
      // Extract file path from Supabase Storage URL
      if (!imageUrl || !imageUrl.includes('supabase.co')) {
        return { success: false, error: 'Invalid image URL' }
      }

      // Parse the URL to get the file path
      const urlParts = imageUrl.split('/storage/v1/object/public/')
      if (urlParts.length < 2) {
        return { success: false, error: 'Invalid Supabase URL format' }
      }

      const pathParts = urlParts[1].split('/')
      const bucket = pathParts[0]
      const filePath = pathParts.slice(1).join('/')

      // Remove query parameters if any
      const cleanFilePath = filePath.split('?')[0]

      return await this.deleteImage(bucket, cleanFilePath)
    } catch (error) {
      console.error('Error deleting product image:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get public URL for a file
  getPublicUrl(bucket, filePath) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return data.publicUrl
  },

  // Validate file
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    } = options

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${maxSize / (1024 * 1024)}MB`
      }
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type must be one of: ${allowedTypes.join(', ')}`
      }
    }

    return { valid: true }
  },

  // Upload hero banner image
  async uploadHeroBanner(file) {
    try {
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `hero_banner_${Date.now()}.${fileExt}`
      const filePath = `hero/${fileName}`

      const { data, error } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath)

      return { success: true, url: publicUrl, path: filePath }
    } catch (error) {
      console.error('Error uploading hero banner:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete hero banner image
  async deleteHeroBanner(imageUrl) {
    try {
      if (!imageUrl || !imageUrl.includes('supabase.co')) {
        return { success: false, error: 'Invalid image URL' }
      }

      // Parse the URL to get the file path
      const urlParts = imageUrl.split('/storage/v1/object/public/')
      if (urlParts.length < 2) {
        return { success: false, error: 'Invalid Supabase URL format' }
      }

      const pathParts = urlParts[1].split('/')
      const bucket = pathParts[0]
      const filePath = pathParts.slice(1).join('/')

      // Remove query parameters if any
      const cleanFilePath = filePath.split('?')[0]

      return await this.deleteImage(bucket, cleanFilePath)
    } catch (error) {
      console.error('Error deleting hero banner:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}
