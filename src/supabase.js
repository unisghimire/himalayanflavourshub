import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table name for emails
export const EMAILS_TABLE = 'emails'

// Authentication service
export const authService = {
  // Sign in with Google OAuth
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      })

      if (error) {
        console.error('Google sign in error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to sign in with Google:', error)
      throw error
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to sign out:', error)
      throw error
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Get user error:', error)
        throw error
      }
      return user
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Get session error:', error)
        return false
      }
      return !!session
    } catch (error) {
      console.error('Failed to check authentication:', error)
      return false
    }
  }
}

// Helper functions for email operations
export const emailService = {
  // Add a new email
  async addEmail(email, ip = 'Unknown') {
    try {
      const { data, error } = await supabase
        .from(EMAILS_TABLE)
        .insert([
          {
            email: email,
            ip_address: ip,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Error adding email:', error)
        throw error
      }

      return data[0]
    } catch (error) {
      console.error('Failed to add email:', error)
      throw error
    }
  },

  // Get all emails
  async getAllEmails() {
    try {
      const { data, error } = await supabase
        .from(EMAILS_TABLE)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching emails:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch emails:', error)
      throw error
    }
  },

  // Get email count
  async getEmailCount() {
    try {
      const { count, error } = await supabase
        .from(EMAILS_TABLE)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error counting emails:', error)
        throw error
      }

      return count || 0
    } catch (error) {
      console.error('Failed to count emails:', error)
      throw error
    }
  },

  // Get unique email count
  async getUniqueEmailCount() {
    try {
      const { data, error } = await supabase
        .from(EMAILS_TABLE)
        .select('email')

      if (error) {
        console.error('Error fetching unique emails:', error)
        throw error
      }

      const uniqueEmails = [...new Set(data.map(item => item.email))]
      return uniqueEmails.length
    } catch (error) {
      console.error('Failed to count unique emails:', error)
      throw error
    }
  },

  // Get today's email count
  async getTodayEmailCount() {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from(EMAILS_TABLE)
        .select('*')
        .gte('created_at', today.toISOString())

      if (error) {
        console.error('Error fetching today\'s emails:', error)
        throw error
      }

      return data.length
    } catch (error) {
      console.error('Failed to count today\'s emails:', error)
      throw error
    }
  }
}
