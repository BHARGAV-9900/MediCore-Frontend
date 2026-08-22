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
  Bill
} from '../../models/bill';

import {
  CreateBill
} from '../../models/create-bill';

import {
  BillService
} from '../../services/bill.service';

import {
  AppointmentService
} from '../../../appointment/services/appointment.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';


@Component({
  selector: 'app-bill-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './bill-dialog.html',

  styleUrl:
    './bill-dialog.scss'
})
export class BillDialog {

  private readonly fb =
    inject(FormBuilder);

  private readonly billService =
    inject(BillService);

  private readonly appointmentService =
    inject(AppointmentService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef);

  readonly bill:
    Bill | undefined;

  loading = false;

  appointments: any[] = [];

  appointmentsLoading = false;


  form =
    this.fb.nonNullable.group({

      appointmentId: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      totalAmount: [
        '',
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ]

    });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: Bill | undefined
  ) {

    this.bill = data;

    if (data) {

      this.form.patchValue({

        appointmentId:
          data.appointmentId,

        totalAmount:
          String(data.totalAmount)

      });

    }

    this.loadAppointments();

  }


  get isEditMode(): boolean {

    return !!this.bill;

  }


  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Bill'
      : 'Add Bill';

  }


  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update bill amount'
      : 'Create a new bill for an appointment';

  }


  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }

    return this.isEditMode
      ? 'Update Bill'
      : 'Save Bill';

  }


  loadAppointments(): void {

    this.appointmentsLoading = true;

    this.appointmentService
      .getAll()
      .subscribe({

        next: response => {

          this.appointments =
            response.data ?? [];

          this.appointmentsLoading = false;

        },

        error: error => {

          console.error(error);

          this.appointmentsLoading = false;

          this.notification.error(
            this.getErrorMessage(
              error,
              'Unable to load appointments'
            )
          );

        }

      });

  }


  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const formValue =
      this.form.getRawValue();


    const model: CreateBill = {

      appointmentId:
        Number(formValue.appointmentId),

      totalAmount:
        Number(formValue.totalAmount)

    };


    if (model.appointmentId <= 0) {

      this.form.controls
        .appointmentId
        .setErrors({
          required: true
        });

      this.form.controls
        .appointmentId
        .markAsTouched();

      return;

    }


    if (!Number.isFinite(model.totalAmount) || model.totalAmount <= 0) {

      this.form.controls
        .totalAmount
        .setErrors({
          min: true
        });

      this.form.controls
        .totalAmount
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
    model: CreateBill
  ): void {

    this.billService
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Bill created successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            this.getErrorMessage(
              error,
              'Unable to create bill'
            )
          );

        }

      });

  }


  private update(
    model: CreateBill
  ): void {

    if (!this.bill) {

      return;

    }


    this.billService
      .update(
        this.bill.id,
        {
          appointmentId:
            this.bill.appointmentId,

          totalAmount:
            model.totalAmount
        }
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Bill updated successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            this.getErrorMessage(
              error,
              'Unable to update bill'
            )
          );

        }

      });

  }


  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    const message =
      error?.error?.message ??
      error?.error?.Message ??
      error?.message;

    if (typeof message === 'string' && message.trim()) {

      return message;

    }

    const errors =
      error?.error?.errors ??
      error?.error?.Errors;

    if (Array.isArray(errors) && errors.length > 0) {

      return errors.join(', ');

    }

    return fallback;

  }


  cancel(): void {

    if (this.loading) {

      return;

    }

    this.dialogRef.close(false);

  }


  get appointmentIdControl() {

    return this.form.controls
      .appointmentId;

  }


  get totalAmountControl() {

    return this.form.controls
      .totalAmount;

  }

}