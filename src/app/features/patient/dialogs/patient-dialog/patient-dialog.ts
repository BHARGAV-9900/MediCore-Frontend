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

interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
}

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

  readonly maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  })();

  readonly countries: CountryOption[] = [
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'SG', name: 'Singapore', dialCode: '+65' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64' }
  ];

  form = this.fb.group({
    firstName: this.fb.control('', [
      Validators.required,
      Validators.maxLength(100)
    ]),

    lastName: this.fb.control('', [
      Validators.required,
      Validators.maxLength(100)
    ]),

    dateOfBirth: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
    ]),

    gender: this.fb.control<number | null>(null, Validators.required),

    bloodGroup: this.fb.control<number | null>(null, Validators.required),

    countryCode: this.fb.control('IN', Validators.required),

    phoneNumber: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{7,12}$/)
    ]),

    email: this.fb.control('', [
      Validators.required,
      Validators.email
    ]),

    address: this.fb.control('', Validators.maxLength(500)),

    emergencyContactName: this.fb.control('', Validators.maxLength(100)),

    emergencyCountryCode: this.fb.control('IN', Validators.required),

    emergencyContactPhone: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{7,12}$/)
    ]),

    insuranceNumber: this.fb.control('', Validators.maxLength(100))
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

    const patientPhone = this.splitInternationalPhone(this.data.phoneNumber);
    const emergencyPhone = this.splitInternationalPhone(
      this.data.emergencyContactPhone
    );

    this.form.patchValue({
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      dateOfBirth: this.data.dateOfBirth
        ? new Date(this.data.dateOfBirth).toISOString().split('T')[0]
        : '',
      gender: this.mapGender(this.data.gender),
      bloodGroup: this.mapBloodGroup(this.data.bloodGroup),
      countryCode: patientPhone.countryCode,
      phoneNumber: patientPhone.localNumber,
      email: this.data.email,
      address: this.data.address,
      emergencyContactName: this.data.emergencyContactName,
      emergencyCountryCode: emergencyPhone.countryCode,
      emergencyContactPhone: emergencyPhone.localNumber,
      insuranceNumber: this.data.insuranceNumber
    });
  }

  save(): void {
    if (!this.isPhoneLengthValid('phoneNumber')) {
      this.form.controls.phoneNumber.setErrors({ phoneLength: true });
    }

    if (!this.isPhoneLengthValid('emergencyContactPhone')) {
      this.form.controls.emergencyContactPhone.setErrors({ phoneLength: true });
    }

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
      firstName: this.form.value.firstName!.trim(),
      lastName: this.form.value.lastName!.trim(),
      dateOfBirth: this.form.value.dateOfBirth!,
      gender: this.form.value.gender!,
      bloodGroup: this.form.value.bloodGroup!,
      phoneNumber: this.buildInternationalPhone(
        this.form.value.countryCode!,
        this.form.value.phoneNumber!
      ),
      email: this.form.value.email!.trim().toLowerCase(),
      address: this.form.value.address?.trim() ?? '',
      emergencyContactName: this.form.value.emergencyContactName?.trim() ?? '',
      emergencyContactPhone: this.buildInternationalPhone(
        this.form.value.emergencyCountryCode!,
        this.form.value.emergencyContactPhone!
      ),
      insuranceNumber: this.form.value.insuranceNumber?.trim() ?? ''
    };

    this.submitCreatePatient(model);
  }

  private submitCreatePatient(model: CreatePatient): void {
    this.service.create(model).subscribe({
      next: () => {
        this.notification.success('Patient created successfully');
        this.dialogRef.close(true);
      },
      error: error => {
        console.error('Create patient failed:', error);
        this.saving = false;
        this.notification.error(this.getConflictMessage(error));
      }
    });
  }

  private updatePatient(): void {
    const model: UpdatePatient = {
      id: this.data!.id,
      firstName: this.form.value.firstName!.trim(),
      lastName: this.form.value.lastName!.trim(),
      dateOfBirth: this.form.value.dateOfBirth!,
      gender: this.form.value.gender!,
      bloodGroup: this.form.value.bloodGroup!,
      phoneNumber: this.buildInternationalPhone(
        this.form.value.countryCode!,
        this.form.value.phoneNumber!
      ),
      email: this.form.value.email!.trim().toLowerCase(),
      address: this.form.value.address?.trim() ?? '',
      emergencyContactName: this.form.value.emergencyContactName?.trim() ?? '',
      emergencyContactPhone: this.buildInternationalPhone(
        this.form.value.emergencyCountryCode!,
        this.form.value.emergencyContactPhone!
      ),
      insuranceNumber: this.form.value.insuranceNumber?.trim() ?? ''
    };

    this.service.update(model).subscribe({
      next: () => {
        this.notification.success('Patient updated successfully');
        this.dialogRef.close(true);
      },
      error: error => {
        console.error('Update patient failed:', error);
        this.saving = false;
        this.notification.error(this.getConflictMessage(error));
      }
    });
  }

  private getConflictMessage(error: any): string {
    const body = error?.error;

    const message =
      body?.message ??
      body?.Message ??
      body?.title ??
      body?.Title;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    const errors = body?.errors ?? body?.Errors;

    if (Array.isArray(errors) && errors.length > 0) {
      return errors.join(' ');
    }

    if (typeof body === 'string' && body.trim()) {
      return body;
    }

    if (error?.status === 409) {
      return 'A patient with the same email or phone number already exists.';
    }

    if (error?.status === 400) {
      return 'Please check the patient details and try again.';
    }

    return 'Unable to save patient';
  }

  private buildInternationalPhone(
    countryCode: string,
    localNumber: string
  ): string {
    const country = this.countries.find(x => x.code === countryCode)
      ?? this.countries[0];

    const digits = localNumber.replace(/\D/g, '');

    return `${country.dialCode}${digits}`;
  }

  private splitInternationalPhone(phoneNumber: string | null | undefined): {
    countryCode: string;
    localNumber: string;
  } {
    const value = (phoneNumber ?? '').trim();

    if (!value.startsWith('+')) {
      return {
        countryCode: 'IN',
        localNumber: value.replace(/\D/g, '')
      };
    }

    const matchingCountries = this.countries
      .filter(country => value.startsWith(country.dialCode))
      .sort((a, b) => b.dialCode.length - a.dialCode.length);

    const country = matchingCountries[0];

    if (!country) {
      return {
        countryCode: 'IN',
        localNumber: value.replace(/\D/g, '').replace(/^91/, '')
      };
    }

    return {
      countryCode: country.code,
      localNumber: value.substring(country.dialCode.length).replace(/\D/g, '')
    };
  }

  private isPhoneLengthValid(
    controlName: 'phoneNumber' | 'emergencyContactPhone'
  ): boolean {
    const control = this.form.controls[controlName];
    const value = control.value?.replace(/\D/g, '') ?? '';

    return value.length >= 7 && value.length <= 12;
  }

  private mapGender(value: string | number): number | null {
    if (typeof value === 'number') {
      return value;
    }

    const map: Record<string, number> = {
      Male: 1,
      Female: 2,
      Other: 3
    };

    return map[value] ?? null;
  }

  private mapBloodGroup(value: string | number): number | null {
    if (typeof value === 'number') {
      return value;
    }

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
