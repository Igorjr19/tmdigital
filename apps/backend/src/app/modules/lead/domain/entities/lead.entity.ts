import { BaseEntity } from '../../../../shared/domain/base.entity';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

export interface LeadProps {
  name: string;
  document: string; // CPF or CNPJ
  currentSupplier?: string;
  status: LeadStatus;
  estimatedPotentialRevenue: number;
  notes?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Lead extends BaseEntity {
  private _name: string;
  private _document: string;
  private _currentSupplier?: string;
  private _status: LeadStatus;
  private _estimatedPotentialRevenue: number;
  private _notes?: string;

  private constructor(props: LeadProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._currentSupplier = props.currentSupplier;
    this._status = props.status;
    this._estimatedPotentialRevenue = props.estimatedPotentialRevenue;
    this._notes = props.notes;

    this.validate();
  }

  public static create(props: LeadProps): Lead {
    return new Lead(props);
  }

  private validate(): void {
    if (!this._name) {
      throw new Error('Name is required');
    }
    if (!this._document) {
      throw new Error('Document is required');
    }
    if (this._estimatedPotentialRevenue < 0) {
      throw new Error('Estimated potential revenue cannot be negative');
    }
  }

  // Getters
  get name(): string {
    return this._name;
  }
  get document(): string {
    return this._document;
  }
  get currentSupplier(): string | undefined {
    return this._currentSupplier;
  }
  get status(): LeadStatus {
    return this._status;
  }
  get estimatedPotentialRevenue(): number {
    return this._estimatedPotentialRevenue;
  }
  get notes(): string | undefined {
    return this._notes;
  }

  // Setters (Domain behaviors)
  updateStatus(newStatus: LeadStatus): void {
    // Add domain logic here if needed (e.g. state transition validation)
    this._status = newStatus;
    this.updatedAt = new Date();
  }

  updateInformation(
    props: Partial<Omit<LeadProps, 'id' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name) this._name = props.name;
    if (props.currentSupplier !== undefined)
      this._currentSupplier = props.currentSupplier;
    if (props.estimatedPotentialRevenue !== undefined) {
      if (props.estimatedPotentialRevenue < 0)
        throw new Error('Estimated potential revenue cannot be negative');
      this._estimatedPotentialRevenue = props.estimatedPotentialRevenue;
    }
    if (props.notes !== undefined) this._notes = props.notes;

    this.updatedAt = new Date();
  }
}
