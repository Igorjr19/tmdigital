import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../backend/src/app/app.module';
import { SeedService } from '../../../backend/src/app/infrastructure/persistence/seed/seed.service';
import { DomainExceptionFilter } from '../../../backend/src/app/presentation/filters/domain-exception.filter';

export interface TestApp {
  app: INestApplication;
  moduleFixture: TestingModule;
}

export async function createApp(): Promise<TestApp> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new DomainExceptionFilter());

  await app.init();

  try {
    const seedService = app.get(SeedService);
    await seedService.seed();
  } catch (err) {
    console.error('Failed to seed database in tests', err);
  }

  return { app, moduleFixture };
}

export async function closeApp(testApp: TestApp) {
  const dataSource = testApp.app.get(DataSource);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  await testApp.app.close();
}
