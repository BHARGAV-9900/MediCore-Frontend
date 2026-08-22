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

interface Country {
  code: string;
  dialCode: string;
  name: string;
  minLength: number;
  maxLength: number;
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

  private readonly dialogRef =
    inject(MatDialogRef<PatientDialog>);

  private readonly service =
    inject(PatientService);

  private readonly notification =
    inject(NotificationService);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true
  }) as Patient | null;

  saving = false;

  // =========================================================
  // DATE
  // =========================================================

  readonly maxDate = (() => {
    const date = new Date();

    date.setDate(date.getDate() - 1);

    return date.toISOString().split('T')[0];
  })();

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

  // =========================================================
  // INITIALIZATION
  // =========================================================

  ngOnInit(): void {

    if (!this.data) {
      return;
    }

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

    });

  }

  // =========================================================
  // SAVE
  // =========================================================

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      this.notification.error(
        'Please enter all required information correctly.'
      );

      return;
    }

    if (this.saving) {
      return;
    }

    // Validate patient phone
    if (!this.isValidPhoneNumber()) {

      this.notification.error(
        this.getPhoneValidationMessage()
      );

      return;
    }

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

    }

  }

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

    this.service.getAll().subscribe({

      next: response => {

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

          this.saving = false;

          this.notification.error(
            'A patient with this email and phone number already exists.'
          );

          return;
        }

        // ---------------------------------------------------
        // Email duplicate
        // ---------------------------------------------------

        if (duplicateEmail) {

          this.saving = false;

          this.notification.error(
            'A patient with this email already exists.'
          );

          return;
        }

        // ---------------------------------------------------
        // Phone duplicate
        // ---------------------------------------------------

        if (duplicatePhone) {

          this.saving = false;

          this.notification.error(
            'A patient with this phone number already exists.'
          );

          return;
        }

        // ---------------------------------------------------
        // No duplicate
        // ---------------------------------------------------

        this.submitCreatePatient(model);

      },

      error: error => {

        console.error(
          'Unable to check existing patients:',
          error
        );

        /*
         * The backend remains the final authority.
         * If the pre-check fails, allow the request to continue.
         */

        this.submitCreatePatient(model);

      }

    });

  }

  // =========================================================
  // SUBMIT CREATE
  // =========================================================

  private submitCreatePatient(
    model: CreatePatient
  ): void {

    this.service.create(model).subscribe({

      next: () => {

        this.notification.success(
          'Patient created successfully'
        );

        this.dialogRef.close(true);

      },

      error: error => {

        console.error(
          'Create patient failed:',
          error
        );

        this.saving = false;

        this.notification.error(
          this.getConflictMessage(error)
        );

      }

    });

  }

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

    };

    this.service.update(model).subscribe({

      next: () => {

        this.notification.success(
          'Patient updated successfully'
        );

        this.dialogRef.close(true);

      },

      error: error => {

        console.error(
          'Update patient failed:',
          error
        );

        this.saving = false;

        this.notification.error(
          this.getConflictMessage(error)
        );

      }

    });

  }

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

    const message =
      body?.message ??
      body?.Message ??
      body?.title ??
      body?.Title;

    if (
      typeof message === 'string' &&
      message.trim()
    ) {

      return message;

    }

    const errors =
      body?.errors ??
      body?.Errors;

    if (
      Array.isArray(errors) &&
      errors.length > 0
    ) {

      return errors.join(' ');

    }

    if (
      typeof body === 'string' &&
      body.trim()
    ) {

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

  // =========================================================
  // CLOSE
  // =========================================================

  close(): void {

    if (this.saving) {
      return;
    }

    this.dialogRef.close();

  }

}