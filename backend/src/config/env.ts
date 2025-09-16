import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Env {
  // Server Configuration
  static NODE_ENV = process.env.NODE_ENV || "development";
  static PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

  // Database Configuration
  static MONGODB_URI = process.env.MONGODB_URI as string;

  // Hostaway API Configuration
  static HOSTAWAY_ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID as string;
  static HOSTAWAY_API_KEY = process.env.HOSTAWAY_API_KEY as string;
  static HOSTAWAY_BASE_URL = process.env.HOSTAWAY_BASE_URL || "https://api.hostaway.com/v1";

  // Google Places API Configuration
  static GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";
  static GOOGLE_PLACES_BASE_URL = process.env.GOOGLE_PLACES_BASE_URL || "https://maps.googleapis.com/maps/api/place";

  // CORS Configuration
  static CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
  
  // Get CORS origins for Vercel deployment
  static getCorsOrigins(): string[] {
    const origins = [
      "http://localhost:3000",
      "https://flex-living-reviews.vercel.app",
      "https://the-flex-backend.vercel.app"
    ];
    
    if (process.env.CORS_ORIGIN) {
      origins.push(process.env.CORS_ORIGIN);
    }
    
    return origins;
  }

  // Rate Limiting
  static RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 900000; // 15 minutes
  static RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) : 100;

  // Logging
  static LOG_LEVEL = process.env.LOG_LEVEL || "info";
  static LOG_FILE = process.env.LOG_FILE || "logs/app.log";

  // Validation
  static validate(): void {
    const requiredEnvVars = [
      'MONGODB_URI',
      'HOSTAWAY_ACCOUNT_ID', 
      'HOSTAWAY_API_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
      console.error('Please check your .env file');
      process.exit(1);
    }
  }
}

export default Env;
