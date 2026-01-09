import { DomainErrorCodes } from '../enums/domain-error-codes.enum';

export class DomainException extends Error {
  public readonly code: DomainErrorCodes;

  constructor(message: string, code: DomainErrorCodes) {
    super(message);
    this.name = 'DomainException';
    this.code = code;
  }
}
