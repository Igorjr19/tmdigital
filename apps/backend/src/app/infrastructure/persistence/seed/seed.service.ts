import { faker } from '@faker-js/faker';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
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
    private readonly configService: ConfigService,
    private readonly cultureRepository: CultureRepository,
    private readonly leadRepository: LeadRepository,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    if (this.configService.get('SEED_ENABLED', 'false') === 'true') {
      await this.seed();
    }
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
      cultures = await this.cultureRepository.findAll();
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
    const culturesData = [
      { name: 'Soja', months: [10, 11, 12, 1] },
      { name: 'Milho', months: [1, 2, 3, 9, 10] },
      { name: 'Algodão', months: [11, 12, 1] },
    ];
    const createdCultures: Culture[] = [];

    for (const data of culturesData) {
      const culture = Culture.create({
        name: data.name,
        currentPrice: faker.number.float({
          min: 50,
          max: 200,
          fractionDigits: 2,
        }),
        plantingMonths: data.months,
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
      {
        city: 'Sete Lagoas',
        state: 'MG',
        lat: -19.4658,
        long: -44.2466,
      },
      {
        city: 'Montes Claros',
        state: 'MG',
        lat: -16.7321,
        long: -43.865,
      },
      {
        city: 'Teófilo Otoni',
        state: 'MG',
        lat: -17.8575,
        long: -41.5053,
      },
      {
        city: 'Governador Valadares',
        state: 'MG',
        lat: -18.8508,
        long: -41.9489,
      },
      {
        city: 'Lavras',
        state: 'MG',
        lat: -21.245,
        long: -45,
      },
      {
        city: 'Varginha',
        state: 'MG',
        lat: -21.5508,
        long: -45.43,
      },
    ];

    const suppliers = [
      'Concorrente A',
      'Concorrente B',
      'Concorrente C',
      'Concorrente D',
      'Concorrente E',
      'Concorrente F',
    ];

    for (let i = 0; i < 200; i++) {
      const isStale = i % 10 === 0;
      const isConverted = i % 5 === 0;

      let status = faker.helpers.enumValue(LeadStatus);
      let updatedAt = new Date();
      const createdAt = faker.date.past({ years: 1 });
      let currentSupplier = faker.datatype.boolean()
        ? faker.helpers.arrayElement(suppliers)
        : undefined;

      if (isStale) {
        status = LeadStatus.QUALIFIED;
        updatedAt = faker.date.past({
          years: 1,
          refDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        });
      } else if (isConverted) {
        status = LeadStatus.CONVERTED;
        updatedAt = faker.date.recent({ days: 30 });
        currentSupplier = 'TMDigital';
      } else {
        updatedAt = faker.date.between({ from: createdAt, to: new Date() });
      }

      const isCompany = faker.datatype.boolean();
      const name = isCompany ? faker.company.name() : faker.person.fullName();
      const document = isCompany
        ? faker.helpers.replaceSymbols('##.###.###/####-##')
        : faker.helpers.replaceSymbols('###.###.###-##');

      const lead = Lead.create({
        name,
        document,
        status: status,
        currentSupplier: currentSupplier,
        estimatedPotential: 0,
        notes: faker.lorem.sentence(),
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const numProperties = faker.number.int({ min: 1, max: 3 });
      for (let j = 0; j < numProperties; j++) {
        const selectedCity = faker.helpers.arrayElement(cityCoordinates);

        const variation = 0.5;
        const longVariation = faker.number.float({
          min: -variation,
          max: variation,
        });
        const latVariation = faker.number.float({
          min: 4 * -variation,
          max: 4 * variation,
        });
        const lat = selectedCity.lat + latVariation;
        const long = selectedCity.long + longVariation;

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
          name: `${faker.helpers.arrayElement(names)} ${faker.company.name()}`,
          totalAreaHectares: totalArea,
          productiveAreaHectares: productiveArea,
          city: selectedCity.city,
          state: selectedCity.state,
          location: { type: 'Point', coordinates: [long, lat] },
          createdAt: createdAt,
          updatedAt: updatedAt,
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

      // FORCE update date logic
      if (isStale) {
        // Use raw query to bypass TypeORM's UpdateDateColumn behavior
        await this.dataSource.query(
          'UPDATE leads SET updated_at = $1 WHERE id = $2',
          [updatedAt, lead.id],
        );
        this.logger.log(`Forced stale date for lead ${lead.id}: ${updatedAt}`);
      }
    }
  }
}
