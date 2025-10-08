import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async testConnection(): Promise<string> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      return 'Database connection successful';
    } catch (error) {
      console.error('Database connection failed:', error.message);
      return `Database connection failed: ${error.message}`;
    }
  }

  async createTables(): Promise<void> {
    try {
      await this.dataSource.synchronize();
      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Failed to create tables:', error.message);
    }
  }
}