import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
          throw new Error(
            'DATABASE_URL is not defined. Please set it in your environment variables.',
          );
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false, // never true in prod
          logging: process.env.NODE_ENV === 'development',
          ssl:
            process.env.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : false,
          extra: {
            max: 10, // connection pool size
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 20000,
          },
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
