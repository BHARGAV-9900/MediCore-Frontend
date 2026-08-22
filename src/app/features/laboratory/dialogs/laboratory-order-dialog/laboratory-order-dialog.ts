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

import { MATERIAL_MODULES }
from '../../../../shared/material/material';

import { LaboratoryOrder }
from '../../models/laboratory-order';

import { CreateLaboratoryOrder }
from '../../models/create-laboratory-order';

import { LaboratoryOrderService }
from '../../services/laboratory-order.service';

import { LaboratoryTestService }
from '../../services/laboratory-test.service';

import { LaboratoryTest }
from '../../models/laboratory-test';

import { AppointmentService }
from '../../../appointment/services/appointment.service';

import { Appointment }
from '../../../appointment/models/appointment';

import { NotificationService }
from '../../../../core/services/notification.service';


@Component({
  selector: 'app-laboratory-order-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './laboratory-order-dialog.html',

  styleUrl:
    './laboratory-order-dialog.scss'
})
export class LaboratoryOrderDialog {

  private readonly fb =
    inject(FormBuilder);

  private readonly service =
    inject(LaboratoryOrderService);

  private readonly laboratoryTestService =
    inject(LaboratoryTestService);

  private readonly appointmentService =
    inject(AppointmentService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef);


  readonly laboratoryOrder:
    LaboratoryOrder | undefined;


  appointments: Appointment[] = [];

  laboratoryTests: LaboratoryTest[] = [];


  loading = false;

  loadingData = false;


  form = this.fb.nonNullable.group({

    appointmentId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    laboratoryTestId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]

  });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: LaboratoryOrder | undefined
  ) {

    this.laboratoryOrder = data;

    if (data) {

      this.form.patchValue({

        appointmentId:
          data.appointmentId,

        laboratoryTestId:
          data.laboratoryTestId

      });

    }


    this.loadDropdownData();

  }


  get isEditMode(): boolean {

    return !!this.laboratoryOrder;

  }


  get dialogTitle(): string {

    return this.isEditMode

      ? 'Edit Laboratory Order'

      : 'Add Laboratory Order';

  }


  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }

    return this.isEditMode
      ? 'Update Order'
      : 'Save Order';

  }


  loadDropdownData(): void {

    this.loadingData = true;


    this.appointmentService
      .getAll()
      .subscribe({

        next: response => {

          this.appointments =
            response.data;

          this.loadLaboratoryTests();

        },

        error: error => {

          console.error(error);

          this.loadingData = false;

          this.notification.error(
            'Unable to load appointments'
          );

        }

      });

  }


  loadLaboratoryTests(): void {

    this.laboratoryTestService
      .getAll()
      .subscribe({

        next: response => {

          this.laboratoryTests =
            response.data;

          this.loadingData = false;

        },

        error: error => {

          console.error(error);

          this.loadingData = false;

          this.notification.error(
            'Unable to load laboratory tests'
          );

        }

      });

  }


  save(): void {

    if (
      this.form.invalid ||
      this.loadingData
    ) {

      this.form.markAllAsTouched();

      return;

    }


    const formValue =
      this.form.getRawValue();


    const model:
      CreateLaboratoryOrder = {

      appointmentId:
        Number(formValue.appointmentId),

      laboratoryTestId:
        Number(formValue.laboratoryTestId)

    };


    this.loading = true;


    if (this.isEditMode) {

      this.update(model);

    }
    else {

      this.create(model);

    }

  }


  private create(
    model: CreateLaboratoryOrder
  ): void {

    this.service
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Laboratory order created successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;


          const message =
            error?.status === 409
              ? 'This laboratory test has already been ordered for this appointment.'
              : error?.error?.message ??
                'Unable to create laboratory order';


          this.notification.error(message);

        }

      });

  }


  private update(
    model: CreateLaboratoryOrder
  ): void {

    if (!this.laboratoryOrder) {

      return;

    }


    this.service
      .update(
        this.laboratoryOrder.id,
        model
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Laboratory order updated successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          const message =
            error?.status === 409
              ? 'This laboratory test has already been ordered for this appointment.'
              : error?.error?.message ??
                'Unable to update laboratory order';

          this.notification.error(message);

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


  get laboratoryTestIdControl() {

    return this.form.controls.laboratoryTestId;

  }

}