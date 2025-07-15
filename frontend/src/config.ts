// Configuration for different environments
const config = {
  // Local development
  development: {
    apiUrl: 'http://localhost:5001'
  },
  // Production environment (when deployed to GitHub Pages)
  production: {
    // Deployed backend URL on Render
    apiUrl: process.env.REACT_APP_API_URL || 'https://cv-analyser-f1yn.onrender.com'
  }
};

// Determine which environment to use
const env = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
export default config[env as keyof typeof config];
