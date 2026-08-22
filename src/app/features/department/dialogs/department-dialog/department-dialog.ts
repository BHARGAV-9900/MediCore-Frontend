import { Component, Inject, inject } from '@angular/core';
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

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';
import { CreateDepartment } from '../../models/create-department';
import { UpdateDepartment } from '../../models/update-department';

import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-department-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './department-dialog.html',
  styleUrl: './department-dialog.scss'
})
export class DepartmentDialog {

  private readonly fb = inject(FormBuilder);

  private readonly service =
    inject(DepartmentService);

  private readonly dialogRef =
    inject(MatDialogRef<DepartmentDialog>);

  private readonly notification =
    inject(NotificationService);

  /**
   * True when editing an existing department.
   * False when creating a new department.
   */
  readonly isEdit: boolean;

  /**
   * Department passed from the list page.
   *
   * Existing department = Edit mode
   * null/undefined = Create mode
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Department | null | undefined
  ) {

    this.isEdit = !!data;

    /**
     * EDIT MODE
     *
     * Populate the form with the selected
     * department information.
     */
    if (data) {

      this.form.patchValue({

        name: data.name,

        description: data.description ?? ''

      });

    }

    /**
     * CREATE MODE
     *
     * Always start with an empty form.
     *
     * This prevents an old department value
     * from appearing when clicking
     * "Add Department".
     */
    else {

      this.form.reset({

        name: '',

        description: ''

      });

    }

  }

  /**
   * Department form.
   */
  form = this.fb.group({

    name: this.fb.control(
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ),

    description: this.fb.control<string>(
      '',
      Validators.maxLength(500)
    )

  });

  /**
   * Save department.
   *
   * Handles both:
   * CREATE
   * UPDATE
   */
  save(): void {

    /**
     * Validate form before sending
     * request to the backend.
     */
    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    /**
     * ==================================================
     * UPDATE DEPARTMENT
     * ==================================================
     */
    if (this.isEdit && this.data) {

      const request: UpdateDepartment = {

        id: this.data.id,

        name: this.form.value.name!,

        description:
          this.form.value.description ?? ''

      };

      this.service.update(request).subscribe({

        next: () => {

          this.notification.success(
            'Department updated successfully'
          );

          /**
           * true tells the department list
           * to reload the departments.
           */
          this.dialogRef.close(true);

        },

        error: error => {

          console.error(
            'Failed to update department:',
            error
          );

          this.notification.error(
            this.getErrorMessage(
              error,
              'Unable to update department'
            )
          );

        }

      });

      return;
    }

    /**
     * ==================================================
     * CREATE DEPARTMENT
     * ==================================================
     */

    const request: CreateDepartment = {

      name: this.form.value.name!,

      description:
        this.form.value.description ?? ''

    };

    this.service.create(request).subscribe({

      next: () => {

        this.notification.success(
          'Department created successfully'
        );

        /**
         * true tells the department list
         * to reload the departments.
         */
        this.dialogRef.close(true);

      },

      error: error => {

        console.error(
          'Failed to create department:',
          error
        );

        /**
         * IMPORTANT:
         *
         * If backend returns:
         *
         * "Department already exists."
         *
         * show that message instead of:
         *
         * "Unable to create department"
         */
        this.notification.error(
          this.getErrorMessage(
            error,
            'Unable to create department'
          )
        );

      }

    });

  }

  /**
   * Extract the actual error message
   * returned by the backend.
   */
  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    return (
      error?.error?.message
      ||
      error?.error?.Message
      ||
      error?.message
      ||
      fallback
    );

  }

  /**
   * Close dialog without saving.
   */
  cancel(): void {

    this.dialogRef.close();

  }

}