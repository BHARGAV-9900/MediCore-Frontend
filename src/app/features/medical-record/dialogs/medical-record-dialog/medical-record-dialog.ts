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
  MedicalRecord
} from '../../models/medical-record';

import {
  CreateMedicalRecord
} from '../../models/create-medical-record';

import {
  MedicalRecordService
} from '../../services/medical-record.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-medical-record-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './medical-record-dialog.html',
  styleUrl: './medical-record-dialog.scss'
})
export class MedicalRecordDialog {

  private readonly fb = inject(FormBuilder);

  private readonly service =
    inject(MedicalRecordService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef<MedicalRecordDialog>);

  readonly medicalRecord:
    MedicalRecord | undefined;

  loading = false;

  form = this.fb.group({

    // Start empty instead of 0 so the user can type directly.
    appointmentId: [
      '',
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    diagnosis: [
      '',
      [
        Validators.required,
        Validators.maxLength(500)
      ]
    ],

    symptoms: [
      '',
      [
        Validators.required,
        Validators.maxLength(2000)
      ]
    ],

    clinicalNotes: [
      '',
      [
        Validators.maxLength(4000)
      ]
    ],

    treatmentPlan: [
      '',
      [
        Validators.required,
        Validators.maxLength(4000)
      ]
    ],

    followUpInstructions: [
      '',
      [
        Validators.maxLength(2000)
      ]
    ]

  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: MedicalRecord | undefined
  ) {

    this.medicalRecord = data;

    if (data) {

      this.form.patchValue({

        appointmentId:
          String(data.appointmentId),

        diagnosis:
          data.diagnosis,

        symptoms:
          data.symptoms,

        clinicalNotes:
          data.clinicalNotes,

        treatmentPlan:
          data.treatmentPlan,

        followUpInstructions:
          data.followUpInstructions ?? ''

      });

    }

  }

  get isEditMode(): boolean {

    return !!this.medicalRecord;

  }

  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Medical Record'
      : 'Add Medical Record';

  }

  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update patient clinical information'
      : 'Add a new patient medical record';

  }

  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }

    return this.isEditMode
      ? 'Update Record'
      : 'Save Record';

  }

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    const formValue =
      this.form.getRawValue();

    const appointmentId =
      Number(formValue.appointmentId);

    const model: CreateMedicalRecord = {

      appointmentId,

      diagnosis:
        formValue.diagnosis!.trim(),

      symptoms:
        formValue.symptoms!.trim(),

      clinicalNotes:
        formValue.clinicalNotes!.trim(),

      treatmentPlan:
        formValue.treatmentPlan!.trim(),

      followUpInstructions:
        formValue.followUpInstructions!.trim()
          || null

    };

    if (
      !appointmentId ||
      appointmentId <= 0
    ) {

      this.form.controls.appointmentId.setErrors({
        required: true
      });

      this.form.controls.appointmentId.markAsTouched();

      return;

    }

    if (!model.diagnosis) {

      this.form.controls.diagnosis.setErrors({
        required: true
      });

      this.form.controls.diagnosis.markAsTouched();

      return;

    }

    if (!model.symptoms) {

      this.form.controls.symptoms.setErrors({
        required: true
      });

      this.form.controls.symptoms.markAsTouched();

      return;

    }

    if (!model.treatmentPlan) {

      this.form.controls.treatmentPlan.setErrors({
        required: true
      });

      this.form.controls.treatmentPlan.markAsTouched();

      return;

    }

    this.loading = true;

    if (this.isEditMode) {

      this.update(model);

    } else {

      this.create(model);

    }

  }

  private create(
    model: CreateMedicalRecord
  ): void {

    this.service
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Medical record created successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(
            'Create medical record error:',
            error
          );

          this.loading = false;

          this.notification.error(
            this.getErrorMessage(
              error,
              'Unable to create medical record'
            )
          );

        }

      });

  }

  private update(
    model: CreateMedicalRecord
  ): void {

    if (!this.medicalRecord) {

      return;

    }

    this.service
      .update(
        this.medicalRecord.id,
        model
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Medical record updated successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(
            'Update medical record error:',
            error
          );

          this.loading = false;

          this.notification.error(
            this.getErrorMessage(
              error,
              'Unable to update medical record'
            )
          );

        }

      });

  }

  /**
   * Extract the actual message returned by the
   * MediCore Nexus API.
   */
  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (error?.error?.message) {

      return error.error.message;

    }

    if (error?.error?.Message) {

      return error.error.Message;

    }

    if (error?.message) {

      return error.message;

    }

    if (
      Array.isArray(error?.error?.errors) &&
      error.error.errors.length > 0
    ) {

      return error.error.errors.join(', ');

    }

    return fallback;

  }

  /**
   * Extract the actual error message returned
   * by the MediCore Nexus API.
   *
   * The backend uses:
   *
   * {
   *   success: false,
   *   message: "...",
   *   data: null,
   *   errors: null
   * }
   *
   */
  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    /**
     * Standard MediCore API response.
     */
    if (error?.error?.message) {

      return error.error.message;

    }


    /**
     * Handles capitalized Message property.
     */
    if (error?.error?.Message) {

      return error.error.Message;

    }


    /**
     * Handles direct message.
     */
    if (error?.message) {

      return error.message;

    }


    /**
     * Handles validation errors array.
     */
    if (
      Array.isArray(
        error?.error?.errors
      ) &&
      error.error.errors.length > 0
    ) {

      return error.error.errors.join(', ');

    }


    /**
     * Final fallback.
     */
    return fallback;

  }


  cancel(): void {

    if (this.loading) {

      return;

    }

    this.dialogRef.close(false);

  }

  get appointmentIdControl() {

    return this.form.controls.appointmentId;

  }

  get diagnosisControl() {

    return this.form.controls.diagnosis;

  }

  get symptomsControl() {

    return this.form.controls.symptoms;

  }

  get clinicalNotesControl() {

    return this.form.controls.clinicalNotes;

  }

  get treatmentPlanControl() {

    return this.form.controls.treatmentPlan;

  }

  get followUpInstructionsControl() {

    return this.form.controls.followUpInstructions;

  }

}
