import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LeadModule } from './modules/lead/lead.module';
import { DatabaseModule } from './shared/infrastructure/persistence/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    LeadModule,
  ],
})
export class AppModule {}
