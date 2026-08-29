import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({ origin: ['http://localhost:3000', 'https://hostel-erp-portal-web.vercel.app'], credentials: true });
  app.setGlobalPrefix('api/v1');
  
  // Enterprise-grade validation and error handling
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3001);
  console.log('🚀 API server running on http://localhost:3001/api/v1');
}
bootstrap();
