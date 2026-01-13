import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { LeadDto } from '../../../../api/model/models';
import { DocumentPipe } from '../../../../core/pipes/document.pipe';
import { LeadWithProperties } from '../../models/lead.extension';
import { LeadPropertiesComponent } from '../lead-properties/lead-properties.component';

import { CurrencyPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { I18N } from '../../../../core/i18n/i18n';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TagModule,
    LeadPropertiesComponent,
    CurrencyPipe,
    DocumentPipe,
  ],
  template: `
    <div class="flex flex-column gap-3 p-3">
      <div class="grid">
        <div class="col-12 md:col-6">
          <span class="text-500 block mb-1">{{
            I18N.LEAD.FORM.LABELS.NAME
          }}</span>
          <span class="text-900 font-medium text-xl">{{ lead()?.name }}</span>
        </div>
        <div class="col-12 md:col-6">
          <span class="text-500 block mb-1">{{
            I18N.LEAD.FORM.LABELS.DOCUMENT
          }}</span>
          <span class="text-900 font-medium text-xl">{{
            lead()?.document | document
          }}</span>
        </div>
        <div class="col-12 md:col-6">
          <span class="text-500 block mb-1">{{
            I18N.LEAD.FORM.LABELS.STATUS
          }}</span>
          <span class="text-900 font-medium text-xl">{{
            lead()?.status ? $any(I18N.LEAD.STATUS)[lead()!.status] : '-'
          }}</span>
        </div>
        <div class="col-12 md:col-6">
          <span class="text-500 block mb-1">{{
            I18N.LEAD.FORM.LABELS.POTENTIAL
          }}</span>
          <span class="text-900 font-medium text-xl">{{
            lead()?.estimatedPotential | currency: 'BRL'
          }}</span>
        </div>
        <div class="col-12">
          <span class="text-500 block mb-1">{{
            I18N.LEAD.FORM.LABELS.NOTES
          }}</span>
          <p class="text-900 m-0 line-height-3">
            {{ lead()?.notes || I18N.LEAD.DETAIL.NO_NOTES }}
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
  protected readonly I18N = I18N;
  lead = signal<LeadDto | null>(null);

  @Input({ required: true })
  set leadData(value: LeadDto | null) {
    this.lead.set(value);
  }

  leadProperties = computed(() => {
    return (this.lead() as unknown as LeadWithProperties)?.properties || [];
  });
}
