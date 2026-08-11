import {
  Component,
  Inject,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { Prescription }
  from '../../models/prescription';

import { CreatePrescription }
  from '../../models/create-prescription';

import { PrescriptionService }
  from '../../services/prescription.service';

import { NotificationService }
  from '../../../../core/services/notification.service';

import { AppointmentService }
  from '../../../appointment/services/appointment.service';

import { Appointment }
  from '../../../appointment/models/appointment';


@Component({
  selector: 'app-prescription-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './prescription-dialog.html',

  styleUrl:
    './prescription-dialog.scss'
})
export class PrescriptionDialog {

  private readonly fb =
    inject(FormBuilder);

  private readonly service =
    inject(PrescriptionService);

  private readonly appointmentService =
    inject(AppointmentService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef);


  readonly prescription:
    Prescription | undefined;


  appointments: Appointment[] = [];

  existingAppointmentIds =
    new Set<number>();


  loading = false;

  loadingAppointments = false;


  form =
    this.fb.nonNullable.group({

      appointmentId: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      instructions: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(4000)
        ]
      ],

      notes: [
        '',
        [
          Validators.maxLength(2000)
        ]
      ]

    });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: Prescription | undefined
  ) {

    this.prescription = data;

    if (data) {

      this.form.patchValue({

        appointmentId:
          data.appointmentId,

        instructions:
          data.instructions,

        notes:
          data.notes ?? ''

      });

    }


    this.loadAppointments();

  }


  get isEditMode(): boolean {

    return !!this.prescription;

  }


  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Prescription'
      : 'Add Prescription';

  }


  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update prescription details'
      : 'Create a prescription for an appointment';

  }


  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }

    return this.isEditMode
      ? 'Update Prescription'
      : 'Save Prescription';

  }


  loadAppointments(): void {

    this.loadingAppointments = true;


    this.appointmentService
      .getAll()
      .subscribe({

        next: response => {

          this.appointments =
            response.data ?? [];

          this.loadExistingPrescriptions();

        },

        error: error => {

          console.error(error);

          this.loadingAppointments = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to load appointments'
          );

        }

      });

  }


  private loadExistingPrescriptions(): void {

    this.service
      .getAll()
      .subscribe({

        next: response => {

          const prescriptions =
            response.data ?? [];

          this.existingAppointmentIds =
            new Set(
              prescriptions.map(
                p => p.appointmentId
              )
            );

          this.loadingAppointments = false;

        },

        error: error => {

          console.error(error);

          this.loadingAppointments = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to load existing prescriptions'
          );

        }

      });

  }


  getAvailableAppointments(): Appointment[] {

    if (this.isEditMode) {

      return this.appointments;

    }


    return this.appointments.filter(
      appointment =>
        !this.existingAppointmentIds.has(
          appointment.id
        )
    );

  }


  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const formValue =
      this.form.getRawValue();


    const model: CreatePrescription = {

      appointmentId:
        Number(formValue.appointmentId),

      instructions:
        formValue.instructions.trim(),

      notes:
        formValue.notes.trim() || null

    };


    if (!model.instructions) {

      this.form.controls.instructions
        .setErrors({
          required: true
        });

      this.form.controls.instructions
        .markAsTouched();

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
    model: CreatePrescription
  ): void {

    this.service
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Prescription created successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to create prescription'
          );

        }

      });

  }


  private update(
    model: CreatePrescription
  ): void {

    if (!this.prescription) {

      return;

    }


    this.service
      .update(
        this.prescription.id,
        model
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Prescription updated successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to update prescription'
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


  get appointmentIdControl() {

    return this.form.controls.appointmentId;

  }


  get instructionsControl() {

    return this.form.controls.instructions;

  }


  get notesControl() {

    return this.form.controls.notes;

  }

}