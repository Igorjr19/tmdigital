import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatPhone } from '../utils/phone.utils';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  private el = inject(ElementRef);
  private control = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = formatPhone(input.value);

    input.value = value;
    this.control.control?.setValue(value, { emitEvent: false });
  }
}
