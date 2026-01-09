import { DomainErrorCodes } from '../enums/domain-error-codes.enum';
import { DomainException } from './domain.exception';

export class ResourceNotFoundException extends DomainException {
  constructor(message: string, code: DomainErrorCodes) {
    super(message, code);
    this.name = 'ResourceNotFoundException';
  }
}
