import { RuralProperty } from '../entities/rural-property.entity';

export abstract class RuralPropertyRepository {
  abstract save(ruralProperty: RuralProperty): Promise<RuralProperty>;
  abstract findById(id: string): Promise<RuralProperty | null>;
  abstract findByIdWithRelations(id: string): Promise<RuralProperty | null>;
  abstract update(ruralProperty: RuralProperty): Promise<RuralProperty>;
  abstract deleteCropProductions(ruralPropertyId: string): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
