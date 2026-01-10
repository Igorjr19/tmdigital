import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';
import { LeadDto } from '../../../api/model/models';
import { LeadPropertiesComponent } from '../components/lead-properties/lead-properties.component';
import { LeadWithProperties } from '../models/lead.extension';
import { LeadsFacadeService } from '../services/leads.facade';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    TextareaModule,
    ButtonModule,
    ToastModule,
    LeadPropertiesComponent,
  ],
  providers: [MessageService],
  templateUrl: './lead-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  leadsFacade = inject(LeadsFacadeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);

  form!: FormGroup;
  isEditMode = signal(false);
  leadId: string | null = null;
  lead = signal<LeadDto | null>(null);

  statusOptions = [
    { label: 'Novo', value: LeadDto.StatusEnum.New },
    { label: 'Contatado', value: LeadDto.StatusEnum.Contacted },
    { label: 'Qualificado', value: LeadDto.StatusEnum.Qualified },
    { label: 'Convertido', value: LeadDto.StatusEnum.Converted },
    { label: 'Perdido', value: LeadDto.StatusEnum.Lost },
  ];

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
      status: [LeadDto.StatusEnum.New, Validators.required],
      estimatedPotential: [0],
      currentSupplier: [''],
      notes: [''],
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.leadId = id;
      this.loadLeadData(id);
    }
  }

  async loadLeadData(id: string) {
    try {
      const lead = await firstValueFrom(this.leadsFacade.getLeadById(id));
      this.lead.set(lead);
      this.patchForm(lead);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Lead não encontrado.',
      });
      this.goBack();
    }
  }

  patchForm(lead: LeadDto) {
    this.form.patchValue({
      name: lead.name,
      document: lead.document,
      status: lead.status,
      estimatedPotential: lead.estimatedPotential,
      currentSupplier: lead.currentSupplier,
      notes: lead.notes,
    });
  }

  get leadProperties() {
    return (this.lead() as unknown as LeadWithProperties).properties || [];
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const dto = {
      name: formValue.name,
      document: formValue.document,
      status: formValue.status,
      estimatedPotential: formValue.estimatedPotential,
      currentSupplier: formValue.currentSupplier,
      notes: formValue.notes,
    };

    if (this.isEditMode() && this.leadId) {
      Object.keys(this.form.controls).forEach((key) => {
        if (!this.form.get(key)?.dirty) {
          delete dto[key as keyof typeof dto];
        }
      });

      try {
        await firstValueFrom(this.leadsFacade.updateLead(this.leadId, dto));
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Lead atualizado!',
        });
        this.goBack();
      } catch {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar lead.',
        });
      }
    } else {
      try {
        await firstValueFrom(this.leadsFacade.createLead(dto));
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Lead criado!',
        });
        this.goBack();
      } catch {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar lead.',
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['/leads']);
  }
}
