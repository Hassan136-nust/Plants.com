// API Configuration
// This will use the environment variable in production, or localhost in development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Export for easy use throughout the app
export default API_URL;
