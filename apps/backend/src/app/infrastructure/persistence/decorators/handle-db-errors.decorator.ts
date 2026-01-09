import { DomainErrorCodes } from '../../../domain/enums/domain-error-codes.enum';
import { BusinessRuleException } from '../../../domain/exceptions/business-rule.exception';
import { ResourceAlreadyExistsException } from '../../../domain/exceptions/resource-already-exists.exception';

import { PostgresErrorCodes } from '../enums/postgres-error-codes.enum';

type DatabaseError = Error & {
  code?: string;
  detail?: string;
  constraint?: string;
};

export function HandleDbErrors() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const dbError = error as DatabaseError;

        if (dbError.code === PostgresErrorCodes.UNIQUE_VIOLATION) {
          throw new ResourceAlreadyExistsException(
            `Resource already exists: ${dbError.detail || 'Unique constraint violation'}`,
            DomainErrorCodes.RESOURCE_ALREADY_EXISTS,
          );
        }

        if (dbError.code === PostgresErrorCodes.FOREIGN_KEY_VIOLATION) {
          throw new BusinessRuleException(
            `Operation failed due to related data constraint: ${dbError.detail || 'check related resources'}`,
            DomainErrorCodes.VALIDATION_ERROR,
          );
        }

        throw error;
      }
    };

    return descriptor;
  };
}
