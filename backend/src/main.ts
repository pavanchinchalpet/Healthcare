import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allowed CORS origins
  const allowedOrigins = [
    'http://localhost:3000',
    'https://healthcare-eight-bay.vercel.app',
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
  ].filter(Boolean);

  console.log('🌐 CORS Allowed Origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  });

  // ✅ Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Server running at http://localhost:${port}/graphql`);
}

bootstrap();
