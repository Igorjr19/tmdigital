import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculateLeadScoreUseCase } from './application/use-cases/calculate-lead-score.use-case';
import { CreateLeadUseCase } from './application/use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from './application/use-cases/delete-lead.use-case';
import { FindAllLeadsUseCase } from './application/use-cases/find-all-leads.use-case';
import { FindOneLeadUseCase } from './application/use-cases/find-one-lead.use-case';
import { GetNearbyLeadsUseCase } from './application/use-cases/get-nearby-leads.use-case';
import { UpdateLeadUseCase } from './application/use-cases/update-lead.use-case';
import { LeadRepository } from './domain/repositories/lead.repository';
import { LeadSchema } from './infrastructure/persistence/entities/lead.schema';
import { TypeOrmLeadRepository } from './infrastructure/persistence/repositories/typeorm-lead.repository';
import { LeadController } from './presentation/controllers/lead.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeadSchema])],
  controllers: [LeadController],
  providers: [
    {
      provide: LeadRepository,
      useClass: TypeOrmLeadRepository,
    },
    CreateLeadUseCase,
    FindAllLeadsUseCase,
    FindOneLeadUseCase,
    UpdateLeadUseCase,
    DeleteLeadUseCase,
    CalculateLeadScoreUseCase,
    GetNearbyLeadsUseCase,
  ],
  exports: [
    CreateLeadUseCase,
    FindAllLeadsUseCase,
    FindOneLeadUseCase,
    UpdateLeadUseCase,
    DeleteLeadUseCase,
    CalculateLeadScoreUseCase,
    GetNearbyLeadsUseCase,
  ],
})
export class LeadModule {}
