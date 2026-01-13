import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeadFormComponent } from '../../lead-form/lead-form.component';
import { LeadsFacadeService } from '../../services/leads.facade';
import { LeadDetailComponent } from '../lead-detail/lead-detail.component';

import { I18N } from '../../../../core/i18n/i18n';

type DialogMode = 'VIEW' | 'EDIT';

@Component({
  selector: 'app-lead-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, LeadDetailComponent, LeadFormComponent],
  template: `
    <div class="flex flex-column h-full">
      @if (mode() === 'VIEW') {
        <div class="flex justify-content-end gap-2 mb-2 px-3 pt-3">
          <p-button
            [label]="I18N.COMMON.EDIT"
            icon="pi pi-pencil"
            (onClick)="enableEdit()"
          ></p-button>
          <p-button
            [label]="I18N.COMMON.CLOSE"
            icon="pi pi-times"
            severity="secondary"
            (onClick)="close()"
          ></p-button>
        </div>

        @if (loading()) {
          <div class="flex justify-content-center p-5">
            <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        } @else {
          <app-lead-detail [leadData]="lead()"></app-lead-detail>
        }
      } @else {
        <app-lead-form
          [leadIdInput]="leadId"
          [insideModal]="true"
          (closed)="disableEdit()"
          (saved)="onSaved()"
        ></app-lead-form>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadDialogComponent implements OnInit {
  protected readonly I18N = I18N;
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  leadsFacade = inject(LeadsFacadeService);

  mode = signal<DialogMode>('VIEW');
  loading = signal(false);
  lead = computed(() => this.leadsFacade.activeLead());

  leadId: string = '';

  ngOnInit() {
    this.leadId = this.config.data?.leadId;
    if (this.config.data?.initialMode) {
      this.mode.set(this.config.data.initialMode);
    }
    if (this.leadId) {
      this.loadLead();
    }
  }

  async loadLead() {
    this.leadsFacade.loadActiveLead(this.leadId).subscribe();
  }

  enableEdit() {
    this.mode.set('EDIT');
  }

  disableEdit() {
    this.mode.set('VIEW');
  }

  onSaved() {
    this.loadLead();
    this.mode.set('VIEW');
  }

  close() {
    this.ref.close();
  }
}
