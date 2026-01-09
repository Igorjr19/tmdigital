import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddRuralPropertyUseCase } from './application/use-cases/add-rural-property.use-case';
import { CalculateLeadScoreUseCase } from './application/use-cases/calculate-lead-score.use-case';
import { CreateLeadUseCase } from './application/use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from './application/use-cases/delete-lead.use-case';
import { DeleteRuralPropertyUseCase } from './application/use-cases/delete-rural-property.use-case';
import { FindAllLeadsUseCase } from './application/use-cases/find-all-leads.use-case';
import { FindOneLeadUseCase } from './application/use-cases/find-one-lead.use-case';
import { GetNearbyLeadsUseCase } from './application/use-cases/get-nearby-leads.use-case';
import { UpdateLeadUseCase } from './application/use-cases/update-lead.use-case';
import { UpdateRuralPropertyUseCase } from './application/use-cases/update-rural-property.use-case';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { SeedModule } from './infrastructure/persistence/seed/seed.module';
import { LeadController } from './presentation/controllers/lead.controller';
import { RuralPropertyController } from './presentation/controllers/rural-property.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PersistenceModule,
    SeedModule,
    LoggerModule,
  ],
  controllers: [LeadController, RuralPropertyController],
  providers: [
    CreateLeadUseCase,
    FindAllLeadsUseCase,
    FindOneLeadUseCase,
    UpdateLeadUseCase,
    DeleteLeadUseCase,
    CalculateLeadScoreUseCase,
    GetNearbyLeadsUseCase,
    AddRuralPropertyUseCase,
    UpdateRuralPropertyUseCase,
    DeleteRuralPropertyUseCase,
  ],
})
export class AppModule {}
