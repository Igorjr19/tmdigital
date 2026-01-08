import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CultureModule } from './modules/culture/culture.module';
import { LeadModule } from './modules/lead/lead.module';
import { RuralPropertyModule } from './modules/rural-property/rural-property.module';
import { DatabaseModule } from './shared/infrastructure/persistence/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    LeadModule,
    RuralPropertyModule,
    CultureModule,
  ],
})
export class AppModule {}
