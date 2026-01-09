import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { BusinessRuleException } from '../../domain/exceptions/business-rule.exception';
import { DomainException } from '../../domain/exceptions/domain.exception';
import { ResourceAlreadyExistsException } from '../../domain/exceptions/resource-already-exists.exception';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof DomainException) {
      return this.handleDomainException(exception, response, request);
    }

    if (exception instanceof HttpException) {
      return this.handleFrameworkException(exception, response, request);
    }

    return this.handleUnknownException(exception, response, request);
  }

  private handleDomainException(
    exception: DomainException,
    response: Response,
    request: Request,
  ) {
    const status = this.resolveDomainStatus(exception);
    this.sendResponse(response, status, {
      statusCode: status,
      code: exception.code,
      message: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private handleFrameworkException(
    exception: HttpException,
    response: Response,
    request: Request,
  ) {
    const status = exception.getStatus();
    const responseBody = exception.getResponse();
    let code = 'INTERNAL_SERVER_ERROR';
    let message = exception.message;

    if (status === HttpStatus.BAD_REQUEST) {
      code = DomainErrorCodes.VALIDATION_ERROR;
      message = this.extractValidationMessage(responseBody) || message;
      if (message.includes('uuid')) {
        code = DomainErrorCodes.INVALID_UUID;
      }
    } else if (status === HttpStatus.NOT_FOUND) {
      code = DomainErrorCodes.RESOURCE_NOT_FOUND;
    } else if (status === HttpStatus.CONFLICT) {
      code = DomainErrorCodes.RESOURCE_ALREADY_EXISTS;
    }

    this.sendResponse(response, status, {
      statusCode: status,
      code,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private handleUnknownException(
    exception: Error,
    response: Response,
    request: Request,
  ) {
    this.logger.error(
      `Critical Error Caught: ${exception.message}`,
      exception.stack,
    );
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    this.sendResponse(response, status, {
      statusCode: status,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal Server Error',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveDomainStatus(exception: DomainException): number {
    if (exception instanceof ResourceNotFoundException) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof ResourceAlreadyExistsException) {
      return HttpStatus.CONFLICT;
    }
    if (exception instanceof BusinessRuleException) {
      return HttpStatus.BAD_REQUEST;
    }
    return HttpStatus.BAD_REQUEST;
  }

  private extractValidationMessage(
    responseBody: string | object,
  ): string | null {
    if (typeof responseBody === 'object' && responseBody !== null) {
      const msg = (responseBody as Error).message;
      if (Array.isArray(msg)) {
        return msg.join('; ');
      } else if (typeof msg === 'string') {
        return msg;
      }
    }
    return null;
  }

  private sendResponse(response: Response, status: number, body: object) {
    response.status(status).json(body);
  }
}
