import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPopupComponent {
  @Input() propertyName: string = '';
  @Input() culture: string = '';
  @Input() leadStatus: string = '';
}
