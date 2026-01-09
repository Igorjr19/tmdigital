/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { DomainExceptionFilter } from './app/presentation/filters/domain-exception.filter';
import { LoggingInterceptor } from './app/presentation/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './app/presentation/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new DomainExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

  const config = new DocumentBuilder()
    .setTitle('TM Digital API')
    .setDescription('API para o teste técnico da TM Digital')
    .setVersion('1.0')
    .addTag('Leads')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = app.get(Logger);

  logger.log(
    ` Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  logger.log(`󰈙 Swagger is running on: http://localhost:${port}/api/docs`);
}

bootstrap();
