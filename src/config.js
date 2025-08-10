// Configuration for API endpoints
const config = {
  // API Base URL - automatically detects environment
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? window.location.origin  // Use current domain in production
    : 'http://localhost:3001', // Use localhost in development
  
  // Email collection endpoint
  emailEndpoint: '/api/collect-email',
  
  // Admin emails endpoint
  emailsEndpoint: '/api/emails',
  
  // Get full API URL for a specific endpoint
  getApiUrl: (endpoint) => `${config.apiBaseUrl}${endpoint}`,
  
  // Check if running in production
  isProduction: process.env.NODE_ENV === 'production',
  
  // Check if running in development
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Get current domain dynamically
  getCurrentDomain: () => window.location.origin,
  
  // Check if running locally
  isLocalhost: () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
};

export default config;
