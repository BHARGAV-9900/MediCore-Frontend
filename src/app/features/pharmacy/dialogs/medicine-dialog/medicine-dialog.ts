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

import { Medicine }
  from '../../models/medicine';

import { CreateMedicine }
  from '../../models/create-medicine';

import { MedicineService }
  from '../../services/medicine.service';

import { NotificationService }
  from '../../../../core/services/notification.service';


@Component({
  selector: 'app-medicine-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './medicine-dialog.html',

  styleUrl: './medicine-dialog.scss'
})
export class MedicineDialog {

  private readonly fb =
    inject(FormBuilder);

  private readonly service =
    inject(MedicineService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef<MedicineDialog>);


  readonly medicine:
    Medicine | undefined;


  loading = false;


  form = this.fb.group({

    name: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]
    ),

    manufacturer: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]
    ),

    unitPrice: this.fb.control<number | null>(
      null,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    )

  });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: Medicine | undefined
  ) {

    this.medicine = data;


    if (data) {

      this.form.patchValue({

        name:
          data.name,

        manufacturer:
          data.manufacturer,

        unitPrice:
          data.unitPrice

      });

    }

  }


  get isEditMode(): boolean {

    return !!this.medicine;

  }


  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Medicine'
      : 'Add Medicine';

  }


  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update medicine details'
      : 'Add a new medicine';

  }


  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }

    return this.isEditMode
      ? 'Update Medicine'
      : 'Save Medicine';

  }


  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const formValue =
      this.form.getRawValue();


    const model: CreateMedicine = {

      name:
        formValue.name.trim(),

      manufacturer:
        formValue.manufacturer.trim(),

      unitPrice:
        Number(formValue.unitPrice)

    };


    if (!model.name) {

      this.form.controls.name.setErrors({
        required: true
      });

      this.form.controls.name.markAsTouched();

      return;

    }


    if (!model.manufacturer) {

      this.form.controls.manufacturer.setErrors({
        required: true
      });

      this.form.controls.manufacturer.markAsTouched();

      return;

    }


    if (
      !Number.isFinite(model.unitPrice) ||
      model.unitPrice <= 0
    ) {

      this.form.controls.unitPrice.setErrors({
        min: true
      });

      this.form.controls.unitPrice.markAsTouched();

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
  model: CreateMedicine
): void {

  this.service
    .create(model)
    .subscribe({

      next: () => {

        this.loading = false;

        this.notification.success(
          'Medicine created successfully'
        );

        this.dialogRef.close(true);

      },

      error: error => {

        console.error(
          'Medicine create error:',
          error
        );

        this.loading = false;


        // 409 = duplicate medicine
        if (error?.status === 409) {

          const duplicateMessage =
            error?.error?.message ??
            error?.error?.Message ??
            'Medicine already exists.';

          this.notification.error(
            duplicateMessage
          );

          return;

        }


        // 400 = validation error
        if (error?.status === 400) {

          const validationMessage =
            error?.error?.message ??
            error?.error?.Message ??
            'Please check the entered medicine details.';

          this.notification.error(
            validationMessage
          );

          return;

        }


        // Other API errors
        const message =
          error?.error?.message ??
          error?.error?.Message ??
          error?.error?.title ??
          error?.message ??
          'Unable to create medicine';


        this.notification.error(
          message
        );

      }

    });

}


  private update(
    model: CreateMedicine
  ): void {

    if (!this.medicine) {

      this.loading = false;

      return;

    }


    this.service
      .update(
        this.medicine.id,
        model
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Medicine updated successfully'
          );

          this.dialogRef.close(true);

        },


        error: error => {

          console.error(
            'Medicine create error:',
            error
          );

          this.loading = false;


          // Handle duplicate medicine
          if (error?.status === 409) {

            const duplicateMessage =
              error?.error?.message ??
              error?.error?.Message ??
              'Medicine already exists.';

            this.notification.error(
              duplicateMessage
            );

            return;

          }


          // Handle validation errors
          if (error?.status === 400) {

            const validationMessage =
              error?.error?.message ??
              error?.error?.Message ??
              'Please check the entered medicine details.';

            this.notification.error(
              validationMessage
            );

            return;

          }


          // Handle other errors
          const message =
            error?.error?.message ??
            error?.error?.Message ??
            error?.error?.title ??
            error?.message ??
            'Unable to create medicine';


          this.notification.error(
            message
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


  get nameControl() {

    return this.form.controls.name;

  }


  get manufacturerControl() {

    return this.form.controls.manufacturer;

  }


  get unitPriceControl() {

    return this.form.controls.unitPrice;

  }

}