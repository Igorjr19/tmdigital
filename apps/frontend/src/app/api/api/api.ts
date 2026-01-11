export * from './cultures.service';
import { CulturesService } from './cultures.service';
export * from './leads.service';
import { LeadsService } from './leads.service';
export * from './rural-properties.service';
import { RuralPropertiesService } from './rural-properties.service';
export const APIS = [CulturesService, LeadsService, RuralPropertiesService];
