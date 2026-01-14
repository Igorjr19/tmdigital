import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { generateCPF } from '../../backend/src/app/utils/document.utils';
import { closeApp, createApp, TestApp } from './utils/app-factory';

describe('RuralPropertyController (e2e)', () => {
  let testApp: TestApp;
  let app: INestApplication;

  const uniqueSuffix = Date.now();

  const leadData = {
    name: `Property Owner ${uniqueSuffix}`,
    document: generateCPF(),
    status: 'QUALIFIED',
    estimatedPotential: 500000,
  };

  let leadId: string;
  let propertyId: string;
  let cultureId: string;

  beforeAll(async () => {
    testApp = await createApp();
    app = testApp.app;

    const cultureRes = await request(app.getHttpServer()).get('/api/cultures');
    cultureId = cultureRes.body[0].id;

    const leadRes = await request(app.getHttpServer())
      .post('/api/leads')
      .send(leadData);
    leadId = leadRes.body.id;
  });

  afterAll(async () => {
    if (leadId) {
      await request(app.getHttpServer()).delete(`/api/leads/${leadId}`);
    }
    await closeApp(testApp);
  });

  describe('Property Management', () => {
    it('POST /api/leads/:id/properties should add a property', async () => {
      const propertyData = {
        leadId,
        name: 'Fazenda E2E',
        totalAreaHectares: 1000,
        productiveAreaHectares: 800,
        city: 'Farmville',
        state: 'GO',
        location: {
          type: 'Point',
          coordinates: [-49.25, -16.6],
        },
      };

      const response = await request(app.getHttpServer())
        .post(`/api/leads/${leadId}/properties`)
        .send(propertyData)
        .send(propertyData);

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(propertyData.name);
      expect(response.body.leadId).toBe(leadId);
      propertyId = response.body.id;
    });

    it('PATCH /api/leads/:leadId/properties/:id should update property and crop productions', async () => {
      const updateData = {
        name: 'Fazenda E2E Updated',
        cropProductions: [
          {
            cultureId: cultureId,
            plantedAreaHectares: 500,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/leads/${leadId}/properties/${propertyId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.cropProductions).toHaveLength(1);
      expect(response.body.cropProductions[0].cultureId).toBe(cultureId);
      expect(Number(response.body.cropProductions[0].plantedAreaHectares)).toBe(
        500,
      );
    });

    it('PATCH /api/leads/:leadId/properties/:id should fail if planted area exceeds productive area', async () => {
      const updateData = {
        cropProductions: [
          {
            cultureId: cultureId,
            plantedAreaHectares: 900,
          },
        ],
      };

      await request(app.getHttpServer())
        .patch(`/api/leads/${leadId}/properties/${propertyId}`)
        .send(updateData)
        .expect(400);
    });

    it('PATCH /api/leads/:leadId/properties/:id should fail if wrong leadId', async () => {
      const fakeLeadId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .patch(`/api/leads/${fakeLeadId}/properties/${propertyId}`)
        .send({})
        .expect(400);
    });

    it('DELETE /api/leads/:leadId/properties/:id should delete property', async () => {
      await request(app.getHttpServer())
        .delete(`/api/leads/${leadId}/properties/${propertyId}`)
        .expect(204);

      await request(app.getHttpServer())
        .patch(`/api/leads/${leadId}/properties/${propertyId}`)
        .send({})
        .expect(404);
    });
  });
});
