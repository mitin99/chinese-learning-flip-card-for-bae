import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { autoSeed } from './database/auto-seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Auto-seed database on startup (only in production or if ENABLE_AUTO_SEED is true)
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.ENABLE_AUTO_SEED === 'true'
  ) {
    try {
      // Wait a bit for TypeORM to initialize
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const dataSource = app.get(DataSource);
      await autoSeed(dataSource);
    } catch (error) {
      console.error('Failed to auto-seed database:', error);
      // Continue startup even if seeding fails
    }
  }

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
