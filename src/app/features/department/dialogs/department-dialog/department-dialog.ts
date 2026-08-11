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
    inject(MatDialogRef);

  private readonly notification =
    inject(NotificationService);

  readonly isEdit: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Department | undefined
  ) {

    this.isEdit = !!data;

    if (data) {

      this.form.patchValue({

        name: data.name,

        description: data.description

      });

    }

  }

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

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    // UPDATE
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

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.notification.error(
            'Unable to update department'
          );

        }

      });

    }

    // CREATE
    else {

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

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.notification.error(
            'Unable to create department'
          );

        }

      });

    }

  }

  cancel(): void {

    this.dialogRef.close();

  }

}