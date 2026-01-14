import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { generateCPF } from '../../backend/src/app/utils/document.utils';
import { closeApp, createApp, TestApp } from './utils/app-factory';

describe('LeadController (e2e)', () => {
  let testApp: TestApp;
  let app: INestApplication;

  const uniqueDoc = generateCPF();

  const createLeadDto = {
    name: 'E2E Test Lead',
    document: uniqueDoc,
    status: 'NEW',
    estimatedPotential: 100000,
  };

  let createdLeadId: string;

  beforeAll(async () => {
    testApp = await createApp();
    app = testApp.app;
  });

  afterAll(async () => {
    await closeApp(testApp);
  });

  describe('/api/leads', () => {
    it('POST / should create a new lead', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/leads')
        .send(createLeadDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createLeadDto.name);
      createdLeadId = response.body.id;
    });

    it('GET / should return a paginated list of leads', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/leads')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('metadata');
      expect(Array.isArray(response.body.data)).toBe(true);

      const leads = response.body.data;
      const found = leads.find((l: { id: string }) => l.id === createdLeadId);
      expect(found).toBeDefined();
    });

    it('GET /:id should return the specific lead', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/leads/${createdLeadId}`)
        .expect(200);

      expect(response.body.id).toBe(createdLeadId);
      expect(response.body.document).toBe(
        createLeadDto.document.replace(/\D/g, ''),
      );
    });

    it('PATCH /:id should update the lead', async () => {
      const updateData = {
        name: 'Updated E2E Lead',
        notes: 'Updated via E2E test',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/leads/${createdLeadId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.notes).toBe(updateData.notes);
    });

    it('DELETE /:id should delete the lead', async () => {
      await request(app.getHttpServer())
        .delete(`/api/leads/${createdLeadId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/api/leads/${createdLeadId}`)
        .expect(404);
    });

    it('POST / should fail with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/api/leads')
        .send({ ...createLeadDto, document: '' })
        .expect(400);
    });
  });
});
