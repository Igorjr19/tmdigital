import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let detail = 'Ocorreu um erro inesperado.';
      let summary = 'Erro';

      if (error.status === 400) {
        summary = 'Dados Inválidos';
        detail = error.error?.message || 'Verifique os dados enviados.';
      } else if (error.status === 404) {
        summary = 'Não Encontrado';
        detail = error.error?.message || 'Recurso não encontrado.';
      } else if (error.status === 500) {
        summary = 'Erro no Servidor';
        detail = 'Tente novamente mais tarde.';
      }

      messageService.add({
        severity: 'error',
        summary,
        detail,
        life: 5000,
      });

      return throwError(() => error);
    }),
  );
};
