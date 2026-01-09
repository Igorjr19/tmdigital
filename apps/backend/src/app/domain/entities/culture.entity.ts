import { DomainErrorCodes } from '../enums/domain-error-codes.enum';
import { BusinessRuleException } from '../exceptions/business-rule.exception';
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
    if (!this._name)
      throw new BusinessRuleException(
        'Name is required',
        DomainErrorCodes.CULTURE_NAME_REQUIRED,
      );
    if (this._currentPrice < 0)
      throw new BusinessRuleException(
        'Price cannot be negative',
        DomainErrorCodes.CULTURE_PRICE_NEGATIVE,
      );
  }

  get name(): string {
    return this._name;
  }
  get currentPrice(): number {
    return this._currentPrice;
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0)
      throw new BusinessRuleException(
        'Price cannot be negative',
        DomainErrorCodes.CULTURE_PRICE_NEGATIVE,
      );
    this._currentPrice = newPrice;
    this.updatedAt = new Date();
  }
}
