import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  localMin: number;
  localMax: number;
}

@Component({
  selector: 'app-patient-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ...MATERIAL_MODULES],
  templateUrl: './patient-dialog.html',
  styleUrl: './patient-dialog.scss'
})
export class PatientDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PatientDialog>);
  private readonly service = inject(PatientService);
  private readonly notification = inject(NotificationService);

  readonly data = inject(MAT_DIALOG_DATA, { optional: true }) as Patient | null;

  saving = false;

  readonly countries: CountryOption[] = [
    { code: 'IN', name: 'India', dialCode: '+91', localMin: 10, localMax: 10 },
    { code: 'US', name: 'United States', dialCode: '+1', localMin: 10, localMax: 10 },
    { code: 'CA', name: 'Canada', dialCode: '+1', localMin: 10, localMax: 10 },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', localMin: 10, localMax: 10 },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', localMin: 9, localMax: 9 },
    { code: 'AU', name: 'Australia', dialCode: '+61', localMin: 9, localMax: 9 },
    { code: 'SG', name: 'Singapore', dialCode: '+65', localMin: 8, localMax: 8 },
    { code: 'DE', name: 'Germany', dialCode: '+49', localMin: 10, localMax: 11 },
    { code: 'FR', name: 'France', dialCode: '+33', localMin: 9, localMax: 9 },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64', localMin: 9, localMax: 9 }
  ];

  selectedPhoneCountry = 'IN';
  selectedEmergencyCountry = 'IN';

  readonly maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  })();

  form = this.fb.group({
    firstName: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    lastName: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    dateOfBirth: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
    ]),
    gender: this.fb.control<number | null>(null, Validators.required),
    bloodGroup: this.fb.control<number | null>(null, Validators.required),
    phoneNumber: this.fb.control('', [Validators.required, Validators.pattern(/^\d+$/)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    address: this.fb.control('', [Validators.required, Validators.maxLength(500)]),
    emergencyContactName: this.fb.control('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    emergencyContactPhone: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d+$/)
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

  get selectedCountry(): CountryOption {
    return this.getCountry(this.selectedPhoneCountry);
  }

  get selectedEmergencyCountry(): CountryOption {
    return this.getCountry(this.selectedEmergencyCountry);
  }

  ngOnInit(): void {
    if (!this.data) {
      return;
    }

    const phone = this.parseStoredPhone(this.data.phoneNumber);
    const emergencyPhone = this.parseStoredPhone(this.data.emergencyContactPhone);

    this.selectedPhoneCountry = phone.countryCode;
    this.selectedEmergencyCountry = emergencyPhone.countryCode;

    this.form.patchValue({
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      dateOfBirth: this.data.dateOfBirth
        ? new Date(this.data.dateOfBirth).toISOString().split('T')[0]
        : '',
      gender: this.mapGender(this.data.gender),
      bloodGroup: this.mapBloodGroup(this.data.bloodGroup),
      phoneNumber: phone.localNumber,
      email: this.data.email,
      address: this.data.address,
      emergencyContactName: this.data.emergencyContactName,
      emergencyContactPhone: emergencyPhone.localNumber,
      insuranceNumber: this.data.insuranceNumber
    });
  }

  onPhoneCountryChange(countryCode: string): void {
    this.selectedPhoneCountry = countryCode;
    this.form.controls.phoneNumber.setValue('');
    this.form.controls.phoneNumber.markAsUntouched();
  }

  onEmergencyCountryChange(countryCode: string): void {
    this.selectedEmergencyCountry = countryCode;
    this.form.controls.emergencyContactPhone.setValue('');
    this.form.controls.emergencyContactPhone.markAsUntouched();
  }

  sanitizePhoneNumber(
    controlName: 'phoneNumber' | 'emergencyContactPhone',
    event: Event
  ): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 12);

    this.form.controls[controlName].setValue(digits, { emitEvent: false });
  }

  save(): void {
    this.validatePhoneLengths();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.saving) {
      return;
    }

    const phoneNumber = this.buildInternationalPhone(
      this.form.value.phoneNumber ?? '',
      this.selectedPhoneCountry
    );

    const emergencyContactPhone = this.buildInternationalPhone(
      this.form.value.emergencyContactPhone ?? '',
      this.selectedEmergencyCountry
    );

    if (!phoneNumber || !emergencyContactPhone) {
      this.notification.error('Please enter valid phone numbers for the selected country.');
      return;
    }

    this.saving = true;

    if (this.data) {
      this.updatePatient(phoneNumber, emergencyContactPhone);
    } else {
      this.createPatient(phoneNumber, emergencyContactPhone);
    }
  }

  private validatePhoneLengths(): void {
    const phone = this.form.value.phoneNumber ?? '';
    const emergencyPhone = this.form.value.emergencyContactPhone ?? '';
    const phoneCountry = this.selectedCountry;
    const emergencyCountry = this.getCountry(this.selectedEmergencyCountry);

    if (phone.length < phoneCountry.localMin || phone.length > phoneCountry.localMax) {
      this.form.controls.phoneNumber.setErrors({ phoneLength: true });
    } else {
      this.removeError('phoneNumber', 'phoneLength');
    }

    if (
      emergencyPhone.length < emergencyCountry.localMin ||
      emergencyPhone.length > emergencyCountry.localMax
    ) {
      this.form.controls.emergencyContactPhone.setErrors({ phoneLength: true });
    } else {
      this.removeError('emergencyContactPhone', 'phoneLength');
    }
  }

  private removeError(
    controlName: 'phoneNumber' | 'emergencyContactPhone',
    errorKey: string
  ): void {
    const control = this.form.controls[controlName];
    const errors = { ...(control.errors ?? {}) };
    delete errors[errorKey];
    control.setErrors(Object.keys(errors).length ? errors : null);
  }

  private buildInternationalPhone(localNumber: string, countryCode: string): string | null {
    const digits = localNumber.replace(/\D/g, '');
    const country = this.getCountry(countryCode);

    if (digits.length < country.localMin || digits.length > country.localMax) {
      return null;
    }

    const fullNumber = `${country.dialCode}${digits}`;
    const digitsOnly = fullNumber.replace('+', '');

    return digitsOnly.length <= 15 ? fullNumber : null;
  }

  private parseStoredPhone(value: string | null | undefined): {
    countryCode: string;
    localNumber: string;
  } {
    const raw = value?.trim() ?? '';

    if (!raw) {
      return { countryCode: 'IN', localNumber: '' };
    }

    const normalized = raw.startsWith('+') ? raw : `+${raw}`;
    const country = this.countries.find(item => normalized.startsWith(item.dialCode));

    if (!country) {
      return { countryCode: 'IN', localNumber: raw.replace(/\D/g, '') };
    }

    return {
      countryCode: country.code,
      localNumber: normalized.slice(country.dialCode.length).replace(/\D/g, '')
    };
  }

  private getCountry(countryCode: string): CountryOption {
    return this.countries.find(country => country.code === countryCode) ?? this.countries[0];
  }

  private createPatient(phoneNumber: string, emergencyContactPhone: string): void {
    const model: CreatePatient = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      dateOfBirth: this.form.value.dateOfBirth!,
      gender: this.form.value.gender!,
      bloodGroup: this.form.value.bloodGroup!,
      phoneNumber,
      email: this.form.value.email!.trim(),
      address: this.form.value.address!.trim(),
      emergencyContactName: this.form.value.emergencyContactName!.trim(),
      emergencyContactPhone,
      insuranceNumber: this.form.value.insuranceNumber?.trim() ?? ''
    };

    this.service.getAll().subscribe({
      next: response => {
        const email = model.email.toLowerCase();
        const duplicateEmail = response.data.some(patient =>
          patient.email?.trim().toLowerCase() === email
        );
        const duplicatePhone = response.data.some(patient =>
          this.normalizeStoredPhone(patient.phoneNumber) === model.phoneNumber
        );

        if (duplicateEmail && duplicatePhone) {
          this.saving = false;
          this.notification.error('A patient with this email and phone number already exists.');
          return;
        }

        if (duplicateEmail) {
          this.saving = false;
          this.notification.error('A patient with this email already exists.');
          return;
        }

        if (duplicatePhone) {
          this.saving = false;
          this.notification.error('A patient with this phone number already exists.');
          return;
        }

        this.submitCreatePatient(model);
      },
      error: error => {
        console.error('Unable to check existing patients:', error);
        this.submitCreatePatient(model);
      }
    });
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

  private updatePatient(phoneNumber: string, emergencyContactPhone: string): void {
    const model: UpdatePatient = {
      id: this.data!.id,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      dateOfBirth: this.form.value.dateOfBirth!,
      gender: this.form.value.gender!,
      bloodGroup: this.form.value.bloodGroup!,
      phoneNumber,
      email: this.form.value.email!.trim(),
      address: this.form.value.address!.trim(),
      emergencyContactName: this.form.value.emergencyContactName!.trim(),
      emergencyContactPhone,
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

  private normalizeStoredPhone(value: string | null | undefined): string {
    const raw = value?.trim() ?? '';
    if (!raw) {
      return '';
    }
    return raw.startsWith('+') ? raw : `+91${raw}`;
  }

  private getConflictMessage(error: any): string {
    const body = error?.error;
    const message = body?.message ?? body?.Message ?? body?.title ?? body?.Title;

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

  private mapGender(value: string | number): number | null {
    if (typeof value === 'number') {
      return value;
    }

    const map: Record<string, number> = { Male: 1, Female: 2, Other: 3 };
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
