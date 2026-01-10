import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { LeadDto } from '../../../api/model/models';
import { LeadsFacadeService } from '../services/leads.facade';

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
    FormsModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './lead-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadListComponent {
  leadsFacade = inject(LeadsFacadeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  private searchSubject = new Subject<string>();
  private lastLazyLoadEvent?: TableLazyLoadEvent;

  constructor() {
    this.searchSubject
      .pipe(
        filter((text) => text.length > 2),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.leadsFacade.searchLeadsByName(query)),
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

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  createLead() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editLead(lead: LeadDto) {
    this.router.navigate(['/leads', lead.id]);
  }

  deleteLead(lead: LeadDto) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o lead ${lead.name}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        if (lead.id) {
          this.leadsFacade.deleteLead(lead.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Lead excluído com sucesso',
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir lead',
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
