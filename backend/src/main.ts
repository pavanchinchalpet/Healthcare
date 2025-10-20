import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for local + Vercel frontend
  const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://healthcare-eight-bay.vercel.app',
  ].filter(Boolean); // Remove any undefined values

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // ✅ Enable validation with proper error handling
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: {
      target: false,
      value: false,
    },
  }));

  // ✅ Test database connection
  const databaseService = app.get(DatabaseService);
  try {
    const connectionResult = await databaseService.testConnection();
    console.log('🔗 Database:', connectionResult);

    // Create tables if connection is successful
    await databaseService.createTables();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }

  // ✅ Dynamic port for Render
  const port = process.env.PORT || 4000;
  await app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/graphql`);
  });
}

bootstrap();
