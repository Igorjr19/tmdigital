import { DomainErrorCodes } from '../enums/domain-error-codes.enum';
import { BusinessRuleException } from '../exceptions/business-rule.exception';
import { BaseEntity } from './base.entity';

export interface CultureProps {
  name: string;
  currentPrice: number;
  plantingMonths?: number[];
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Culture extends BaseEntity {
  private _name: string;
  private _currentPrice: number;
  private _plantingMonths: number[];

  private constructor(props: CultureProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._currentPrice = props.currentPrice;
    this._plantingMonths = props.plantingMonths || [];
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
    if (this._plantingMonths.some((m) => m < 1 || m > 12)) {
      throw new BusinessRuleException(
        'Planting months must be between 1 and 12',
        DomainErrorCodes.CULTURE_PLANTING_MONTH_INVALID,
      );
    }
  }

  get name(): string {
    return this._name;
  }

  get currentPrice(): number {
    return this._currentPrice;
  }

  get plantingMonths(): number[] {
    return this._plantingMonths;
  }

  update(props: Partial<Omit<CultureProps, 'id' | 'createdAt' | 'updatedAt'>>) {
    if (props.name) this._name = props.name;
    if (props.currentPrice !== undefined)
      this._currentPrice = props.currentPrice;
    if (props.plantingMonths) {
      if (props.plantingMonths.some((m) => m < 1 || m > 12)) {
        throw new BusinessRuleException(
          'Planting months must be between 1 and 12',
          DomainErrorCodes.CULTURE_PLANTING_MONTH_INVALID,
        );
      }
      this._plantingMonths = props.plantingMonths;
    }
    this.updatedAt = new Date();
  }
}
