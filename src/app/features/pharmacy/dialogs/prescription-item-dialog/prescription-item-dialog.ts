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
    inject(
      MatDialogRef<PrescriptionItemDialog>
    );


  readonly item:
    PrescriptionItem | undefined;


  loading = false;


  prescriptions:
    Prescription[] = [];

  medicines:
    Medicine[] = [];


  /*
   * Form
   *
   * Numeric fields intentionally start
   * with null.
   *
   * This prevents unwanted 0 values
   * from appearing in Add mode.
   */

  form = this.fb.group({

    prescriptionId:
      this.fb.control<number | null>(
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ),

    medicineId:
      this.fb.control<number | null>(
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ),

    dosage:
      this.fb.nonNullable.control<string>(
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ),

    frequency:
      this.fb.nonNullable.control<string>(
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ),

    durationInDays:
      this.fb.control<number | null>(
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ),

    quantity:
      this.fb.control<number | null>(
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      )

  });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data:
      PrescriptionItem | undefined
  ) {

    this.item = data;

    this.loadPrescriptions();

    this.loadMedicines();


    /*
     * Edit mode.
     *
     * Existing values are loaded
     * into the form.
     */

    if (data) {

      this.form.patchValue({

        prescriptionId:
          Number(data.prescriptionId),

        medicineId:
          Number(data.medicineId),

        dosage:
          data.dosage,

        frequency:
          data.frequency,

        durationInDays:
          Number(data.durationInDays),

        quantity:
          Number(data.quantity)

      });

    }

  }


  /*
   * Edit mode
   */

  get isEditMode(): boolean {

    return !!this.item;

  }


  /*
   * Dialog title
   */

  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Prescription Item'
      : 'Add Prescription Item';

  }


  /*
   * Dialog subtitle
   */

  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update prescribed medicine details'
      : 'Add a medicine to a prescription';

  }


  /*
   * Submit button text
   */

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


  /*
   * Load prescriptions
   */

  private loadPrescriptions(): void {

    this.prescriptionService
      .getAll()
      .subscribe({

        next: response => {

          this.prescriptions =
            response.data ?? [];

        },

        error: error => {

          console.error(
            'Load prescriptions error:',
            error
          );

          this.notification.error(
            'Unable to load prescriptions'
          );

        }

      });

  }


  /*
   * Load medicines
   */

  private loadMedicines(): void {

    this.medicineService
      .getAll()
      .subscribe({

        next: response => {

          this.medicines =
            response.data ?? [];

        },

        error: error => {

          console.error(
            'Load medicines error:',
            error
          );

          this.notification.error(
            'Unable to load medicines'
          );

        }

      });

  }


  /*
   * Save prescription item
   */

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const value =
      this.form.getRawValue();


    /*
     * Make sure nullable controls
     * contain actual values.
     */

    if (
      value.prescriptionId === null ||
      value.medicineId === null ||
      value.durationInDays === null ||
      value.quantity === null
    ) {

      this.form.markAllAsTouched();

      return;

    }


    const model:
      CreatePrescriptionItem = {

      prescriptionId:
        value.prescriptionId,

      medicineId:
        value.medicineId,

      dosage:
        value.dosage.trim(),

      frequency:
        value.frequency.trim(),

      durationInDays:
        value.durationInDays,

      quantity:
        value.quantity

    };


    /*
     * Validate dosage
     */

    if (!model.dosage) {

      this.form.controls.dosage.setErrors({

        required: true

      });

      this.form.controls.dosage.markAsTouched();

      return;

    }


    /*
     * Validate frequency
     */

    if (!model.frequency) {

      this.form.controls.frequency.setErrors({

        required: true

      });

      this.form.controls.frequency.markAsTouched();

      return;

    }


    /*
     * Validate duration
     */

    if (
      !Number.isInteger(
        model.durationInDays
      ) ||
      model.durationInDays < 1
    ) {

      this.form.controls
        .durationInDays
        .setErrors({

          min: true

        });

      this.form.controls
        .durationInDays
        .markAsTouched();

      return;

    }


    /*
     * Validate quantity
     */

    if (
      !Number.isInteger(
        model.quantity
      ) ||
      model.quantity < 1
    ) {

      this.form.controls
        .quantity
        .setErrors({

          min: true

        });

      this.form.controls
        .quantity
        .markAsTouched();

      return;

    }


    this.loading = true;


    /*
     * Update existing item.
     */

    if (this.isEditMode) {

      this.update(model);

      return;

    }


    /*
     * Create new item.
     */

    this.create(model);

  }


  /*
   * Create prescription item
   */

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

          console.error(
            'Create Prescription Item Error:',
            error
          );

          this.loading = false;


          /*
           * HTTP 409 means the same
           * medicine already exists
           * for this prescription.
           */

          if (
            error?.status === 409
          ) {

            this.notification.error(
              'This medicine has already been added to the prescription.'
            );

            return;

          }


          /*
           * Extract normal backend
           * error message.
           */

          const message =
            error?.error?.message ??
            error?.error?.title ??
            error?.message ??
            'Unable to create prescription item';


          this.notification.error(
            message
          );

        }

      });

  }


  /*
   * Update prescription item
   */

  private update(
    model: CreatePrescriptionItem
  ): void {

    if (!this.item) {

      this.loading = false;

      return;

    }


    /*
     * Prescription and medicine remain
     * unchanged while editing.
     */

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

          console.error(
            'Update Prescription Item Error:',
            error
          );

          this.loading = false;


          /*
           * Handle duplicate/conflict.
           */

          if (
            error?.status === 409
          ) {

            this.notification.error(
              'This medicine has already been added to the prescription.'
            );

            return;

          }


          const message =
            error?.error?.message ??
            error?.error?.title ??
            error?.message ??
            'Unable to update prescription item';


          this.notification.error(
            message
          );

        }

      });

  }


  /*
   * Close dialog
   */

  cancel(): void {

    if (this.loading) {

      return;

    }

    this.dialogRef.close(false);

  }


  /*
   * Form control getters
   */

  get prescriptionIdControl() {

    return this.form.controls
      .prescriptionId;

  }


  get medicineIdControl() {

    return this.form.controls
      .medicineId;

  }


  get dosageControl() {

    return this.form.controls
      .dosage;

  }


  get frequencyControl() {

    return this.form.controls
      .frequency;

  }


  get durationInDaysControl() {

    return this.form.controls
      .durationInDays;

  }


  get quantityControl() {

    return this.form.controls
      .quantity;

  }

}