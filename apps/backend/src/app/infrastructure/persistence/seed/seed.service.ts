import { faker } from '@faker-js/faker';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CropProduction } from '../../../domain/entities/crop-production.entity';
import { Culture } from '../../../domain/entities/culture.entity';
import { Lead } from '../../../domain/entities/lead.entity';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { CultureRepository } from '../../../domain/repositories/culture.repository';
import { LeadRepository } from '../../../domain/repositories/lead.repository';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly cultureRepository: CultureRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    this.logger.log('Checking for data seeds...');

    const culturesCount = await this.cultureRepository.count();
    let cultures: Culture[] = [];

    if (culturesCount === 0) {
      this.logger.log('Seeding Cultures...');
      cultures = await this.createCultures();
    } else {
      this.logger.log('Cultures already seeded.');
      cultures = await this.cultureRepository.find();
    }

    const leadsCount = (await this.leadRepository.findAll({ limit: 1 })).total;
    if (leadsCount === 0) {
      this.logger.log('Seeding Leads and Properties...');
      await this.createLeads(cultures);
    } else {
      this.logger.log('Leads already seeded.');
    }
  }

  private async createCultures(): Promise<Culture[]> {
    const cultureNames = ['Soja', 'Milho', 'Algodão'];
    const createdCultures: Culture[] = [];

    for (const name of cultureNames) {
      const culture = Culture.create({
        name,
        currentPrice: faker.number.float({
          min: 50,
          max: 200,
          fractionDigits: 2,
        }),
      });

      const savedCulture = await this.cultureRepository.save(culture);
      createdCultures.push(savedCulture);
    }
    return createdCultures;
  }

  private async createLeads(cultures: Culture[]) {
    const cityCoordinates = [
      {
        city: 'Uberlândia',
        state: 'MG',
        lat: -18.913664,
        long: -48.26656,
      },
      {
        city: 'Patos de Minas',
        state: 'MG',
        lat: -18.57889,
        long: -46.51806,
      },
      {
        city: 'Belo Horizonte',
        state: 'MG',
        lat: -19.912998,
        long: -43.940933,
      },
      {
        city: 'Paracatu',
        state: 'MG',
        lat: -17.221666,
        long: -46.91,
      },
      {
        city: 'Uberaba',
        state: 'MG',
        lat: -19.7502,
        long: -47.9325,
      },
    ];

    for (let i = 0; i < 20; i++) {
      const lead = Lead.create({
        name: faker.person.fullName(),
        document: faker.helpers.replaceSymbols('###.###.###-##'),
        status: faker.helpers.enumValue(LeadStatus),
        estimatedPotential: 0,
        notes: faker.lorem.sentence(),
      });

      const numProperties = faker.number.int({ min: 1, max: 3 });
      for (let j = 0; j < numProperties; j++) {
        const selectedCity = faker.helpers.arrayElement(cityCoordinates);

        const coordinateVariation = faker.number.float({ min: -0.2, max: 0.2 });
        const lat = selectedCity.lat + coordinateVariation;
        const long = selectedCity.long + coordinateVariation;

        const totalArea = faker.number.float({
          min: 50,
          max: 2000,
          fractionDigits: 2,
        });
        const productiveArea = faker.number.float({
          min: totalArea * 0.5,
          max: totalArea,
          fractionDigits: 2,
        });

        const names = ['Fazenda', 'Sítio', 'Estância', 'Rancho'];

        const property = RuralProperty.create({
          leadId: lead.id,
          name: `${faker.helpers.arrayElement(names)} ${faker.word.adjective()} ${faker.word.noun()}`,
          totalAreaHectares: totalArea,
          productiveAreaHectares: productiveArea,
          city: selectedCity.city,
          state: selectedCity.state,
          location: { type: 'Point', coordinates: [long, lat] },
        });

        const numCrops = faker.number.int({ min: 1, max: 3 });
        const shuffledCultures = faker.helpers.shuffle([...cultures]);

        for (let k = 0; k < numCrops; k++) {
          if (k >= shuffledCultures.length) break;
          const culture = shuffledCultures[k];
          const plantedArea = faker.number.float({
            min: 10,
            max: productiveArea / numCrops,
            fractionDigits: 2,
          });

          const crop = CropProduction.create({
            ruralPropertyId: property.id,
            cultureId: culture.id,
            plantedAreaHectares: plantedArea,
            culture: culture,
          });

          property.addCropProduction(crop);
        }

        lead.addProperty(property);
      }

      lead.calculatePotential();
      await this.leadRepository.save(lead);
    }
  }
}
