import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LeadDto } from '../../../../api/model/models';
import { I18N } from '../../../../core/i18n/i18n';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPopupComponent {
  protected readonly I18N = I18N;
  @Input() propertyName: string = '';
  @Input() culture: string = '';
  @Input() leadStatus: unknown = '';
  @Input() leadId: string = '';
  @Output() openDetails = new EventEmitter<void>();

  get translatedStatus(): string {
    const status = this.leadStatus as LeadDto.StatusEnum;
    return I18N.LEAD.STATUS[status] || (this.leadStatus as string);
  }
}
