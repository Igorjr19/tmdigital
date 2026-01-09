import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LeadsService } from '../../../api/api/leads.service';
import {
  CreateLeadDto,
  GetLeadsResponseDto,
  LeadDto,
  UpdateLeadDto,
} from '../../../api/model/models';

@Injectable({
  providedIn: 'root',
})
export class LeadsFacadeService {
  private leadsService = inject(LeadsService);

  leads = signal<LeadDto[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  private currentPage = 1;
  private PAGE_SIZE = 10;

  loadLeads(page: number = 1, limit: number = 10) {
    this.loading.set(true);
    this.currentPage = page;
    this.PAGE_SIZE = limit;

    this.leadsService
      .leadControllerFindAll({ page, limit })
      .pipe(
        tap((response: GetLeadsResponseDto) => {
          this.leads.set(response.data);
          this.totalRecords.set(response.metadata.total);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  getLeadById(id: string) {
    // Check if we have it in signals
    const cached = this.leads().find((l) => l.id === id);
    if (cached) {
      // return as observable
      return new Observable<LeadDto>((observer) => {
        observer.next(cached);
        observer.complete();
      });
    }

    // Otherwise fetch
    this.loading.set(true);
    return this.leadsService
      .leadControllerFindOne({ id })
      .pipe(finalize(() => this.loading.set(false)));
  }

  createLead(createLeadDto: CreateLeadDto) {
    this.loading.set(true);
    return this.leadsService.leadControllerCreate({ createLeadDto }).pipe(
      tap(() => {
        // Reload leads to ensure fresh state, or optimistic update.
        // Reload implies fetching again. Optimistic is faster UI.
        // For simplicity and correctness with pagination, reloading current page is safest.
        this.loadLeads(this.currentPage, this.PAGE_SIZE);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  updateLead(id: string, updateLeadDto: UpdateLeadDto) {
    this.loading.set(true);
    return this.leadsService.leadControllerUpdate({ id, updateLeadDto }).pipe(
      tap((updatedLead) => {
        this.leads.update((leads) =>
          leads.map((l) => (l.id === id ? updatedLead : l)),
        );
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  deleteLead(id: string) {
    this.loading.set(true);
    return this.leadsService.leadControllerRemove({ id }).pipe(
      tap(() => {
        // Remove from local state
        this.leads.update((leads) => leads.filter((l) => l.id !== id));
        // Update total records count optimistically
        this.totalRecords.update((count) => count - 1);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  searchLeadsByName(name: string) {
    this.loading.set(true);
    return this.leadsService
      .leadControllerFindAll({
        name,
      })
      .pipe(
        tap((leads) => {
          this.leads.set(leads.data);
        }),
        finalize(() => this.loading.set(false)),
      );
  }
}
