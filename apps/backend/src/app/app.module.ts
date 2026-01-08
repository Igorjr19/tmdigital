import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalculateLeadScoreUseCase } from './application/use-cases/calculate-lead-score.use-case';
import { CreateLeadUseCase } from './application/use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from './application/use-cases/delete-lead.use-case';
import { FindAllLeadsUseCase } from './application/use-cases/find-all-leads.use-case';
import { FindOneLeadUseCase } from './application/use-cases/find-one-lead.use-case';
import { GetNearbyLeadsUseCase } from './application/use-cases/get-nearby-leads.use-case';
import { UpdateLeadUseCase } from './application/use-cases/update-lead.use-case';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { LeadController } from './presentation/controllers/lead.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PersistenceModule,
  ],
  controllers: [LeadController],
  providers: [
    CreateLeadUseCase,
    FindAllLeadsUseCase,
    FindOneLeadUseCase,
    UpdateLeadUseCase,
    DeleteLeadUseCase,
    CalculateLeadScoreUseCase,
    GetNearbyLeadsUseCase,
  ],
})
export class AppModule {}
