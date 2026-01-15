import { DomainErrorCodes } from '../enums/domain-error-codes.enum';
import { LeadStatus } from '../enums/lead-status.enum';
import { BusinessRuleException } from '../exceptions/business-rule.exception';
import { BaseEntity } from './base.entity';
import { RuralProperty } from './rural-property.entity';

export interface LeadProps {
  name: string;
  document: string;
  phone: string;
  currentSupplier?: string;
  status: LeadStatus;
  estimatedPotential: number;
  notes?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  properties?: RuralProperty[];
}

export class Lead extends BaseEntity {
  private _name: string;
  private _document: string;
  private _phone: string;
  private _currentSupplier?: string;
  private _status: LeadStatus;
  private _estimatedPotential: number;
  private _notes?: string;
  private _properties: RuralProperty[];

  private constructor(props: LeadProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);
    this._name = props.name;
    this._document = this.sanitizeDocument(props.document);
    this._phone = this.sanitizePhone(props.phone);
    this._currentSupplier = props.currentSupplier;
    this._status = props.status;
    this._estimatedPotential = props.estimatedPotential;
    this._notes = props.notes;
    this._properties = props.properties || [];

    this.validate();
  }

  public static create(props: LeadProps): Lead {
    return new Lead(props);
  }

  private validate(): void {
    if (!this._name) {
      throw new BusinessRuleException(
        'Name is required',
        DomainErrorCodes.LEAD_NAME_REQUIRED,
      );
    }
    if (!this._document) {
      throw new BusinessRuleException(
        'Document is required',
        DomainErrorCodes.LEAD_DOCUMENT_REQUIRED,
      );
    }
    if (!this._phone) {
      throw new BusinessRuleException(
        'Phone is required',
        DomainErrorCodes.LEAD_PHONE_REQUIRED,
      );
    }
    if (this._estimatedPotential < 0) {
      throw new BusinessRuleException(
        'Estimated potential cannot be negative',
        DomainErrorCodes.LEAD_ESTIMATED_POTENTIAL_NEGATIVE,
      );
    }
  }

  get name(): string {
    return this._name;
  }
  get document(): string {
    return this._document;
  }
  get phone(): string {
    return this._phone;
  }
  get currentSupplier(): string | undefined {
    return this._currentSupplier;
  }
  get status(): LeadStatus {
    return this._status;
  }
  get estimatedPotential(): number {
    return this._estimatedPotential;
  }
  get notes(): string | undefined {
    return this._notes;
  }
  get properties(): RuralProperty[] {
    return this._properties;
  }

  addProperty(property: RuralProperty): void {
    this._properties.push(property);
  }

  updateStatus(newStatus: LeadStatus): void {
    this._status = newStatus;
    this.updatedAt = new Date();
  }

  updateInformation(
    props: Partial<Omit<LeadProps, 'id' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name) {
      this._name = props.name;
    }

    if (props.document) {
      this._document = this.sanitizeDocument(props.document);
    }

    if (props.phone) {
      this._phone = this.sanitizePhone(props.phone);
    }

    if (props.currentSupplier !== undefined) {
      this._currentSupplier = props.currentSupplier;
    }

    if (props.estimatedPotential !== undefined) {
      if (props.estimatedPotential < 0) {
        throw new BusinessRuleException(
          'Estimated potential cannot be negative',
          DomainErrorCodes.LEAD_ESTIMATED_POTENTIAL_NEGATIVE,
        );
      }
      this._estimatedPotential = props.estimatedPotential;
    }

    if (props.notes !== undefined) {
      this._notes = props.notes;
    }

    this.updatedAt = new Date();
  }

  calculatePotential(): void {
    const totalPotential = this._properties.reduce(
      (total, property) => total + property.calculateTotalRevenue(),
      0,
    );
    this.updateInformation({ estimatedPotential: totalPotential });
  }

  restore(): void {
    this.deletedAt = undefined;
  }

  private sanitizeDocument(doc: string): string {
    return doc.replace(/\D/g, '');
  }

  private sanitizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
