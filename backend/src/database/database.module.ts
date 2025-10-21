import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: 'postgresql://neondb_owner:npg_HRgKD2USepQ6@ep-dry-dew-adxkuks1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-dry-dew-adxkuks1-pooler',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          connectionLimit: 10,
          acquireTimeoutMillis: 30000,
          timeout: 20000,
        },
        retryAttempts: 5,
        retryDelay: 5000,
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}