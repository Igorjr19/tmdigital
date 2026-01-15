import { Pipe, PipeTransform } from '@angular/core';
import { formatPhone } from '../utils/phone.utils';

@Pipe({
  name: 'phone',
  standalone: true,
})
export class PhonePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return formatPhone(value);
  }
}
