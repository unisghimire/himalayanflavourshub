import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Email service
export const emailService = {
  async addEmail(email) {
    try {
      const { data, error } = await supabase
        .from('emails')
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding email:', error);
      throw error;
    }
  },

  async getAllEmails() {
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting emails:', error);
      throw error;
    }
  }
};

// Storage service for product images
export const storageService = {
  async uploadProductImage(file, productId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async deleteProductImage(imageUrl) {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};

// Auth service
export const authService = {
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Get user error:', error);
        throw error;
      }
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error);
        return false;
      }
      return !!session;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  },

  // Check if user has admin role
  async isAdmin() {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return data || false;
    } catch (error) {
      console.error('Failed to check admin role:', error);
      return false;
    }
  },

  // Get user roles
  async getUserRoles() {
    try {
      const { data, error } = await supabase.rpc('get_user_roles');
      if (error) {
        console.error('Error getting user roles:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Failed to get user roles:', error);
      return [];
    }
  }
};
