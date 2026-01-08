import { Point } from 'geojson';
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
    if (!this._leadId) throw new Error('Lead ID is required');
    if (!this._name) throw new Error('Name is required');
    if (this._totalAreaHectares < 0)
      throw new Error('Total area cannot be negative');
    if (this._productiveAreaHectares < 0)
      throw new Error('Productive area cannot be negative');
    if (this._productiveAreaHectares > this._totalAreaHectares) {
      throw new Error('Productive area cannot be larger than total area');
    }
    if (!this._location) throw new Error('Location is required');
    if (!this._city) throw new Error('City is required');
    if (!this._state) throw new Error('State is required');
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

  calculateTotalRevenue(): number {
    return this._cropProductions.reduce(
      (total, production) => total + production.calculateRevenue(),
      0,
    );
  }
}
