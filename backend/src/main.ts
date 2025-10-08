import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  });
  
  // Enable validation pipes - DISABLED FOR NOW
  // app.useGlobalPipes(new ValidationPipe({
  //   transform: true,
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  // }));
  
  // Test database connection
  const databaseService = app.get(DatabaseService);
  try {
    const connectionResult = await databaseService.testConnection();
    console.log('🔗 Database:', connectionResult);
    
    // Create tables if connection is successful
    await databaseService.createTables();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/graphql`);
}
bootstrap();