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

import { LaboratoryResult }
  from '../../models/laboratory-result';

import { CreateLaboratoryResult }
  from '../../models/create-laboratory-result';

import { LaboratoryResultService }
  from '../../services/laboratory-result.service';

import { LaboratoryOrderService }
  from '../../services/laboratory-order.service';

import { LaboratoryOrder }
  from '../../models/laboratory-order';

import { NotificationService }
  from '../../../../core/services/notification.service';


@Component({
  selector: 'app-laboratory-result-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './laboratory-result-dialog.html',

  styleUrl: './laboratory-result-dialog.scss'
})
export class LaboratoryResultDialog {

  private readonly fb =
    inject(FormBuilder);

  private readonly resultService =
    inject(LaboratoryResultService);

  private readonly orderService =
    inject(LaboratoryOrderService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef<LaboratoryResultDialog>);


  readonly laboratoryResult:
    LaboratoryResult | undefined;


  laboratoryOrders:
    LaboratoryOrder[] = [];


  loading = false;

  loadingOrders = false;


  form = this.fb.nonNullable.group({

    laboratoryOrderId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    result: [
      '',
      [
        Validators.required,
        Validators.maxLength(4000)
      ]
    ],

    remarks: [
      '',
      [
        Validators.maxLength(2000)
      ]
    ]

  });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: LaboratoryResult | undefined
  ) {

    this.laboratoryResult = data;


    if (data) {

      this.form.patchValue({

        laboratoryOrderId:
          data.laboratoryOrderId,

        result:
          data.result,

        remarks:
          data.remarks ?? ''

      });

    }


    this.loadLaboratoryOrders();

  }


  get isEditMode(): boolean {

    return !!this.laboratoryResult;

  }


  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Laboratory Result'
      : 'Add Laboratory Result';

  }


  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update laboratory test result'
      : 'Enter the laboratory test result';

  }


  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }

    return this.isEditMode
      ? 'Update Result'
      : 'Save Result';

  }


  get laboratoryOrderIdControl() {

    return this.form.controls.laboratoryOrderId;

  }


  get resultControl() {

    return this.form.controls.result;

  }


  get remarksControl() {

    return this.form.controls.remarks;

  }


  loadLaboratoryOrders(): void {

    this.loadingOrders = true;


    this.orderService.getAll().subscribe({

      next: response => {

        const orders =
          response.data ?? [];


        /*
         * In CREATE mode:
         * exclude orders that already have a result.
         *
         * In EDIT mode:
         * keep the current order visible.
         */

        if (this.isEditMode) {

          this.resultService.getAll().subscribe({

            next: resultResponse => {

              const resultOrderIds =
                new Set(
                  (resultResponse.data ?? [])
                    .map(
                      result =>
                        result.laboratoryOrderId
                    )
                );


              this.laboratoryOrders =
                orders.filter(order =>
                  order.id ===
                    this.laboratoryResult!.laboratoryOrderId
                  ||
                  !resultOrderIds.has(order.id)
                );


              this.loadingOrders = false;

            },


            error: error => {

              console.error(error);

              this.loadingOrders = false;

              this.notification.error(
                'Unable to load laboratory results'
              );

            }

          });

        }
        else {

          this.resultService.getAll().subscribe({

            next: resultResponse => {

              const resultOrderIds =
                new Set(
                  (resultResponse.data ?? [])
                    .map(
                      result =>
                        result.laboratoryOrderId
                    )
                );


              this.laboratoryOrders =
                orders.filter(
                  order =>
                    !resultOrderIds.has(order.id)
                );


              this.loadingOrders = false;

            },


            error: error => {

              console.error(error);

              this.loadingOrders = false;

              this.notification.error(
                'Unable to determine available laboratory orders'
              );

            }

          });

        }

      },


      error: error => {

        console.error(error);

        this.loadingOrders = false;

        this.notification.error(
          'Unable to load laboratory orders'
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


    const result =
      formValue.result.trim();


    if (!result) {

      this.resultControl.setErrors({
        required: true
      });

      this.resultControl.markAsTouched();

      return;

    }


    this.loading = true;


    if (this.isEditMode) {

      this.updateResult(
        result,
        formValue.remarks.trim() || null
      );

    }
    else {

      this.createResult({

        laboratoryOrderId:
          Number(formValue.laboratoryOrderId),

        result,

        remarks:
          formValue.remarks.trim() || null

      });

    }

  }


  private createResult(
    model: CreateLaboratoryResult
  ): void {

    this.resultService
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Laboratory result created successfully'
          );

          this.dialogRef.close(true);

        },


        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to create laboratory result'
          );

        }

      });

  }


  private updateResult(
    result: string,
    remarks: string | null
  ): void {

    if (!this.laboratoryResult) {

      this.loading = false;

      return;

    }


    this.resultService
      .update(
        this.laboratoryResult.id,
        {
          result,
          remarks
        }
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Laboratory result updated successfully'
          );

          this.dialogRef.close(true);

        },


        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to update laboratory result'
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

}