import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { closeApp, createApp, TestApp } from './utils/app-factory';

describe('GeoSpatial (e2e)', () => {
  let testApp: TestApp;
  let app: INestApplication;

  const uniqueSuffix = Date.now();

  let leadNearId: string;
  let leadFarId: string;

  beforeAll(async () => {
    testApp = await createApp();
    app = testApp.app;

    const lead1 = await request(app.getHttpServer())
      .post('/api/leads')
      .send({
        name: `Geo Lead 1 ${uniqueSuffix}`,
        document: `GEO1-${uniqueSuffix.toString().slice(-9)}`,
        status: 'NEW',
        estimatedPotential: 0,
      });

    leadNearId = lead1.body.id;

    await request(app.getHttpServer())
      .post(`/api/leads/${leadNearId}/properties`)
      .send({
        leadId: leadNearId,
        name: 'Near Farm',
        totalAreaHectares: 100,
        productiveAreaHectares: 100,
        city: 'Origin',
        state: 'GO',
        location: { type: 'Point', coordinates: [0, 0] },
      });

    const lead2 = await request(app.getHttpServer())
      .post('/api/leads')
      .send({
        name: `Geo Lead 2 ${uniqueSuffix}`,
        document: `GEO2-${uniqueSuffix.toString().slice(-9)}`,
        status: 'NEW',
        estimatedPotential: 0,
      });

    leadFarId = lead2.body.id;

    await request(app.getHttpServer())
      .post(`/api/leads/${leadFarId}/properties`)
      .send({
        leadId: leadFarId,
        name: 'Far Farm',
        totalAreaHectares: 100,
        productiveAreaHectares: 100,
        city: 'FarAway',
        state: 'GO',
        location: { type: 'Point', coordinates: [0, 1.0] },
      });
  });

  afterAll(async () => {
    if (leadNearId)
      await request(app.getHttpServer()).delete(`/api/leads/${leadNearId}`);
    if (leadFarId)
      await request(app.getHttpServer()).delete(`/api/leads/${leadFarId}`);
    await closeApp(testApp);
  });

  it('GET /api/leads/nearby should return only leads within range', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/leads/nearby')
      .query({
        lat: 0,
        long: 0,
        range: 50000,
      })
      .expect(200);

    const leads = res.body.data;

    const foundNear = leads.find((l: { id: string }) => l.id === leadNearId);
    const foundFar = leads.find((l: { id: string }) => l.id === leadFarId);

    expect(foundNear).toBeDefined();
    expect(foundFar).toBeUndefined();
  });

  it('GET /api/leads/nearby should return all leads within large range', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/leads/nearby')
      .query({
        lat: 0,
        long: 0,
        range: 200000,
      })
      .expect(200);

    const leads = res.body.data;

    const foundNear = leads.find((l: { id: string }) => l.id === leadNearId);
    const foundFar = leads.find((l: { id: string }) => l.id === leadFarId);

    expect(foundNear).toBeDefined();
    expect(foundFar).toBeDefined();
  });
});
