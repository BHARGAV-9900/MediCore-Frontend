import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UpdatePatient } from '../../models/update-patient';
import { CreatePatient } from '../../models/create-patient';



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

  private readonly dialogRef =
      inject(MatDialogRef<PatientDialog>);
  
  private readonly notification =
  inject(NotificationService);

  readonly data = inject(MAT_DIALOG_DATA, {
      optional: true
  }) as Patient | null;
  

  private readonly service = inject(PatientService);

    form = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    dateOfBirth: this.fb.control<string>('', Validators.required),

    gender: this.fb.control<number | null>(null, Validators.required),

    bloodGroup: this.fb.control<number | null>(null, Validators.required),

    phoneNumber: ['', Validators.required],

    email: ['', Validators.email],

    address: [''],

    emergencyContactName: [''],

    emergencyContactPhone: [''],

    insuranceNumber: ['']

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

  console.log('Patient Data:', this.data);

  if (this.data) {

    this.form.patchValue({

    firstName: this.data.firstName,

    lastName: this.data.lastName,

    dateOfBirth: this.data.dateOfBirth
      ? new Date(this.data.dateOfBirth).toISOString().split('T')[0]
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

}
createPatient(): void {

    const model: CreatePatient = {

        firstName: this.form.value.firstName!,

        lastName: this.form.value.lastName!,

        dateOfBirth: this.form.value.dateOfBirth!,

        gender: this.form.value.gender!,

        bloodGroup: this.form.value.bloodGroup!,

        phoneNumber: this.form.value.phoneNumber!,

        email: this.form.value.email ?? '',

        address: this.form.value.address ?? '',

        emergencyContactName: this.form.value.emergencyContactName ?? '',

        emergencyContactPhone: this.form.value.emergencyContactPhone ?? '',

        insuranceNumber: this.form.value.insuranceNumber ?? ''

    };

    this.service.create(model).subscribe({

        next: () => {

            this.dialogRef.close(true);

        },

        error: error => {

            console.error(error);

        }

    });

}
updatePatient(): void {

  const model: UpdatePatient = {

    id: this.data!.id,

    firstName: this.form.value.firstName!,

    lastName: this.form.value.lastName!,

    dateOfBirth: this.form.value.dateOfBirth!,

    gender: this.form.value.gender!,

    bloodGroup: this.form.value.bloodGroup!,

    phoneNumber: this.form.value.phoneNumber!,

    email: this.form.value.email ?? '',

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

    }

  });

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

    this.dialogRef.close();

  }

  save(): void {

      if (this.form.invalid) {

          return;

      }

      if (this.data) {

          this.updatePatient();

      }
      else {

          this.createPatient();

      }

  }

}