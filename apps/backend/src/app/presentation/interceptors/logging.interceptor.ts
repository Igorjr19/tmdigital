import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly SENSITIVE_KEYS = [
    'document',
    'password',
    'token',
    'authorization',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    const requestDetails = {
      body: this.maskSensitiveData(body),
      query: this.maskSensitiveData(query),
      params: this.maskSensitiveData(params),
    };

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - now;
          this.logger.log({
            message: `✓ Response Success: ${method} ${url} - ${response.statusCode}`,
            context: 'Response',
            duration: `${duration}ms`,
            request: requestDetails,
            response: this.maskSensitiveData(data),
          });
        },
        error: (error: unknown) => {
          const duration = Date.now() - now;
          const statusCode = (error as { status?: number }).status || 500;
          const message = (error as Error).message || 'Unknown error';
          const stack = (error as Error).stack;

          this.logger.error({
            message: `✗ Response Error: ${method} ${url} - ${statusCode}`,
            context: 'Response',
            duration: `${duration}ms`,
            request: requestDetails,
            error: message,
            stack: stack,
          });
        },
      }),
    );
  }

  private maskSensitiveData(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (data instanceof Date) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.maskSensitiveData(item));
    }

    const maskedData = { ...(data as Record<string, unknown>) };

    for (const key in maskedData) {
      if (Object.prototype.hasOwnProperty.call(maskedData, key)) {
        if (
          this.SENSITIVE_KEYS.some((sensitive) =>
            key.toLowerCase().includes(sensitive),
          )
        ) {
          if (key === 'document') {
            maskedData[key] = this.maskDocument(maskedData[key] as string);
          } else {
            maskedData[key] = '***SENSITIVE***';
          }
        } else if (typeof maskedData[key] === 'object') {
          maskedData[key] = this.maskSensitiveData(maskedData[key]);
        }
      }
    }

    return maskedData;
  }

  private maskDocument(document: string): string {
    if (document.replace(/\D/g, '').length !== 11) {
      return document;
    }

    return `${document.replace(/\D/g, '').slice(0, 3) + '.***.***-' + document.slice(-2)}`;
  }
}
