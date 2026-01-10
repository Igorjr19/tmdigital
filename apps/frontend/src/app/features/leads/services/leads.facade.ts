import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LeadsService } from '../../../api/api/leads.service';
import { RuralPropertiesService } from '../../../api/api/rural-properties.service';
import {
  CreateLeadDto,
  CreateRuralPropertyDto,
  GetLeadsResponseDto,
  LeadDto,
  UpdateLeadDto,
} from '../../../api/model/models';
import { LeadWithProperties } from '../models/lead.extension';

@Injectable({
  providedIn: 'root',
})
export class LeadsFacadeService {
  private leadsService = inject(LeadsService);
  private ruralPropertiesService = inject(RuralPropertiesService);

  leads = signal<LeadDto[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  private currentFilter: {
    page?: number;
    limit?: number;
    name?: string;
    status?: LeadDto.StatusEnum;
  } = {
    page: 1,
    limit: 10,
  };

  loadLeads(filter?: Partial<typeof this.currentFilter>) {
    this.loading.set(true);
    if (filter) {
      this.currentFilter = { ...this.currentFilter, ...filter };
    }

    const { page, limit, name, status } = this.currentFilter;

    this.leadsService
      .leadControllerFindAll({ page, limit, name, status })
      .pipe(
        tap((response: GetLeadsResponseDto) => {
          this.leads.set(response.data);
          this.totalRecords.set(response.metadata.total);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  loadAllLeadsForDashboard() {
    this.loadLeads({ page: 1, limit: 100 });
  }

  getLeadById(id: string) {
    const cached = this.leads().find((l) => l.id === id);
    if (cached) {
      return new Observable<LeadDto>((observer) => {
        observer.next(cached);
        observer.complete();
      });
    }

    this.loading.set(true);
    return this.leadsService
      .leadControllerFindOne({ id })
      .pipe(finalize(() => this.loading.set(false)));
  }

  createLead(createLeadDto: CreateLeadDto) {
    this.loading.set(true);
    return this.leadsService.leadControllerCreate({ createLeadDto }).pipe(
      tap(() => {
        this.loadLeads();
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
        this.leads.update((leads) => leads.filter((l) => l.id !== id));
        this.totalRecords.update((count) => count - 1);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  searchLeadsByName(name: string) {
    this.loadLeads({ name, page: 1 });
    return new Observable();
  }

  allProperties = computed(() => {
    return this.leads()
      .map((lead) => {
        const props = (lead as unknown as LeadWithProperties).properties || [];
        return props.map((p) => ({
          ...p,
          leadStatus: lead.status,
          leadName: lead.name,
        }));
      })
      .flat();
  });

  metrics = computed(() => {
    const allLeads = this.leads();
    const totalPotential = allLeads.reduce(
      (acc, curr) => acc + (Number(curr.estimatedPotential) || 0),
      0,
    );
    const properties = this.allProperties();
    const totalArea = properties.reduce(
      (acc, curr) => acc + (Number(curr.totalAreaHectares) || 0),
      0,
    );

    return {
      totalLeads: this.totalRecords(),
      totalPotential,
      totalArea,
    };
  });

  leadsByStatus = computed(() => {
    const counts: Record<string, number> = {};
    this.leads().forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      data: Object.values(counts),
    };
  });

  areaByCity = computed(() => {
    const cityAreas: Record<string, number> = {};
    this.allProperties().forEach((p) => {
      cityAreas[p.city] =
        (cityAreas[p.city] || 0) + Number(p.totalAreaHectares || 0);
    });
    const sorted = Object.entries(cityAreas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return {
      labels: sorted.map((s) => s[0]),
      data: sorted.map((s) => s[1]),
    };
  });

  addProperty(leadId: string, createRuralPropertyDto: CreateRuralPropertyDto) {
    this.loading.set(true);
    return this.leadsService
      .leadControllerAddProperty({ id: leadId, createRuralPropertyDto })
      .pipe(
        tap(() => {}),
        finalize(() => this.loading.set(false)),
      );
  }

  deleteProperty(propertyId: string) {
    this.loading.set(true);
    return this.ruralPropertiesService
      .ruralPropertyControllerRemove({ id: propertyId })
      .pipe(finalize(() => this.loading.set(false)));
  }
}
