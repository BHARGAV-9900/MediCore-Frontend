import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
=======
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f

import { MATERIAL_MODULES } from '../../../../shared/material/material';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreatePatient } from '../../models/create-patient';
import { UpdatePatient } from '../../models/update-patient';

<<<<<<< HEAD
interface Country {
=======
interface CountryOption {
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
  code: string;
  dialCode: string;
<<<<<<< HEAD
  name: string;
  minLength: number;
  maxLength: number;
=======
  localMin: number;
  localMax: number;
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
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

<<<<<<< HEAD
  // =========================================================
  // DATE
  // =========================================================
=======
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
  selectedEmergencyCountryCode = 'IN';
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f

  readonly maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  })();

<<<<<<< HEAD
  // =========================================================
  // COUNTRIES
  // =========================================================

  countries: Country[] = [

    {
      code: 'IN',
      dialCode: '+91',
      name: 'India',
      minLength: 10,
      maxLength: 10
    },

    {
      code: 'US',
      dialCode: '+1',
      name: 'United States',
      minLength: 10,
      maxLength: 10
    },

    {
      code: 'CA',
      dialCode: '+1',
      name: 'Canada',
      minLength: 10,
      maxLength: 10
    },

    {
      code: 'GB',
      dialCode: '+44',
      name: 'United Kingdom',
      minLength: 10,
      maxLength: 10
    },

    {
      code: 'AU',
      dialCode: '+61',
      name: 'Australia',
      minLength: 9,
      maxLength: 9
    },

    {
      code: 'AE',
      dialCode: '+971',
      name: 'United Arab Emirates',
      minLength: 9,
      maxLength: 9
    },

    {
      code: 'SG',
      dialCode: '+65',
      name: 'Singapore',
      minLength: 8,
      maxLength: 8
    },

    {
      code: 'DE',
      dialCode: '+49',
      name: 'Germany',
      minLength: 10,
      maxLength: 11
    },

    {
      code: 'FR',
      dialCode: '+33',
      name: 'France',
      minLength: 9,
      maxLength: 9
    },

    {
      code: 'JP',
      dialCode: '+81',
      name: 'Japan',
      minLength: 10,
      maxLength: 10
    }

  ];

  // =========================================================
  // FORM
  // =========================================================

=======
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
  form = this.fb.group({
    firstName: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    lastName: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    dateOfBirth: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
    ]),
<<<<<<< HEAD

    gender: this.fb.control<number | null>(
      null,
      Validators.required
    ),

    bloodGroup: this.fb.control<number | null>(
      null,
      Validators.required
    ),

    // ---------------------------------------------------------
    // Patient phone
    // ---------------------------------------------------------

    countryCode: this.fb.control(
      'IN',
      Validators.required
    ),

    phoneNumber: this.fb.control(
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]
    ),

    // ---------------------------------------------------------
    // Contact
    // ---------------------------------------------------------

    email: this.fb.control('', [
      Validators.required,
      Validators.email
    ]),

    address: this.fb.control(
      '',
      Validators.maxLength(500)
    ),

    // ---------------------------------------------------------
    // Emergency contact
    // ---------------------------------------------------------

    emergencyContactName: this.fb.control(
      '',
      Validators.maxLength(100)
    ),

    emergencyCountryCode: this.fb.control(
      'IN',
      Validators.required
    ),

    emergencyContactPhone: this.fb.control(
      '',
      [
        Validators.pattern(/^\d+$/)
      ]
    ),

    // ---------------------------------------------------------
    // Insurance
    // ---------------------------------------------------------

    insuranceNumber: this.fb.control(
      '',
      Validators.maxLength(100)
    )

=======
    gender: this.fb.control<number | null>(null, Validators.required),
    bloodGroup: this.fb.control<number | null>(null, Validators.required),
    phoneNumber: this.fb.control('', [Validators.required, Validators.pattern(/^\d+$/)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    address: this.fb.control('', [Validators.required, Validators.maxLength(500)]),
    emergencyContactName: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    emergencyContactPhone: this.fb.control('', [Validators.required, Validators.pattern(/^\d+$/)]),
    insuranceNumber: this.fb.control('', Validators.maxLength(100))
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
  });

  // =========================================================
  // GENDER
  // =========================================================

  genders = [

    {
      id: 1,
      name: 'Male'
    },

    {
      id: 2,
      name: 'Female'
    },

    {
      id: 3,
      name: 'Other'
    }

  ];

  // =========================================================
  // BLOOD GROUP
  // =========================================================

  bloodGroups = [

    {
      id: 1,
      name: 'A+'
    },

    {
      id: 2,
      name: 'A-'
    },

    {
      id: 3,
      name: 'B+'
    },

    {
      id: 4,
      name: 'B-'
    },

    {
      id: 5,
      name: 'AB+'
    },

    {
      id: 6,
      name: 'AB-'
    },

    {
      id: 7,
      name: 'O+'
    },

    {
      id: 8,
      name: 'O-'
    }

  ];

<<<<<<< HEAD
  // =========================================================
  // INITIALIZATION
  // =========================================================
=======
  get selectedCountry(): CountryOption {
    return this.getCountry(this.selectedPhoneCountry);
  }

  get selectedEmergencyCountry(): CountryOption {
    return this.getCountry(this.selectedEmergencyCountryCode);
  }
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f

  ngOnInit(): void {
    if (!this.data) {
      return;
    }

<<<<<<< HEAD
    const phoneInfo =
      this.parseInternationalPhone(
        this.data.phoneNumber
      );

    const emergencyPhoneInfo =
      this.parseInternationalPhone(
        this.data.emergencyContactPhone
      );

    this.form.patchValue({

      firstName:
        this.data.firstName,

      lastName:
        this.data.lastName,

      dateOfBirth:
        this.data.dateOfBirth
          ? new Date(
              this.data.dateOfBirth
            )
              .toISOString()
              .split('T')[0]
          : '',

      gender:
        this.mapGender(
          this.data.gender
        ),

      bloodGroup:
        this.mapBloodGroup(
          this.data.bloodGroup
        ),

      countryCode:
        phoneInfo.countryCode,

      phoneNumber:
        phoneInfo.phoneNumber,

      email:
        this.data.email,

      address:
        this.data.address,

      emergencyContactName:
        this.data.emergencyContactName,

      emergencyCountryCode:
        emergencyPhoneInfo.countryCode,

      emergencyContactPhone:
        emergencyPhoneInfo.phoneNumber,

      insuranceNumber:
        this.data.insuranceNumber

=======
    const phone = this.parseStoredPhone(this.data.phoneNumber);
    const emergencyPhone = this.parseStoredPhone(this.data.emergencyContactPhone);

    this.selectedPhoneCountry = phone.countryCode;
    this.selectedEmergencyCountryCode = emergencyPhone.countryCode;

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
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
    });

  }

<<<<<<< HEAD
  // =========================================================
  // SAVE
  // =========================================================

  save(): void {
=======
  onPhoneCountryChange(countryCode: string): void {
    this.selectedPhoneCountry = countryCode;
    this.form.controls.phoneNumber.setValue('');
    this.form.controls.phoneNumber.markAsUntouched();
  }

  onEmergencyCountryChange(countryCode: string): void {
    this.selectedEmergencyCountryCode = countryCode;
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
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f

    if (this.form.invalid) {
      this.form.markAllAsTouched();
<<<<<<< HEAD

      this.notification.error(
        'Please enter all required information correctly.'
      );

=======
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
      return;
    }

    if (this.saving) {
      return;
    }

<<<<<<< HEAD
    // Validate patient phone
    if (!this.isValidPhoneNumber()) {

      this.notification.error(
        this.getPhoneValidationMessage()
      );
=======
    const phoneNumber = this.buildInternationalPhone(
      this.form.value.phoneNumber ?? '',
      this.selectedPhoneCountry
    );

    const emergencyContactPhone = this.buildInternationalPhone(
      this.form.value.emergencyContactPhone ?? '',
      this.selectedEmergencyCountryCode
    );
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f

    if (!phoneNumber || !emergencyContactPhone) {
      this.notification.error('Please enter valid phone numbers for the selected country.');
      return;
    }

<<<<<<< HEAD
    // Validate emergency phone if entered
    if (
      this.form.value.emergencyContactPhone &&
      !this.isValidEmergencyPhoneNumber()
    ) {

      this.notification.error(
        this.getEmergencyPhoneValidationMessage()
      );

      return;
    }

    this.saving = true;

    if (this.data) {

      this.updatePatient();

    } else {

      this.createPatient();

=======
    this.saving = true;

    if (this.data) {
      this.updatePatient(phoneNumber, emergencyContactPhone);
    } else {
      this.createPatient(phoneNumber, emergencyContactPhone);
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
    }

  }

<<<<<<< HEAD
  // =========================================================
  // CREATE PATIENT
  // =========================================================

  private createPatient(): void {

    const phoneNumber =
      this.buildInternationalPhoneNumber(
        this.form.value.countryCode!,
        this.form.value.phoneNumber!
      );

    const emergencyContactPhone =
      this.buildInternationalPhoneNumber(
        this.form.value.emergencyCountryCode!,
        this.form.value.emergencyContactPhone ?? ''
      );

    const model: CreatePatient = {

      firstName:
        this.form.value.firstName!,

      lastName:
        this.form.value.lastName!,

      dateOfBirth:
        this.form.value.dateOfBirth!,

      gender:
        this.form.value.gender!,

      bloodGroup:
        this.form.value.bloodGroup!,

      phoneNumber,

      email:
        this.form.value.email!
          .trim()
          .toLowerCase(),

      address:
        this.form.value.address ?? '',

      emergencyContactName:
        this.form.value.emergencyContactName ?? '',

      emergencyContactPhone,

      insuranceNumber:
        this.form.value.insuranceNumber ?? ''

    };

    // =======================================================
    // FRONTEND DUPLICATE CHECK
    // =======================================================

=======
  private validatePhoneLengths(): void {
    const phone = this.form.value.phoneNumber ?? '';
    const emergencyPhone = this.form.value.emergencyContactPhone ?? '';
    const phoneCountry = this.selectedCountry;
    const emergencyCountry = this.selectedEmergencyCountry;

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

>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
    this.service.getAll().subscribe({
      next: response => {
        const email = model.email.toLowerCase();
        const duplicateEmail = response.data.some(patient =>
          patient.email?.trim().toLowerCase() === email
        );
        const duplicatePhone = response.data.some(patient =>
          this.normalizeStoredPhone(patient.phoneNumber) === model.phoneNumber
        );

<<<<<<< HEAD
        const email =
          model.email
            .trim()
            .toLowerCase();

        const phone =
          model.phoneNumber
            .trim();

        const duplicateEmail =
          response.data.some(patient =>
            patient.email
              ?.trim()
              .toLowerCase() === email
          );

        const duplicatePhone =
          response.data.some(patient =>
            patient.phoneNumber
              ?.trim() === phone
          );

        // ---------------------------------------------------
        // Both duplicate
        // ---------------------------------------------------

        if (
          duplicateEmail &&
          duplicatePhone
        ) {

=======
        if (duplicateEmail && duplicatePhone) {
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
          this.saving = false;
          this.notification.error('A patient with this email and phone number already exists.');
          return;
        }

        // ---------------------------------------------------
        // Email duplicate
        // ---------------------------------------------------

        if (duplicateEmail) {
          this.saving = false;
          this.notification.error('A patient with this email already exists.');
          return;
        }

        // ---------------------------------------------------
        // Phone duplicate
        // ---------------------------------------------------

        if (duplicatePhone) {
          this.saving = false;
          this.notification.error('A patient with this phone number already exists.');
          return;
        }

<<<<<<< HEAD
        // ---------------------------------------------------
        // No duplicate
        // ---------------------------------------------------

        this.submitCreatePatient(model);

=======
        this.submitCreatePatient(model);
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
      },
      error: error => {
<<<<<<< HEAD

        console.error(
          'Unable to check existing patients:',
          error
        );

        /*
         * The backend remains the final authority.
         * If the pre-check fails, allow the request to continue.
         */

        this.submitCreatePatient(model);

=======
        console.error('Unable to check existing patients:', error);
        this.submitCreatePatient(model);
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
      }

    });
<<<<<<< HEAD

  }

  // =========================================================
  // SUBMIT CREATE
  // =========================================================

  private submitCreatePatient(
    model: CreatePatient
  ): void {

=======
  }

  private submitCreatePatient(model: CreatePatient): void {
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
    this.service.create(model).subscribe({
      next: () => {
        this.notification.success('Patient created successfully');
        this.dialogRef.close(true);

      },
      error: error => {
        console.error('Create patient failed:', error);
        this.saving = false;
<<<<<<< HEAD

        this.notification.error(
          this.getConflictMessage(error)
        );

=======
        this.notification.error(this.getConflictMessage(error));
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
      }

    });

  }

<<<<<<< HEAD
  // =========================================================
  // UPDATE PATIENT
  // =========================================================

  private updatePatient(): void {

    const phoneNumber =
      this.buildInternationalPhoneNumber(
        this.form.value.countryCode!,
        this.form.value.phoneNumber!
      );

    const emergencyContactPhone =
      this.buildInternationalPhoneNumber(
        this.form.value.emergencyCountryCode!,
        this.form.value.emergencyContactPhone ?? ''
      );

    const model: UpdatePatient = {

      id:
        this.data!.id,

      firstName:
        this.form.value.firstName!,

      lastName:
        this.form.value.lastName!,

      dateOfBirth:
        this.form.value.dateOfBirth!,

      gender:
        this.form.value.gender!,

      bloodGroup:
        this.form.value.bloodGroup!,

      phoneNumber,

      email:
        this.form.value.email!
          .trim()
          .toLowerCase(),

      address:
        this.form.value.address ?? '',

      emergencyContactName:
        this.form.value.emergencyContactName ?? '',

      emergencyContactPhone,

      insuranceNumber:
        this.form.value.insuranceNumber ?? ''

=======
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
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
    };

    this.service.update(model).subscribe({
      next: () => {
        this.notification.success('Patient updated successfully');
        this.dialogRef.close(true);

      },
      error: error => {
        console.error('Update patient failed:', error);
        this.saving = false;
<<<<<<< HEAD

        this.notification.error(
          this.getConflictMessage(error)
        );

=======
        this.notification.error(this.getConflictMessage(error));
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
      }

    });

  }

<<<<<<< HEAD
  // =========================================================
  // PHONE VALIDATION
  // =========================================================

  private isValidPhoneNumber(): boolean {

    const country =
      this.getCountry(
        this.form.value.countryCode!
      );

    const phone =
      this.form.value.phoneNumber
        ?.trim() ?? '';

    if (!country) {
      return false;
    }

    return (
      /^\d+$/.test(phone) &&
      phone.length >= country.minLength &&
      phone.length <= country.maxLength
    );

  }

  private isValidEmergencyPhoneNumber(): boolean {

    const country =
      this.getCountry(
        this.form.value.emergencyCountryCode!
      );

    const phone =
      this.form.value.emergencyContactPhone
        ?.trim() ?? '';

    // Emergency phone is optional
    if (!phone) {
      return true;
    }

    if (!country) {
      return false;
    }

    return (
      /^\d+$/.test(phone) &&
      phone.length >= country.minLength &&
      phone.length <= country.maxLength
    );

  }

  // =========================================================
  // PHONE VALIDATION MESSAGES
  // =========================================================

  private getPhoneValidationMessage(): string {

    const country =
      this.getCountry(
        this.form.value.countryCode!
      );

    if (!country) {
      return 'Please select a country.';
    }

    if (
      country.minLength ===
      country.maxLength
    ) {

      return `Phone number must contain ${country.minLength} digits for ${country.name}.`;

    }

    return `Phone number must contain ${country.minLength} to ${country.maxLength} digits for ${country.name}.`;

  }

  private getEmergencyPhoneValidationMessage(): string {

    const country =
      this.getCountry(
        this.form.value.emergencyCountryCode!
      );

    if (!country) {
      return 'Please select an emergency contact country.';
    }

    if (
      country.minLength ===
      country.maxLength
    ) {

      return `Emergency contact phone must contain ${country.minLength} digits for ${country.name}.`;

    }

    return `Emergency contact phone must contain ${country.minLength} to ${country.maxLength} digits for ${country.name}.`;

  }

  // =========================================================
  // BUILD INTERNATIONAL PHONE
  // =========================================================

  private buildInternationalPhoneNumber(
    countryCode: string,
    phoneNumber: string
  ): string {

    const country =
      this.getCountry(countryCode);

    if (!country) {
      return phoneNumber.trim();
    }

    const cleanPhone =
      phoneNumber
        .replace(/\D/g, '');

    return `${country.dialCode}${cleanPhone}`;

  }

  // =========================================================
  // GET COUNTRY
  // =========================================================

  private getCountry(
    countryCode: string
  ): Country | undefined {

    return this.countries.find(
      country =>
        country.code === countryCode
    );

  }

  // =========================================================
  // PARSE EXISTING PHONE
  // =========================================================

  private parseInternationalPhone(
    phone: string | null | undefined
  ): {
    countryCode: string;
    phoneNumber: string;
  } {

    if (!phone) {

      return {
        countryCode: 'IN',
        phoneNumber: ''
      };

    }

    const cleanPhone =
      phone.trim();

    /*
     * Try to identify the country from
     * the stored international number.
     */

    const matchedCountry =
      this.countries
        .slice()
        .sort(
          (a, b) =>
            b.dialCode.length -
            a.dialCode.length
        )
        .find(country =>
          cleanPhone.startsWith(
            country.dialCode
          )
        );

    if (!matchedCountry) {

      return {
        countryCode: 'IN',
        phoneNumber: cleanPhone
      };

    }

    const localNumber =
      cleanPhone.substring(
        matchedCountry.dialCode.length
      );

    return {

      countryCode:
        matchedCountry.code,

      phoneNumber:
        localNumber

    };

  }

  // =========================================================
  // MAP GENDER
  // =========================================================

  private mapGender(
    value: string | number
  ): number | null {

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

  // =========================================================
  // MAP BLOOD GROUP
  // =========================================================

  private mapBloodGroup(
    value: string | number
  ): number | null {

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

  // =========================================================
  // API ERROR MESSAGE
  // =========================================================

  private getConflictMessage(
    error: any
  ): string {

    const body =
      error?.error;
=======
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
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f

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

<<<<<<< HEAD
  // =========================================================
  // CLOSE
  // =========================================================
=======
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
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f

  close(): void {
    if (this.saving) {
      return;
    }
    this.dialogRef.close();

  }
<<<<<<< HEAD

}
=======
}
>>>>>>> 322d3f359bd03141abb05f2374a8dc9c9583da8f
