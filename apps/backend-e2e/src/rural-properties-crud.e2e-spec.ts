import { INestApplication } from '@nestjs/common';
import { RuralProperty } from 'apps/backend/src/app/domain/entities/rural-property.entity';
import request from 'supertest';
import { CreateLeadDto } from '../../backend/src/app/application/dtos/create-lead.dto';
import { CreateRuralPropertyDto } from '../../backend/src/app/application/dtos/create-rural-property.dto';
import { LeadStatus } from '../../backend/src/app/domain/enums/lead-status.enum';
import { closeApp, createApp, TestApp } from './utils/app-factory';

describe('Rural Property CRUD (e2e)', () => {
  let testApp: TestApp;
  let app: INestApplication;
  let leadId: string;

  beforeAll(async () => {
    testApp = await createApp();
    app = testApp.app;
  });

  afterAll(async () => {
    await closeApp(testApp);
  });

  it('Establishment: Create Lead', async () => {
    const uniqueDoc = `CRUD${Date.now().toString().slice(-10)}`;
    const createLeadDto: CreateLeadDto = {
      name: 'Property CRUD Owner',
      document: uniqueDoc,
      status: LeadStatus.NEW,
      estimatedPotential: 1000,
    };

    const res = await request(app.getHttpServer())
      .post('/api/leads')
      .send(createLeadDto)
      .expect(201);
    leadId = res.body.id;
  });

  let prop1Id: string;
  let prop2Id: string;

  it('POST /leads/:id/properties should create properties', async () => {
    const dto1: CreateRuralPropertyDto = {
      leadId,
      name: 'Fazenda Norte',
      totalAreaHectares: 100,
      productiveAreaHectares: 80,
      city: 'Sinop',
      state: 'MT',
      location: { type: 'Point', coordinates: [0, 0] },
      cropProductions: [],
    };

    const res1 = await request(app.getHttpServer())
      .post(`/api/leads/${leadId}/properties`)
      .send(dto1)
      .expect(201);
    prop1Id = res1.body.id;

    const dto2: CreateRuralPropertyDto = {
      leadId,
      name: 'Fazenda Sul',
      totalAreaHectares: 200,
      productiveAreaHectares: 150,
      city: 'Sorriso',
      state: 'MT',
      location: { type: 'Point', coordinates: [0, 0] },
      cropProductions: [],
    };

    const res2 = await request(app.getHttpServer())
      .post(`/api/leads/${leadId}/properties`)
      .send(dto2)
      .expect(201);
    prop2Id = res2.body.id;
  });

  it('GET /leads/:id/properties should list all properties for lead', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/leads/${leadId}/properties`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    const names = res.body.map((p: RuralProperty) => p.name);
    expect(names).toContain('Fazenda Norte');
    expect(names).toContain('Fazenda Sul');
  });

  it('GET /leads/:leadId/properties/:id should return single property', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/leads/${leadId}/properties/${prop1Id}`)
      .expect(200);

    expect(res.body.id).toBe(prop1Id);
    expect(res.body.name).toBe('Fazenda Norte');
  });

  it('PATCH /leads/:leadId/properties/:id should update property', async () => {
    const updateDto = {
      name: 'Fazenda Norte Updated',
      totalAreaHectares: 120,
    };

    const res = await request(app.getHttpServer())
      .patch(`/api/leads/${leadId}/properties/${prop1Id}`)
      .send(updateDto)
      .expect(200);

    expect(res.body.name).toBe('Fazenda Norte Updated');
    expect(res.body.totalAreaHectares).toBe(120);

    const culturesRes = await request(app.getHttpServer())
      .get('/api/cultures')
      .expect(200);

    if (!Array.isArray(culturesRes.body) || culturesRes.body.length === 0) {
      throw new Error('No cultures found in DB even after seeding.');
    }
    const cultureId = culturesRes.body[0].id;

    const updateDtoWithCrops = {
      cropProductions: [
        {
          cultureId: cultureId,
          plantedAreaHectares: 50,
        },
      ],
    };

    const resCrops = await request(app.getHttpServer())
      .patch(`/api/leads/${leadId}/properties/${prop1Id}`)
      .send(updateDtoWithCrops)
      .expect(200);

    expect(resCrops.body.cropProductions).toHaveLength(1);
    expect(resCrops.body.cropProductions).toHaveLength(1);

    expect(resCrops.body.cropProductions[0].cultureId).toBe(cultureId);
  });

  it('DELETE /leads/:leadId/properties/:id should remove property', async () => {
    await request(app.getHttpServer())
      .delete(`/api/leads/${leadId}/properties/${prop2Id}`)
      .expect(204);

    const res = await request(app.getHttpServer())
      .get(`/api/leads/${leadId}/properties`)
      .expect(200);

    const ids = res.body.map((p: RuralProperty) => p.id);
    expect(ids).not.toContain(prop2Id);
  });
});
