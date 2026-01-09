import { Point } from 'geojson';
import { DomainErrorCodes } from '../enums/domain-error-codes.enum';
import { BusinessRuleException } from '../exceptions/business-rule.exception';
import { BaseEntity } from './base.entity';
import { CropProduction } from './crop-production.entity';

export interface RuralPropertyProps {
  leadId: string;
  name: string;
  totalAreaHectares: number;
  productiveAreaHectares: number;
  location: Point;
  city: string;
  state: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  cropProductions?: CropProduction[];
}

export class RuralProperty extends BaseEntity {
  private _leadId: string;
  private _name: string;
  private _totalAreaHectares: number;
  private _productiveAreaHectares: number;
  private _location: Point;
  private _city: string;
  private _state: string;
  private _cropProductions: CropProduction[];

  private constructor(props: RuralPropertyProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._leadId = props.leadId;
    this._name = props.name;
    this._totalAreaHectares = props.totalAreaHectares;
    this._productiveAreaHectares = props.productiveAreaHectares;
    this._location = props.location;
    this._city = props.city;
    this._state = props.state;
    this._cropProductions = props.cropProductions || [];

    this.validate();
  }

  public static create(props: RuralPropertyProps): RuralProperty {
    return new RuralProperty(props);
  }

  private validate(): void {
    if (!this._leadId)
      throw new BusinessRuleException(
        'Lead ID is required',
        DomainErrorCodes.RURAL_PROPERTY_LEAD_ID_REQUIRED,
      );
    if (!this._name)
      throw new BusinessRuleException(
        'Name is required',
        DomainErrorCodes.RURAL_PROPERTY_NAME_REQUIRED,
      );
    if (this._totalAreaHectares < 0)
      throw new BusinessRuleException(
        'Total area cannot be negative',
        DomainErrorCodes.RURAL_PROPERTY_TOTAL_AREA_NEGATIVE,
      );
    if (this._productiveAreaHectares < 0)
      throw new BusinessRuleException(
        'Productive area cannot be negative',
        DomainErrorCodes.RURAL_PROPERTY_PRODUCTIVE_AREA_NEGATIVE,
      );
    if (this._productiveAreaHectares > this._totalAreaHectares) {
      throw new BusinessRuleException(
        'Productive area cannot be larger than total area',
        DomainErrorCodes.RURAL_PROPERTY_PRODUCTIVE_AREA_EXCEEDS_TOTAL,
      );
    }
    if (!this._location)
      throw new BusinessRuleException(
        'Location is required',
        DomainErrorCodes.RURAL_PROPERTY_LOCATION_REQUIRED,
      );
    if (!this._city)
      throw new BusinessRuleException(
        'City is required',
        DomainErrorCodes.RURAL_PROPERTY_CITY_REQUIRED,
      );
    if (!this._state)
      throw new BusinessRuleException(
        'State is required',
        DomainErrorCodes.RURAL_PROPERTY_STATE_REQUIRED,
      );
  }

  get leadId(): string {
    return this._leadId;
  }
  get name(): string {
    return this._name;
  }
  get totalAreaHectares(): number {
    return this._totalAreaHectares;
  }
  get productiveAreaHectares(): number {
    return this._productiveAreaHectares;
  }
  get location(): Point {
    return this._location;
  }
  get city(): string {
    return this._city;
  }
  get state(): string {
    return this._state;
  }
  get cropProductions(): CropProduction[] {
    return this._cropProductions;
  }

  addCropProduction(cropProduction: CropProduction): void {
    this._cropProductions.push(cropProduction);
  }

  updateInformation(
    props: Partial<
      Omit<
        RuralPropertyProps,
        'id' | 'createdAt' | 'updatedAt' | 'leadId' | 'cropProductions'
      >
    >,
  ): void {
    if (props.name) this._name = props.name;
    if (props.totalAreaHectares !== undefined) {
      if (props.totalAreaHectares < 0)
        throw new BusinessRuleException(
          'Total area cannot be negative',
          DomainErrorCodes.RURAL_PROPERTY_TOTAL_AREA_NEGATIVE,
        );
      this._totalAreaHectares = props.totalAreaHectares;
    }
    if (props.productiveAreaHectares !== undefined) {
      if (props.productiveAreaHectares < 0)
        throw new BusinessRuleException(
          'Productive area cannot be negative',
          DomainErrorCodes.RURAL_PROPERTY_PRODUCTIVE_AREA_NEGATIVE,
        );
      this._productiveAreaHectares = props.productiveAreaHectares;
    }
    if (
      this._productiveAreaHectares !== undefined &&
      this._totalAreaHectares !== undefined &&
      this._productiveAreaHectares > this._totalAreaHectares
    ) {
      throw new BusinessRuleException(
        'Productive area cannot be larger than total area',
        DomainErrorCodes.RURAL_PROPERTY_PRODUCTIVE_AREA_EXCEEDS_TOTAL,
      );
    }

    if (props.location) this._location = props.location;
    if (props.city) this._city = props.city;
    if (props.state) this._state = props.state;

    this.updatedAt = new Date();
  }

  calculateTotalRevenue(): number {
    return this._cropProductions.reduce(
      (total, production) => total + production.calculateRevenue(),
      0,
    );
  }
}
