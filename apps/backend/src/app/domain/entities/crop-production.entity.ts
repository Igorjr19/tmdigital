import { DomainErrorCodes } from '../enums/domain-error-codes.enum';
import { BusinessRuleException } from '../exceptions/business-rule.exception';
import { BaseEntity } from './base.entity';
import { Culture } from './culture.entity';
import type { RuralProperty } from './rural-property.entity';

export interface CropProductionProps {
  ruralPropertyId: string;
  cultureId: string;
  plantedAreaHectares: number;
  culture?: Culture;
  ruralProperty?: RuralProperty;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CropProduction extends BaseEntity {
  private _ruralPropertyId: string;
  private _cultureId: string;
  private _plantedAreaHectares: number;
  private _culture?: Culture;
  private _ruralProperty?: RuralProperty;

  private constructor(props: CropProductionProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._ruralPropertyId = props.ruralPropertyId;
    this._cultureId = props.cultureId;
    this._plantedAreaHectares = props.plantedAreaHectares;
    this._culture = props.culture;
    this._ruralProperty = props.ruralProperty;
    this.validate();
  }

  public static create(props: CropProductionProps): CropProduction {
    return new CropProduction(props);
  }

  private validate(): void {
    if (!this._ruralPropertyId)
      throw new BusinessRuleException(
        'Rural Property ID is required',
        DomainErrorCodes.CROP_PRODUCTION_RURAL_PROPERTY_ID_REQUIRED,
      );
    if (!this._cultureId)
      throw new BusinessRuleException(
        'Culture ID is required',
        DomainErrorCodes.CROP_PRODUCTION_CULTURE_ID_REQUIRED,
      );
    if (this._plantedAreaHectares < 0)
      throw new BusinessRuleException(
        'Planted area cannot be negative',
        DomainErrorCodes.CROP_PRODUCTION_PLANTED_AREA_NEGATIVE,
      );
  }

  get ruralPropertyId(): string {
    return this._ruralPropertyId;
  }
  get cultureId(): string {
    return this._cultureId;
  }
  get plantedAreaHectares(): number {
    return this._plantedAreaHectares;
  }
  get culture(): Culture | undefined {
    return this._culture;
  }
  get ruralProperty(): RuralProperty | undefined {
    return this._ruralProperty;
  }

  calculateRevenue(): number {
    if (!this._culture || this._culture.currentPrice === undefined) {
      return 0;
    }
    return this._plantedAreaHectares * this._culture.currentPrice;
  }
}
