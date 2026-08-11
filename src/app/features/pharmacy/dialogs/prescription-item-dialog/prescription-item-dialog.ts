import {
  Component,
  Inject,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import {
  PrescriptionItem
} from '../../models/prescription-item';

import {
  CreatePrescriptionItem
} from '../../models/create-prescription-item';

import {
  Prescription
} from '../../models/prescription';

import {
  Medicine
} from '../../models/medicine';

import {
  PrescriptionItemService
} from '../../services/prescription-item.service';

import {
  PrescriptionService
} from '../../services/prescription.service';

import {
  MedicineService
} from '../../services/medicine.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';


@Component({
  selector: 'app-prescription-item-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './prescription-item-dialog.html',

  styleUrl:
    './prescription-item-dialog.scss'
})
export class PrescriptionItemDialog {

  private readonly fb =
    inject(FormBuilder);

  private readonly service =
    inject(PrescriptionItemService);

  private readonly prescriptionService =
    inject(PrescriptionService);

  private readonly medicineService =
    inject(MedicineService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef);

  readonly item:
    PrescriptionItem | undefined;

  loading = false;

  prescriptions: Prescription[] = [];

  medicines: Medicine[] = [];


  form = this.fb.nonNullable.group({

    prescriptionId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    medicineId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    dosage: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    frequency: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    durationInDays: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    quantity: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]

  });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: PrescriptionItem | undefined
  ) {

    this.item = data;

    this.loadPrescriptions();

    this.loadMedicines();


    if (data) {

      this.form.patchValue({

        prescriptionId:
          data.prescriptionId,

        medicineId:
          data.medicineId,

        dosage:
          data.dosage,

        frequency:
          data.frequency,

        durationInDays:
          data.durationInDays,

        quantity:
          data.quantity

      });

    }

  }


  get isEditMode(): boolean {

    return !!this.item;

  }


  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Prescription Item'
      : 'Add Prescription Item';

  }


  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update prescribed medicine details'
      : 'Add a medicine to a prescription';

  }


  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }

    return this.isEditMode
      ? 'Update Item'
      : 'Save Item';

  }


  private loadPrescriptions(): void {

    this.prescriptionService
      .getAll()
      .subscribe({

        next: response => {

          this.prescriptions =
            response.data ?? [];

        },

        error: error => {

          console.error(error);

          this.notification.error(
            'Unable to load prescriptions'
          );

        }

      });

  }


  private loadMedicines(): void {

    this.medicineService
      .getAll()
      .subscribe({

        next: response => {

          this.medicines =
            response.data ?? [];

        },

        error: error => {

          console.error(error);

          this.notification.error(
            'Unable to load medicines'
          );

        }

      });

  }


  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const value =
      this.form.getRawValue();


    const model: CreatePrescriptionItem = {

      prescriptionId:
        Number(value.prescriptionId),

      medicineId:
        Number(value.medicineId),

      dosage:
        value.dosage.trim(),

      frequency:
        value.frequency.trim(),

      durationInDays:
        Number(value.durationInDays),

      quantity:
        Number(value.quantity)

    };


    if (!model.dosage) {

      this.form.controls.dosage.setErrors({
        required: true
      });

      this.form.controls.dosage.markAsTouched();

      return;

    }


    if (!model.frequency) {

      this.form.controls.frequency.setErrors({
        required: true
      });

      this.form.controls.frequency.markAsTouched();

      return;

    }


    this.loading = true;


    if (this.isEditMode) {

      this.update(model);

    }
    else {

      this.create(model);

    }

  }


  private create(
    model: CreatePrescriptionItem
  ): void {

    this.service
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Prescription item created successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to create prescription item'
          );

        }

      });

  }


  private update(
    model: CreatePrescriptionItem
  ): void {

    if (!this.item) {

      return;

    }


    const updateModel = {

      dosage:
        model.dosage,

      frequency:
        model.frequency,

      durationInDays:
        model.durationInDays,

      quantity:
        model.quantity

    };


    this.service
      .update(
        this.item.id,
        updateModel
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Prescription item updated successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to update prescription item'
          );

        }

      });

  }


  cancel(): void {

    if (this.loading) {

      return;

    }

    this.dialogRef.close(false);

  }


  get prescriptionIdControl() {

    return this.form.controls.prescriptionId;

  }


  get medicineIdControl() {

    return this.form.controls.medicineId;

  }


  get dosageControl() {

    return this.form.controls.dosage;

  }


  get frequencyControl() {

    return this.form.controls.frequency;

  }


  get durationControl() {

    return this.form.controls.durationInDays;

  }


  get quantityControl() {

    return this.form.controls.quantity;

  }

}