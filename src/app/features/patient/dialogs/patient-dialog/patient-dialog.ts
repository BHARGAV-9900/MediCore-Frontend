import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { CreatePatient } from '../../models/create-patient';
import { UpdatePatient } from '../../models/update-patient';

@Component({
  selector: 'app-patient-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './patient-dialog.html',
  styleUrl: './patient-dialog.scss'
})
export class PatientDialog implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PatientDialog>);
  private readonly service = inject(PatientService);
  private readonly notification = inject(NotificationService);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true
  }) as Patient | null;

  saving = false;

  readonly maxDate = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    firstName: this.fb.control(
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ),

    lastName: this.fb.control(
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ),

    dateOfBirth: this.fb.control(
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
      ]
    ),

    gender: this.fb.control<number | null>(
      null,
      Validators.required
    ),

    bloodGroup: this.fb.control<number | null>(
      null,
      Validators.required
    ),

    phoneNumber: this.fb.control(
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{10,15}$/),
        Validators.maxLength(15)
      ]
    ),

    email: this.fb.control(
      '',
      [
        Validators.required,
        Validators.email
      ]
    ),

    address: this.fb.control(
      '',
      Validators.maxLength(500)
    ),

    emergencyContactName: this.fb.control(
      '',
      Validators.maxLength(100)
    ),

    emergencyContactPhone: this.fb.control(
      '',
      [
        Validators.maxLength(15),
        Validators.pattern(/^\d{10,15}$/)
      ]
    ),

    insuranceNumber: this.fb.control(
      '',
      Validators.maxLength(100)
    )
  });

  genders = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' }
  ];

  bloodGroups = [
    { id: 1, name: 'A+' },
    { id: 2, name: 'A-' },
    { id: 3, name: 'B+' },
    { id: 4, name: 'B-' },
    { id: 5, name: 'AB+' },
    { id: 6, name: 'AB-' },
    { id: 7, name: 'O+' },
    { id: 8, name: 'O-' }
  ];

  ngOnInit(): void {
    if (!this.data) {
      return;
    }

    this.form.patchValue({
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      dateOfBirth: this.data.dateOfBirth
        ? new Date(this.data.dateOfBirth)
            .toISOString()
            .split('T')[0]
        : '',
      gender: this.mapGender(this.data.gender),
      bloodGroup: this.mapBloodGroup(this.data.bloodGroup),
      phoneNumber: this.data.phoneNumber,
      email: this.data.email,
      address: this.data.address,
      emergencyContactName: this.data.emergencyContactName,
      emergencyContactPhone: this.data.emergencyContactPhone,
      insuranceNumber: this.data.insuranceNumber
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.saving) {
      return;
    }

    this.saving = true;

    if (this.data) {
      this.updatePatient();
    } else {
      this.createPatient();
    }
  }

  private createPatient(): void {
    const model: CreatePatient = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      dateOfBirth: this.form.value.dateOfBirth!,
      gender: this.form.value.gender!,
      bloodGroup: this.form.value.bloodGroup!,
      phoneNumber: this.form.value.phoneNumber!,
      email: this.form.value.email!,
      address: this.form.value.address ?? '',
      emergencyContactName: this.form.value.emergencyContactName ?? '',
      emergencyContactPhone: this.form.value.emergencyContactPhone ?? '',
      insuranceNumber: this.form.value.insuranceNumber ?? ''
    };

    this.service.create(model).subscribe({
      next: () => {
        this.notification.success('Patient created successfully');
        this.dialogRef.close(true);
      },
      error: error => {
        console.error(error);
        this.saving = false;

        const message = this.getConflictMessage(error);

        this.notification.error(message);
      }
    });
  }

  private updatePatient(): void {
    const model: UpdatePatient = {
      id: this.data!.id,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      dateOfBirth: this.form.value.dateOfBirth!,
      gender: this.form.value.gender!,
      bloodGroup: this.form.value.bloodGroup!,
      phoneNumber: this.form.value.phoneNumber!,
      email: this.form.value.email!,
      address: this.form.value.address ?? '',
      emergencyContactName: this.form.value.emergencyContactName ?? '',
      emergencyContactPhone: this.form.value.emergencyContactPhone ?? '',
      insuranceNumber: this.form.value.insuranceNumber ?? ''
    };

    this.service.update(model).subscribe({
      next: () => {
        this.notification.success('Patient updated successfully');
        this.dialogRef.close(true);
      },
      error: error => {
        console.error(error);
        this.saving = false;

        const message = this.getConflictMessage(error);

        this.notification.error(message);
      }
    });
  }

  private getConflictMessage(error: any): string {
    if (error?.status === 409) {
      if (typeof error?.error === 'string') {
        return error.error;
      }

      if (error?.error?.message) {
        return error.error.message;
      }

      if (error?.error?.title) {
        return error.error.title;
      }
    }

    return 'Unable to save patient';
  }

  private mapGender(value: string): number | null {
    const map: Record<string, number> = {
      Male: 1,
      Female: 2,
      Other: 3
    };

    return map[value] ?? null;
  }

  private mapBloodGroup(value: string): number | null {
    const map: Record<string, number> = {
      APositive: 1,
      ANegative: 2,
      BPositive: 3,
      BNegative: 4,
      ABPositive: 5,
      ABNegative: 6,
      OPositive: 7,
      ONegative: 8
    };

    return map[value] ?? null;
  }

  close(): void {
    if (this.saving) {
      return;
    }

    this.dialogRef.close();
  }
}