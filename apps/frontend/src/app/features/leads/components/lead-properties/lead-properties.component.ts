import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import {
  CreateRuralPropertyDto,
  RuralPropertyDto,
} from '../../../../api/model/models';
import { LeadsFacadeService } from '../../services/leads.facade';

@Component({
  selector: 'app-lead-properties',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
  ],
  templateUrl: './lead-properties.component.html',
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadPropertiesComponent {
  @Input({ required: true }) leadId!: string;
  @Input() properties: RuralPropertyDto[] = [];

  private fb = inject(FormBuilder);
  private leadsFacade = inject(LeadsFacadeService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  visible = false;
  loading = signal(false);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      totalAreaHectares: [null, Validators.required],
      productiveAreaHectares: [null, Validators.required],
      latitude: [null],
      longitude: [null],
    });
  }

  showDialog() {
    this.visible = true;
    this.form.reset();
  }

  save() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const dto: CreateRuralPropertyDto = {
      leadId: this.leadId,
      name: formValue.name,
      city: formValue.city,
      state: formValue.state,
      totalAreaHectares: formValue.totalAreaHectares,
      productiveAreaHectares: formValue.productiveAreaHectares,
      location: {
        type: 'Point',
        coordinates: [formValue.longitude || 0, formValue.latitude || 0],
      },
    };

    this.loading.set(true);
    this.leadsFacade.addProperty(this.leadId, dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Propriedade adicionada com sucesso',
        });
        this.visible = false;
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao adicionar propriedade',
        });
        this.loading.set(false);
      },
    });
  }

  confirmDelete(property: { id?: string }) {
    if (!property.id) return;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja remover esta propriedade?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.leadsFacade.deleteProperty(property.id!).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Propriedade removida',
          });
        });
      },
    });
  }
}
