import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { Doctor } from '../../models/doctor';
import { CreateDoctor } from '../../models/create-doctor';
import { UpdateDoctor } from '../../models/update-doctor';

import { DoctorService } from '../../services/doctor.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { Department } from '../../../department/models/department';
import { DepartmentService } from '../../../department/services/department.service';

@Component({
  selector: 'app-doctor-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './doctor-dialog.html',
  styleUrl: './doctor-dialog.scss'
})
export class DoctorDialog implements OnInit {

  private readonly fb = inject(FormBuilder);

  private readonly dialogRef =
    inject(MatDialogRef<DoctorDialog>);

  private readonly service =
    inject(DoctorService);

  private readonly notification =
    inject(NotificationService);

  private readonly departmentService =
    inject(DepartmentService);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true
  }) as Doctor | null;

  departments: Department[] = [];

  loadingDepartments = false;

  saving = false;

  form = this.fb.group({

    firstName: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    lastName: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]
    ],

    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(20)
      ]
    ],

    specialization: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    experienceYears: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    consultationFee: [
      0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    departmentId: [
      null as number | null,
      Validators.required
    ]

  });

  ngOnInit(): void {

    this.loadDepartments();

    if (this.data) {

      this.form.patchValue({

        firstName: this.data.firstName,

        lastName: this.data.lastName,

        email: this.data.email,

        phoneNumber: this.data.phoneNumber,

        specialization: this.data.specialization,

        experienceYears: this.data.experienceYears,

        consultationFee: this.data.consultationFee,

        departmentId: this.data.departmentId

      });

    }

  }

  loadDepartments(): void {

    this.loadingDepartments = true;

    this.departmentService.getAll().subscribe({

      next: response => {

        this.departments = response.data ?? [];

        this.loadingDepartments = false;

      },

      error: error => {

        console.error(
          'Unable to load departments:',
          error
        );

        this.loadingDepartments = false;

        this.notification.error(
          'Unable to load departments'
        );

      }

    });

  }

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    return error?.error?.message
      ?? error?.error?.title
      ?? error?.message
      ?? fallback;

  }

  createDoctor(): void {

    const model: CreateDoctor = {

      firstName: this.form.value.firstName!.trim(),

      lastName: this.form.value.lastName!.trim(),

      email: this.form.value.email!.trim(),

      phoneNumber: this.form.value.phoneNumber!.trim(),

      specialization:
        this.form.value.specialization!.trim(),

      experienceYears:
        this.form.value.experienceYears!,

      consultationFee:
        this.form.value.consultationFee!,

      departmentId:
        this.form.value.departmentId!

    };

    this.saving = true;

    this.service.create(model).subscribe({

      next: () => {

        this.notification.success(
          'Doctor created successfully'
        );

        this.saving = false;

        this.dialogRef.close(true);

      },

      error: error => {

        console.error(
          'Unable to create doctor:',
          error
        );

        this.saving = false;

        this.notification.error(
          this.getErrorMessage(
            error,
            'Unable to create doctor'
          )
        );

      }

    });

  }

  updateDoctor(): void {

    const model: UpdateDoctor = {

      id: this.data!.id,

      firstName: this.form.value.firstName!.trim(),

      lastName: this.form.value.lastName!.trim(),

      email: this.form.value.email!.trim(),

      phoneNumber: this.form.value.phoneNumber!.trim(),

      specialization:
        this.form.value.specialization!.trim(),

      experienceYears:
        this.form.value.experienceYears!,

      consultationFee:
        this.form.value.consultationFee!,

      departmentId:
        this.form.value.departmentId!

    };

    this.saving = true;

    this.service.update(model).subscribe({

      next: () => {

        this.notification.success(
          'Doctor updated successfully'
        );

        this.saving = false;

        this.dialogRef.close(true);

      },

      error: error => {

        console.error(
          'Unable to update doctor:',
          error
        );

        this.saving = false;

        this.notification.error(
          this.getErrorMessage(
            error,
            'Unable to update doctor'
          )
        );

      }

    });

  }

  save(): void {

    if (this.saving) {
      return;
    }

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    if (this.data) {

      this.updateDoctor();

    } else {

      this.createDoctor();

    }

  }

  close(): void {

    if (this.saving) {
      return;
    }

    this.dialogRef.close();

  }

}
