import { Culture } from '../entities/culture.entity';

export abstract class CultureRepository {
  abstract save(culture: Culture): Promise<Culture>;
  abstract count(): Promise<number>;
  abstract findAll(): Promise<Culture[]>;
  abstract findPlantingIn(months: number[]): Promise<Culture[]>;
}
