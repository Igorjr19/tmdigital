import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPopupComponent {
  @Input() propertyName: string = '';
  @Input() culture: string = '';
  @Input() leadStatus: string = '';
  @Input() leadId: string = '';
  @Output() openDetails = new EventEmitter<void>();
}
