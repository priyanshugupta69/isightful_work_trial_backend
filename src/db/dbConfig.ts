import pg, { Pool, PoolClient } from 'pg';
import { db } from '../config';

export default class Database {
    private static instance: Database;
    private pool: Pool;
    constructor() {
      this.pool = new Pool({
        connectionString: db.DB_URL, // Use environment variables for DB URL
        ssl: {
          rejectUnauthorized: false, // Set to true if using self-signed certificates
        },
        max: parseInt(process.env.DB_POOL_MAX || '10', 10), // Maximum connections in the pool
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10), // Idle connections timeout
        connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT || '10000', 10), // Connection timeout
      });
    }
    static getInstance(){
      if (!Database.instance) {
        Database.instance = new Database();
      }
      return Database.instance;
    }
    async query(sql: string, args: any[]) {
      try {
        return await this.pool.query(sql, args); 
      } catch (error) {
        console.error('Database query error:', error); 
        throw error;
      }
    }
    async transaction(callback: (client: PoolClient) => Promise<any>) {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  }