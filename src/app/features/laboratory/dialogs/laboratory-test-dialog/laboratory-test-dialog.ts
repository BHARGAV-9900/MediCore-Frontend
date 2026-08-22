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

import { LaboratoryTest }
from '../../models/laboratory-test';

import { CreateLaboratoryTest }
from '../../models/create-laboratory-test';

import { LaboratoryTestService }
from '../../services/laboratory-test.service';

import { NotificationService }
from '../../../../core/services/notification.service';

@Component({
  selector: 'app-laboratory-test-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './laboratory-test-dialog.html',
  styleUrl: './laboratory-test-dialog.scss'
})
export class LaboratoryTestDialog {

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(LaboratoryTestService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<LaboratoryTestDialog>);

  readonly laboratoryTest: LaboratoryTest | undefined;

  loading = false;

  form = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]
    ],

    // Start empty so the user can type the price directly.
    price: [
      '' as number | string,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    description: [
      '',
      [
        Validators.maxLength(1000)
      ]
    ]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: LaboratoryTest | undefined
  ) {
    this.laboratoryTest = data;

    if (data) {
      this.form.patchValue({
        name: data.name,
        price: data.price,
        description: data.description ?? ''
      });
    }
  }

  get isEditMode(): boolean {
    return !!this.laboratoryTest;
  }

  get dialogTitle(): string {
    return this.isEditMode
      ? 'Edit Laboratory Test'
      : 'Add Laboratory Test';
  }

  get submitButtonText(): string {
    if (this.loading) {
      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';
    }

    return this.isEditMode
      ? 'Update Test'
      : 'Save Test';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const model: CreateLaboratoryTest = {
      name: formValue.name.trim(),
      price: Number(formValue.price),
      description: formValue.description.trim() || null
    };

    if (!model.name || model.name.length < 2) {
      this.form.controls.name.setErrors({ required: true });
      this.form.controls.name.markAsTouched();
      return;
    }

    if (!Number.isFinite(model.price) || model.price <= 0) {
      this.form.controls.price.setErrors({ min: true });
      this.form.controls.price.markAsTouched();
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.update(model);
    } else {
      this.create(model);
    }
  }

  private create(model: CreateLaboratoryTest): void {
    // Check the existing laboratory tests first so the user receives a
    // meaningful duplicate message instead of a generic API error.
    this.service.getAll().subscribe({
      next: response => {
        const normalizedName = model.name.trim().toLowerCase();
        const alreadyExists = (response.data ?? []).some(test =>
          test.name.trim().toLowerCase() === normalizedName
        );

        if (alreadyExists) {
          this.loading = false;
          this.notification.error('Laboratory test already exists.');
          return;
        }

        this.createLaboratoryTest(model);
      },

      error: error => {
        // If the pre-check fails, still attempt the actual create operation.
        // The backend remains the final authority for duplicate protection.
        console.error('Laboratory test duplicate check error:', error);
        this.createLaboratoryTest(model);
      }
    });
  }

  private createLaboratoryTest(model: CreateLaboratoryTest): void {
    this.service.create(model).subscribe({
      next: () => {
        this.loading = false;

        this.notification.success(
          'Laboratory test created successfully'
        );

        this.dialogRef.close(true);
      },

      error: error => {
        console.error('Create laboratory test error:', error);

        this.loading = false;

        const apiMessage =
          error?.error?.message ??
          error?.error?.Message;

        if (
          error?.status === 409 ||
          String(apiMessage ?? '').toLowerCase().includes('already exists')
        ) {
          this.notification.error(
            'Laboratory test already exists.'
          );
          return;
        }

        this.notification.error(
          apiMessage ??
          'Unable to create laboratory test'
        );
      }
    });
  }

  private update(model: CreateLaboratoryTest): void {
    if (!this.laboratoryTest) {
      return;
    }

    this.service
      .update(this.laboratoryTest.id, model)
      .subscribe({
        next: () => {
          this.loading = false;

          this.notification.success(
            'Laboratory test updated successfully'
          );

          this.dialogRef.close(true);
        },

        error: error => {
          console.error('Update laboratory test error:', error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            error?.error?.Message ??
            'Unable to update laboratory test'
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

  get priceControl() {
    return this.form.controls.price;
  }

  get descriptionControl() {
    return this.form.controls.description;
  }
}