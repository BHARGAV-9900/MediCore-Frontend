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

  readonly maxDate = (() => {
    const date = new Date();

    date.setDate(date.getDate() - 1);

    return date.toISOString().split('T')[0];
  })();

  /*
   * ============================================================
   * COUNTRIES
   * ============================================================
   */

  readonly countries: Country[] = [
    {
      code: 'IN',
      name: 'India',
      dialCode: '+91'
    },
    {
      code: 'US',
      name: 'United States',
      dialCode: '+1'
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      dialCode: '+44'
    },
    {
      code: 'AE',
      name: 'United Arab Emirates',
      dialCode: '+971'
    },
    {
      code: 'CA',
      name: 'Canada',
      dialCode: '+1'
    },
    {
      code: 'AU',
      name: 'Australia',
      dialCode: '+61'
    },
    {
      code: 'SG',
      name: 'Singapore',
      dialCode: '+65'
    },
    {
      code: 'DE',
      name: 'Germany',
      dialCode: '+49'
    },
    {
      code: 'FR',
      name: 'France',
      dialCode: '+33'
    },
    {
      code: 'JP',
      name: 'Japan',
      dialCode: '+81'
    }
  ];

  /*
   * ============================================================
   * FORM
   * ============================================================
   */

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

    countryCode: this.fb.control(
      '+91',
      Validators.required
    ),

    phoneNumber: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{7,15}$/)
    ]),

    email: this.fb.control('', [
      Validators.required,
      Validators.email
    ]),

    address: this.fb.control('', [
      Validators.maxLength(500)
    ]),

    emergencyContactName: this.fb.control('', [
      Validators.maxLength(100)
    ]),

    emergencyCountryCode: this.fb.control(
      '+91',
      Validators.required
    ),

    emergencyContactPhone: this.fb.control('', [
      Validators.maxLength(15),
      Validators.pattern(/^\d{7,15}$/)
    ]),

    insuranceNumber: this.fb.control('', [
      Validators.maxLength(100)
    ])
  });

  /*
   * ============================================================
   * ENUM OPTIONS
   * ============================================================
   */

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

  /*
   * ============================================================
   * INITIALIZATION
   * ============================================================
   */

  ngOnInit(): void {

    if (!this.data) {
      return;
    }

    const patientPhone =
      this.parsePhoneNumber(
        this.data.phoneNumber
      );

    const emergencyPhone =
      this.parsePhoneNumber(
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
        patientPhone.countryCode,

      phoneNumber:
        patientPhone.phoneNumber,

      email:
        this.data.email,

      address:
        this.data.address,

      emergencyContactName:
        this.data.emergencyContactName,

      emergencyCountryCode:
        emergencyPhone.countryCode,

      emergencyContactPhone:
        emergencyPhone.phoneNumber,

      insuranceNumber:
        this.data.insuranceNumber
    });
  }

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

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

  /*
   * ============================================================
   * CREATE PATIENT
   * ============================================================
   */

  private createPatient(): void {

    const phoneNumber =
      this.buildInternationalPhoneNumber(
        this.form.value.countryCode!,
        this.form.value.phoneNumber!
      );

    const emergencyContactPhone =
      this.buildInternationalPhoneNumber(
        this.form.value.emergencyCountryCode!,
        this.form.value.emergencyContactPhone!
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

    /*
     * Check duplicates on the client first.
     * Backend remains the final authority.
     */

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

        if (duplicateEmail) {

          this.saving = false;

          this.notification.error(
            'A patient with this email already exists.'
          );

          return;
        }

        if (duplicatePhone) {

          this.saving = false;

          this.notification.error(
            'A patient with this phone number already exists.'
          );

          return;
        }

        this.submitCreatePatient(model);
      },

      error: error => {

        console.error(
          'Unable to check existing patients:',
          error
        );

        /*
         * Do not block creation if
         * duplicate pre-check fails.
         */

        this.submitCreatePatient(model);
      }
    });
  }

  /*
   * ============================================================
   * API CREATE
   * ============================================================
   */

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

  /*
   * ============================================================
   * UPDATE PATIENT
   * ============================================================
   */

  private updatePatient(): void {

    const phoneNumber =
      this.buildInternationalPhoneNumber(
        this.form.value.countryCode!,
        this.form.value.phoneNumber!
      );

    const emergencyContactPhone =
      this.buildInternationalPhoneNumber(
        this.form.value.emergencyCountryCode!,
        this.form.value.emergencyContactPhone!
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

  /*
   * ============================================================
   * PHONE NUMBER
   * ============================================================
   */

  private buildInternationalPhoneNumber(
    countryCode: string,
    phoneNumber: string
  ): string {

    const digits =
      phoneNumber.replace(/\D/g, '');

    const dialCode =
      countryCode.startsWith('+')
        ? countryCode
        : `+${countryCode}`;

    return `${dialCode}${digits}`;
  }

  private parsePhoneNumber(
    phoneNumber: string
  ): {
    countryCode: string;
    phoneNumber: string;
  } {

    const normalized =
      (phoneNumber ?? '').trim();

    /*
     * Longest dial codes first.
     */

    const matchingCountry =
      [...this.countries]
        .sort(
          (a, b) =>
            b.dialCode.length -
            a.dialCode.length
        )
        .find(country =>
          normalized.startsWith(
            country.dialCode
          )
        );

    if (!matchingCountry) {

      return {
        countryCode: '+91',
        phoneNumber:
          normalized.replace(/\D/g, '')
      };
    }

    return {

      countryCode:
        matchingCountry.dialCode,

      phoneNumber:
        normalized
          .substring(
            matchingCountry.dialCode.length
          )
          .replace(/\D/g, '')
    };
  }

  /*
   * ============================================================
   * ERROR MESSAGE
   * ============================================================
   */

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

      /*
       * If backend says Validation failed,
       * try to display the actual validation
       * error below it.
       */

      if (
        message.toLowerCase() ===
        'validation failed.'
      ) {

        const validationErrors =
          body?.errors ??
          body?.Errors;

        if (
          Array.isArray(validationErrors) &&
          validationErrors.length > 0
        ) {

          return validationErrors.join(' ');
        }
      }

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
      typeof errors === 'object' &&
      errors !== null
    ) {

      return Object.values(errors)
        .flat()
        .join(' ');
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

  /*
   * ============================================================
   * ENUM MAPPING
   * ============================================================
   */

  private mapGender(
    value: string
  ): number | null {

    const map: Record<string, number> = {

      Male: 1,

      Female: 2,

      Other: 3
    };

    return map[value] ?? null;
  }

  private mapBloodGroup(
    value: string
  ): number | null {

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

  /*
   * ============================================================
   * CLOSE
   * ============================================================
   */

  close(): void {

    if (this.saving) {
      return;
    }

    this.dialogRef.close();
  }
}