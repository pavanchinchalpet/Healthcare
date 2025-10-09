import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-dry-dew-adxkuks1-pooler.c-2.us-east-1.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 'npg_HRgKD2USepQ6',
      database: 'neondb',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        connectionLimit: 10,
        acquireTimeoutMillis: 30000,
        timeout: 20000,
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
