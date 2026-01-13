import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { LeadDto } from '../../../api/model/models';
import { DocumentPipe } from '../../../core/pipes/document.pipe';
import { LeadDialogComponent } from '../components/lead-dialog/lead-dialog.component';
import { LeadsFacadeService } from '../services/leads.facade';

import { I18N } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    ToastModule,
    TooltipModule,
    DocumentPipe,
    FormsModule,
    SelectModule,
  ],
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './lead-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadListComponent {
  protected readonly I18N = I18N;
  leadsFacade = inject(LeadsFacadeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null = null;

  private searchSubject = new Subject<string>();
  private lastLazyLoadEvent?: TableLazyLoadEvent;

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.length < 3 && query.length > 0) {
            return of([]);
          }
          return this.leadsFacade.searchLeads(query);
        }),
        takeUntilDestroyed(),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      )
      .subscribe();
  }

  loadLeads(event: TableLazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    const page = (event.first ?? 0) / (event.rows ?? 10) + 1;
    const limit = event.rows ?? 10;

    this.leadsFacade.loadLeads({ page, limit });
  }

  sortOptions = [
    { label: 'Mais recentes', value: 'createdAt_DESC' },
    { label: 'Mais antigos', value: 'createdAt_ASC' },
    { label: 'Nome (A-Z)', value: 'name_ASC' },
    { label: 'Nome (Z-A)', value: 'name_DESC' },
    { label: 'Maior Potencial', value: 'estimatedPotential_DESC' },
    { label: 'Menor Potencial', value: 'estimatedPotential_ASC' },
  ];

  selectedSort = 'createdAt_DESC';

  onSortChange(value: string) {
    const [sortBy, sortOrder] = value.split('_') as [
      'name' | 'createdAt' | 'estimatedPotential',
      'ASC' | 'DESC',
    ];
    this.leadsFacade.loadLeads({ sortBy, sortOrder });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  createLead() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  viewDetails(lead: LeadDto) {
    this.openDialog(lead, 'VIEW');
  }

  editLead(lead: LeadDto, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.openDialog(lead, 'EDIT');
  }

  private openDialog(lead: LeadDto, mode: 'VIEW' | 'EDIT') {
    this.ref = this.dialogService.open(LeadDialogComponent, {
      header:
        mode === 'EDIT' ? I18N.LEAD.FORM.TITLE_EDIT : I18N.LEAD.DETAIL.TITLE,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        leadId: lead.id,
        initialMode: mode,
      },
    });

    if (this.ref) {
      this.ref.onClose.subscribe(() => {
        this.loadLeads(this.lastLazyLoadEvent || {});
      });
    }
  }

  deleteLead(lead: LeadDto, event: Event) {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: I18N.COMMON.CONFIRM_DELETE_MSG(lead.name),
      header: I18N.COMMON.CONFIRM_DELETE_TITLE,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: I18N.COMMON.YES,
      rejectLabel: I18N.COMMON.NO,
      accept: () => {
        if (lead.id) {
          this.leadsFacade.deleteLead(lead.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: I18N.COMMON.SUCCESS,
                detail: I18N.LEAD.LIST.DELETE_SUCCESS,
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: I18N.COMMON.ERROR,
                detail: I18N.LEAD.LIST.DELETE_ERROR,
              });
            },
          });
        }
      },
    });
  }

  getSeverity(
    status: string,
  ): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (status) {
      case LeadDto.StatusEnum.New:
      case LeadDto.StatusEnum.Converted:
      case 'Approved':
        return 'success';
      case LeadDto.StatusEnum.Qualified:
        return 'info';
      case LeadDto.StatusEnum.Contacted:
        return 'warn';
      case LeadDto.StatusEnum.Lost:
        return 'danger';
      default:
        return undefined;
    }
  }
}
