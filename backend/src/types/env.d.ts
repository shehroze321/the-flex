declare namespace NodeJS {
  interface ProcessEnv {
    // Server Configuration
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    
    // Database Configuration
    MONGODB_URI: string;
    
    // Hostaway API Configuration
    HOSTAWAY_ACCOUNT_ID: string;
    HOSTAWAY_API_KEY: string;
    HOSTAWAY_BASE_URL?: string;
    
    // Google Places API Configuration
    GOOGLE_PLACES_API_KEY?: string;
    GOOGLE_PLACES_BASE_URL?: string;
    
    // CORS Configuration
    CORS_ORIGIN?: string;
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS?: string;
    RATE_LIMIT_MAX_REQUESTS?: string;
    
    // Logging
    LOG_LEVEL?: string;
    LOG_FILE?: string;
  }
}
