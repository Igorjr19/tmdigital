import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { closeApp, createApp, TestApp } from './utils/app-factory';

describe('CultureController (e2e)', () => {
  let testApp: TestApp;
  let app: INestApplication;

  beforeAll(async () => {
    testApp = await createApp();
    app = testApp.app;
  });

  afterAll(async () => {
    await closeApp(testApp);
  });

  describe('/api/cultures (GET)', () => {
    it('should return a list of available cultures', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/cultures')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const firstCulture = response.body[0];
      expect(firstCulture).toHaveProperty('id');
      expect(firstCulture).toHaveProperty('name');
      expect(firstCulture).toHaveProperty('currentPrice');
    });
  });
});
