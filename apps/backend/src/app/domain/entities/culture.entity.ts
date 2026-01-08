import { BaseEntity } from './base.entity';

export interface CultureProps {
  name: string;
  currentPrice: number;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Culture extends BaseEntity {
  private _name: string;
  private _currentPrice: number;

  private constructor(props: CultureProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._currentPrice = props.currentPrice;
    this.validate();
  }

  public static create(props: CultureProps): Culture {
    return new Culture(props);
  }

  private validate(): void {
    if (!this._name) throw new Error('Name is required');
    if (this._currentPrice < 0) throw new Error('Price cannot be negative');
  }

  get name(): string {
    return this._name;
  }
  get currentPrice(): number {
    return this._currentPrice;
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0) throw new Error('Price cannot be negative');
    this._currentPrice = newPrice;
    this.updatedAt = new Date();
  }
}
