import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { LeadDto } from '../../../../api/model/models';
import { LeadWithProperties } from '../../models/lead.extension';
import { LeadPropertiesComponent } from '../lead-properties/lead-properties.component';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [CommonModule, LeadPropertiesComponent],
  template: `
    <div class="flex flex-column gap-3 p-3">
      <div class="grid">
        <div class="col-12 md:col-6">
          <span class="text-500 block mb-1">Nome</span>
          <span class="text-900 font-medium text-xl">{{ lead()?.name }}</span>
        </div>
        <div class="col-12 md:col-6">
          <span class="text-500 block mb-1">Documento</span>
          <span class="text-900 font-medium text-xl">{{
            lead()?.document
          }}</span>
        </div>
        <div class="col-12 md:col-6">
          <span class="text-500 block mb-1">Status</span>
          <span class="text-900 font-medium text-xl">{{ lead()?.status }}</span>
        </div>
        <div class="col-12 md:col-6">
          <span class="text-500 block mb-1">Potencial</span>
          <span class="text-900 font-medium text-xl">{{
            lead()?.estimatedPotential | currency: 'BRL'
          }}</span>
        </div>
        <div class="col-12">
          <span class="text-500 block mb-1">Observações</span>
          <p class="text-900 m-0 line-height-3">
            {{ lead()?.notes || 'Nenhuma observação.' }}
          </p>
        </div>
      </div>

      <div class="mt-3 border-top-1 surface-border pt-3">
        <app-lead-properties
          [leadId]="lead()?.id || ''"
          [properties]="leadProperties()"
          [readOnly]="true"
        ></app-lead-properties>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadDetailComponent {
  lead = signal<LeadDto | null>(null);

  @Input({ required: true })
  set leadData(value: LeadDto | null) {
    this.lead.set(value);
  }

  leadProperties = computed(() => {
    return (this.lead() as unknown as LeadWithProperties)?.properties || [];
  });
}
