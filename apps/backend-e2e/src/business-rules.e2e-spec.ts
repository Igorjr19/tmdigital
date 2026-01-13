import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateLeadDto } from '../../backend/src/app/application/dtos/create-lead.dto';
import { LeadStatus } from '../../backend/src/app/domain/enums/lead-status.enum';
import { closeApp, createApp, TestApp } from './utils/app-factory';

describe('Business Rules Adjustments (E2E)', () => {
  let testApp: TestApp;
  let app: INestApplication;

  beforeAll(async () => {
    testApp = await createApp();
    app = testApp.app;
  });

  afterAll(async () => {
    await closeApp(testApp);
  });

  describe('Lead Reactivation', () => {
    const uniqueDoc = `9${Date.now().toString().slice(-10)}`;
    const leadData: CreateLeadDto = {
      name: 'Reactivation Candidate',
      document: uniqueDoc,
      estimatedPotential: 50000,
      status: LeadStatus.NEW,
    };
    let leadId: string;

    it('should reactivate a soft-deleted lead', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/leads')
        .send(leadData)
        .expect(201);
      leadId = createRes.body.id;

      await request(app.getHttpServer())
        .delete(`/api/leads/${leadId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/api/leads/${leadId}`)
        .expect(404);

      const reactivateData = { ...leadData, name: 'Reactivated Lead' };
      const restoreRes = await request(app.getHttpServer())
        .post('/api/leads')
        .send(reactivateData)
        .expect(201);

      expect(restoreRes.body.id).toBe(leadId);
      expect(restoreRes.body.name).toBe('Reactivated Lead');

      await request(app.getHttpServer())
        .get(`/api/leads/${leadId}`)
        .expect(200);
    });
  });

  describe('Lead Document Update', () => {
    it('should allow updating the lead document', async () => {
      const uniqueDoc = `1${Date.now().toString().slice(-10)}`;
      const newDoc = `2${Date.now().toString().slice(-10)}`;
      const res = await request(app.getHttpServer())
        .post('/api/leads')
        .send({
          name: 'Doc Update Test',
          document: uniqueDoc,
          estimatedPotential: 1000,
        })
        .expect(201);
      const id = res.body.id;

      await request(app.getHttpServer())
        .patch(`/api/leads/${id}`)
        .send({ document: newDoc })
        .expect(200);

      const getRes = await request(app.getHttpServer())
        .get(`/api/leads/${id}`)
        .expect(200);
      expect(getRes.body.document).toBe(newDoc);
    });
  });

  describe('Optional Crop Productions', () => {
    it('should create property without crop productions', async () => {
      const uniqueDoc = `3${Date.now().toString().slice(-10)}`;
      const leadRes = await request(app.getHttpServer())
        .post('/api/leads')
        .send({
          name: 'Crop Test Lead',
          document: uniqueDoc,
          estimatedPotential: 0,
        })
        .expect(201);
      const leadId = leadRes.body.id;

      await request(app.getHttpServer())
        .post(`/api/leads/${leadId}/properties`)
        .send({
          leadId,
          name: 'Empty Crops Property',
          totalAreaHectares: 100,
          productiveAreaHectares: 50,
          city: 'Test City',
          state: 'PR',
          location: { type: 'Point', coordinates: [0, 0] },
        })
        .expect(201);
    });
  });
});
