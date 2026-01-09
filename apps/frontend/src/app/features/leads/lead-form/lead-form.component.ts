import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { LeadDto } from '../../../api/model/models';
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
  ],
  providers: [MessageService],
  templateUrl: './lead-form.component.html',
})
export class LeadFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  leadsFacade = inject(LeadsFacadeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);

  form!: FormGroup;
  isEditMode = false;
  leadId: string | null = null;

  // Enum values for status
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
    // We check route param
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.leadId = id;
      this.loadLeadData(id);
    }
  }

  loadLeadData(id: string) {
    this.leadsFacade.getLeadById(id).subscribe({
      next: (lead: LeadDto) => this.patchForm(lead),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Lead não encontrado.',
        });
        this.goBack();
      },
    });
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

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    // Map form to Dto
    const dto = {
      name: formValue.name,
      document: formValue.document,
      status: formValue.status,
      estimatedPotential: formValue.estimatedPotential,
      currentSupplier: formValue.currentSupplier,
      notes: formValue.notes,
    };

    if (this.isEditMode && this.leadId) {
      this.leadsFacade.updateLead(this.leadId, dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Lead atualizado!',
          });
          setTimeout(() => this.goBack(), 1000);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar lead.',
          });
        },
      });
    } else {
      this.leadsFacade.createLead(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Lead criado!',
          });
          setTimeout(() => this.goBack(), 1000);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar lead.',
          });
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/leads']);
  }
}
