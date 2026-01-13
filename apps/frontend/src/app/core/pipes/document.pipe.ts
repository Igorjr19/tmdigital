import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'document',
  standalone: true,
})
export class DocumentPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';

    const document = value.replace(/\D/g, '');

    if (document.length === 11) {
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (document.length === 14) {
      return document.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      );
    }

    return value;
  }
}
