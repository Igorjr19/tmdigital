import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
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
import { SelectModule } from 'primeng/select';
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
    SelectModule,
  ],
  templateUrl: './lead-properties.component.html',
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadPropertiesComponent {
  @Input({ required: true }) leadId!: string;
  @Input() properties: RuralPropertyDto[] = [];
  @Input() readOnly = false;

  private fb = inject(FormBuilder);
  private leadsFacade = inject(LeadsFacadeService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  visible = false;
  loading = signal(false);
  editingPropertyId: string | null = null;
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
      cropProductions: this.fb.array([]),
    });

    this.leadsFacade.loadCultures();
  }

  get cropProductions() {
    return this.form.get('cropProductions') as FormArray;
  }

  addCrop() {
    this.cropProductions.push(
      this.fb.group({
        cultureId: [null, Validators.required],
        plantedAreaHectares: [null, Validators.required],
      }),
    );
  }

  removeCrop(index: number) {
    this.cropProductions.removeAt(index);
  }

  cultures = this.leadsFacade.cultures;

  showDialog() {
    this.visible = true;
    this.editingPropertyId = null;
    this.form.reset();
    this.cropProductions.clear();
  }

  edit(property: RuralPropertyDto) {
    this.visible = true;
    this.editingPropertyId = property.id;
    this.form.patchValue({
      name: property.name,
      city: property.city,
      state: property.state,
      totalAreaHectares: property.totalAreaHectares,
      productiveAreaHectares: property.productiveAreaHectares,

      latitude: property.location?.coordinates?.[1],
      longitude: property.location?.coordinates?.[0],
    });

    this.cropProductions.clear();
    if (property.cropProductions) {
      property.cropProductions.forEach((crop) => {
        this.cropProductions.push(
          this.fb.group({
            cultureId: [
              crop.cultureId || crop.culture?.id,
              Validators.required,
            ],
            plantedAreaHectares: [
              crop.plantedAreaHectares,
              Validators.required,
            ],
          }),
        );
      });
    }
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
      cropProductions: formValue.cropProductions,
    };

    this.loading.set(true);

    const request$ = this.editingPropertyId
      ? this.leadsFacade.updateProperty(
          this.leadId,
          this.editingPropertyId,
          dto,
        )
      : this.leadsFacade.addProperty(this.leadId, dto);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.editingPropertyId
            ? 'Propriedade atualizada com sucesso'
            : 'Propriedade adicionada com sucesso',
        });
        this.visible = false;
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar propriedade',
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
        this.leadsFacade
          .deleteProperty(this.leadId, property.id!)
          .subscribe(() => {
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
