import dotenv from "dotenv";
export const environment = process.env.NODE_ENV || "development";

dotenv.config({path:`.env.${environment}`});

export const port = process.env.PORT || 3000;
export const logDirectory = process.env.LOG_DIR

export const db = {
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: process.env.DB_PORT,
    DB_URL: process.env.DB_URL,
    SSL_MODE: process.env.SSL_MODE,
  }
export const jwtAccessTokenSecret:string = process.env.JWT_ACCESS_SECRET || ''
export const jwtRefreshTokenSecret:string = process.env.JWT_REFRESH_SECRET || ''
export const resendApiKey:string = process.env.RESEND_API_KEY || ''
export const frontendUrl:string = process.env.FRONTEND_URL || 'http://localhost:5000'
