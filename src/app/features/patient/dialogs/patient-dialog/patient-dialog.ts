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

import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode
} from 'libphonenumber-js';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { CreatePatient } from '../../models/create-patient';
import { UpdatePatient } from '../../models/update-patient';

interface CountryOption {
<<<<<<< HEAD
  code: CountryCode;
  name: string;
  callingCode: string;
  flag: string;
=======
  code: string;
  name: string;
  dialCode: string;
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc
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

  /*
   * India is the default country because the current
   * MediCore Nexus test data is Indian data.
   *
   * Users can change it to USA, UK, Canada, Australia,
   * or any other supported country.
   */
  selectedPhoneCountry: CountryCode = 'IN';

  selectedEmergencyCountry: CountryCode = 'IN';

  /*
   * Country list generated from libphonenumber-js.
   * This means we don't have to manually maintain
   * country calling codes.
   */
  readonly countryOptions: CountryOption[] =
    this.createCountryOptions();

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

    gender: this.fb.control<number | null>(
      null,
      Validators.required
    ),

    bloodGroup: this.fb.control<number | null>(
      null,
      Validators.required
    ),

<<<<<<< HEAD
    /*
     * The user enters only the local/national number.
     *
     * Example:
     * India -> 9000012345
     * USA   -> 4155551234
     *
     * We convert it to E.164 before sending it
     * to the backend.
     */
    phoneNumber: this.fb.control('', [
      Validators.required,
      Validators.maxLength(15)
=======
    countryCode: this.fb.control('IN', Validators.required),

    phoneNumber: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{7,12}$/)
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc
    ]),

    email: this.fb.control('', [
      Validators.required,
      Validators.email
    ]),

<<<<<<< HEAD
    address: this.fb.control('', [
      Validators.maxLength(500)
=======
    address: this.fb.control('', Validators.maxLength(500)),

    emergencyContactName: this.fb.control('', Validators.maxLength(100)),

    emergencyCountryCode: this.fb.control('IN', Validators.required),

    emergencyContactPhone: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{7,12}$/)
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc
    ]),

    emergencyContactName: this.fb.control('', [
      Validators.maxLength(100)
    ]),

    emergencyContactPhone: this.fb.control('', [
      Validators.maxLength(15)
    ]),

    insuranceNumber: this.fb.control('', [
      Validators.maxLength(100)
    ])
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
    return this.countries.find(
      country => country.code === this.form.controls.countryCode.value
    ) ?? this.countries[0];
  }

  get selectedEmergencyCountry(): CountryOption {
    return this.countries.find(
      country => country.code === this.form.controls.emergencyCountryCode.value
    ) ?? this.countries[0];
  }

  ngOnInit(): void {

    if (!this.data) {
      return;
    }

<<<<<<< HEAD
    const phoneData =
      this.getStoredPhoneParts(
        this.data.phoneNumber
      );

    const emergencyPhoneData =
      this.getStoredPhoneParts(
        this.data.emergencyContactPhone
      );

    this.selectedPhoneCountry =
      phoneData.country;

    this.selectedEmergencyCountry =
      emergencyPhoneData.country;

    this.form.patchValue({

      firstName:
        this.data.firstName,

      lastName:
        this.data.lastName,

      dateOfBirth:
        this.data.dateOfBirth
          ? new Date(this.data.dateOfBirth)
              .toISOString()
              .split('T')[0]
          : '',

      gender:
        this.mapGender(this.data.gender),

      bloodGroup:
        this.mapBloodGroup(this.data.bloodGroup),

      phoneNumber:
        phoneData.nationalNumber,

      email:
        this.data.email,

      address:
        this.data.address,

      emergencyContactName:
        this.data.emergencyContactName,

      emergencyContactPhone:
        emergencyPhoneData.nationalNumber,

      insuranceNumber:
        this.data.insuranceNumber
=======
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
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc
    });
  }

  /*
   * =========================================================
   * COUNTRY LIST
   * =========================================================
   */

  private createCountryOptions(): CountryOption[] {

    const displayNames =
      new Intl.DisplayNames(
        ['en'],
        {
          type: 'region'
        }
      );

    const priorityCountries: CountryCode[] = [
      'IN',
      'US',
      'GB',
      'CA',
      'AU',
      'AE',
      'SG',
      'NZ'
    ];

    return getCountries()
      .map(code => {

        let name: string = code;

        try {
          name =
            displayNames.of(code) ?? code;
        } catch {
          name = code;
        }

        return {
          code,
          name,
          callingCode:
            getCountryCallingCode(code),
          flag:
            this.countryCodeToFlag(code)
        };
      })
      .sort((a, b) => {

        const aPriority =
          priorityCountries.indexOf(a.code);

        const bPriority =
          priorityCountries.indexOf(b.code);

        if (aPriority !== -1 &&
            bPriority === -1) {
          return -1;
        }

        if (aPriority === -1 &&
            bPriority !== -1) {
          return 1;
        }

        if (aPriority !== -1 &&
            bPriority !== -1) {
          return aPriority - bPriority;
        }

        return a.name.localeCompare(
          b.name
        );
      });
  }

  private countryCodeToFlag(
    countryCode: CountryCode
  ): string {

    return countryCode
      .toUpperCase()
      .split('')
      .map(
        character =>
          String.fromCodePoint(
            127397 +
            character.charCodeAt(0)
          )
      )
      .join('');
  }

  getCountryOption(
    countryCode: CountryCode
  ): CountryOption {

    return this.countryOptions.find(
      country =>
        country.code === countryCode
    ) ?? this.countryOptions[0];
  }

  /*
   * =========================================================
   * COUNTRY CHANGE
   * =========================================================
   */

  onPhoneCountryChange(
    country: CountryCode
  ): void {

    this.selectedPhoneCountry =
      country;

    this.clearPhoneValidationError(
      'phoneNumber'
    );
  }

  onEmergencyCountryChange(
    country: CountryCode
  ): void {

    this.selectedEmergencyCountry =
      country;

    this.clearPhoneValidationError(
      'emergencyContactPhone'
    );
  }

  /*
   * =========================================================
   * PHONE INPUT
   * =========================================================
   */

  sanitizePhoneNumber(
    controlName:
      | 'phoneNumber'
      | 'emergencyContactPhone',
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    /*
     * Keep digits only.
     *
     * Maximum 15 digits because E.164
     * national numbers cannot exceed 15
     * digits after removing the +.
     */
    const digits =
      input.value
        .replace(/\D/g, '')
        .slice(0, 15);

    this.form.controls[
      controlName
    ].setValue(
      digits,
      {
        emitEvent: false
      }
    );

    this.clearPhoneValidationError(
      controlName
    );
  }

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  save(): void {
<<<<<<< HEAD
=======
    if (!this.isPhoneLengthValid('phoneNumber')) {
      this.form.controls.phoneNumber.setErrors({ phoneLength: true });
    }

    if (!this.isPhoneLengthValid('emergencyContactPhone')) {
      this.form.controls.emergencyContactPhone.setErrors({ phoneLength: true });
    }
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    if (this.saving) {
      return;
    }

    /*
     * Convert patient's local phone number
     * to E.164.
     */
    const phoneNumber =
      this.normalizePhoneNumber(
        this.form.value.phoneNumber!,
        this.selectedPhoneCountry
      );

    if (!phoneNumber) {

      this.setPhoneValidationError(
        'phoneNumber'
      );

      return;
    }

    /*
     * Emergency contact phone is optional.
     *
     * If supplied, it must still be a
     * valid international phone number.
     */
    let emergencyContactPhone = '';

    const emergencyValue =
      this.form.value
        .emergencyContactPhone
        ?.trim() ?? '';

    if (emergencyValue) {

      const normalizedEmergencyPhone =
        this.normalizePhoneNumber(
          emergencyValue,
          this.selectedEmergencyCountry
        );

      if (!normalizedEmergencyPhone) {

        this.setPhoneValidationError(
          'emergencyContactPhone'
        );

        return;
      }

      emergencyContactPhone =
        normalizedEmergencyPhone;
    }

    this.saving = true;

    if (this.data) {

      this.updatePatient(
        phoneNumber,
        emergencyContactPhone
      );

    } else {

      this.createPatient(
        phoneNumber,
        emergencyContactPhone
      );
    }
  }

  /*
   * =========================================================
   * PHONE NORMALIZATION
   * =========================================================
   */

  private normalizePhoneNumber(
    value: string,
    country: CountryCode
  ): string | null {

    const cleaned =
      value
        .trim()
        .replace(/\D/g, '');

    if (!cleaned) {
      return null;
    }

    const parsed =
      parsePhoneNumberFromString(
        cleaned,
        country
      );

    if (!parsed ||
        !parsed.isValid()) {

      return null;
    }

    /*
     * This is the value that gets sent
     * to the backend/database.
     *
     * Example:
     * +919000012345
     * +14155551234
     */
    return parsed.number;
  }

  /*
   * =========================================================
   * EXISTING PHONE PARSING
   * =========================================================
   */

  private getStoredPhoneParts(
    value: string | null | undefined
  ): {
    country: CountryCode;
    nationalNumber: string;
  } {

    const raw =
      value?.trim() ?? '';

    if (!raw) {

      return {
        country: 'IN',
        nationalNumber: ''
      };
    }

    /*
     * New records are stored in E.164:
     *
     * +919000012345
     */
    if (raw.startsWith('+')) {

      const parsed =
        parsePhoneNumberFromString(raw);

      if (parsed) {

        return {
          country:
            parsed.country ?? 'IN',

          nationalNumber:
            parsed.nationalNumber
        };
      }
    }

    /*
     * Existing MediCore test data was created
     * before international phone support and
     * contains Indian 10-digit numbers.
     *
     * Treat those as India during migration.
     */
    const parsed =
      parsePhoneNumberFromString(
        raw.replace(/\D/g, ''),
        'IN'
      );

    if (parsed) {

      return {
        country:
          parsed.country ?? 'IN',

        nationalNumber:
          parsed.nationalNumber
      };
    }

    return {
      country: 'IN',
      nationalNumber:
        raw.replace(/\D/g, '')
    };
  }

  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  private createPatient(
    phoneNumber: string,
    emergencyContactPhone: string
  ): void {

    const model: CreatePatient = {
<<<<<<< HEAD

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
          .trim(),

      address:
        this.form.value.address
        ?? '',

      emergencyContactName:
        this.form.value
          .emergencyContactName
        ?? '',

      emergencyContactPhone,

      insuranceNumber:
        this.form.value
          .insuranceNumber
        ?? ''
    };

    /*
     * Friendly frontend duplicate check.
     *
     * The backend remains the final authority.
     */
    this.service.getAll().subscribe({

      next: response => {

        const email =
          model.email
            .trim()
            .toLowerCase();

        const duplicateEmail =
          response.data.some(patient =>
            patient.email
              ?.trim()
              .toLowerCase() === email
          );

        const duplicatePhone =
          response.data.some(patient =>
            this.normalizeStoredPhone(
              patient.phoneNumber
            ) === model.phoneNumber
          );

        if (duplicateEmail &&
            duplicatePhone) {

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

        this.submitCreatePatient(
          model
        );
      },

      error: error => {

        console.error(
          'Unable to check existing patients:',
          error
        );

        /*
         * Don't block creation if the
         * pre-check itself fails.
         *
         * The backend still performs
         * the duplicate check.
         */
        this.submitCreatePatient(
          model
        );
      }
    });
=======
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
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc
  }

  private normalizeStoredPhone(
    value: string | null | undefined
  ): string {

    const raw =
      value?.trim() ?? '';

    if (!raw) {
      return '';
    }

    if (raw.startsWith('+')) {
      return raw;
    }

    /*
     * Temporary backward compatibility
     * for old Indian records.
     */
    const parsed =
      parsePhoneNumberFromString(
        raw.replace(/\D/g, ''),
        'IN'
      );

    return parsed?.number
      ?? raw.replace(/\D/g, '');
  }

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
   * =========================================================
   * UPDATE
   * =========================================================
   */

  private updatePatient(
    phoneNumber: string,
    emergencyContactPhone: string
  ): void {

    const model: UpdatePatient = {

      id: this.data!.id,
<<<<<<< HEAD

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
          .trim(),

      address:
        this.form.value.address
        ?? '',

      emergencyContactName:
        this.form.value
          .emergencyContactName
        ?? '',

      emergencyContactPhone,

      insuranceNumber:
        this.form.value
          .insuranceNumber
        ?? ''
=======
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
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc
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
   * =========================================================
   * ERROR HANDLING
   * =========================================================
   */

  private getConflictMessage(
    error: any
  ): string {

    const body = error?.error;

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

<<<<<<< HEAD
  /*
   * =========================================================
   * PHONE VALIDATION ERROR
   * =========================================================
   */

  private setPhoneValidationError(
    controlName:
      | 'phoneNumber'
      | 'emergencyContactPhone'
  ): void {

    const control =
      this.form.controls[
        controlName
      ];

    control.setErrors({
      ...(control.errors ?? {}),
      phoneInvalid: true
    });

    control.markAsTouched();

    this.notification.error(
      controlName === 'phoneNumber'
        ? 'Enter a valid phone number for the selected country.'
        : 'Enter a valid emergency contact phone number for the selected country.'
    );
  }

  private clearPhoneValidationError(
    controlName:
      | 'phoneNumber'
      | 'emergencyContactPhone'
  ): void {

    const control =
      this.form.controls[
        controlName
      ];

    if (!control.errors?.['phoneInvalid']) {
      return;
    }

    const errors = {
      ...(control.errors ?? {})
    };

    delete errors['phoneInvalid'];

    control.setErrors(
      Object.keys(errors).length
        ? errors
        : null
    );
  }

  /*
   * =========================================================
   * ENUM MAPPING
   * =========================================================
   */

  private mapGender(
    value: string
  ): number | null {

    const map: Record<
      string,
      number
    > = {

=======
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
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc
      Male: 1,
      Female: 2,
      Other: 3
    };

    return map[value] ?? null;
  }

<<<<<<< HEAD
  private mapBloodGroup(
    value: string
  ): number | null {

    const map: Record<
      string,
      number
    > = {

=======
  private mapBloodGroup(value: string | number): number | null {
    if (typeof value === 'number') {
      return value;
    }

    const map: Record<string, number> = {
>>>>>>> be02ec20af318510a899def893ead4e6df6839bc
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
   * =========================================================
   * CLOSE
   * =========================================================
   */

  close(): void {

    if (this.saving) {
      return;
    }

    this.dialogRef.close();
  }
}