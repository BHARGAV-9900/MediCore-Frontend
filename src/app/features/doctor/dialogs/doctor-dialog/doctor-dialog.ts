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

interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
}

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

  /**
   * Country calling codes used by the doctor phone-number field.
   * The stored phone number is sent to the API in international format,
   * for example +919876543210 or +14155552671.
   */
  readonly countries: CountryOption[] = [
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'SG', name: 'Singapore', dialCode: '+65' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'IT', name: 'Italy', dialCode: '+39' },
    { code: 'ES', name: 'Spain', dialCode: '+34' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41' },
    { code: 'SE', name: 'Sweden', dialCode: '+46' },
    { code: 'NO', name: 'Norway', dialCode: '+47' },
    { code: 'DK', name: 'Denmark', dialCode: '+45' },
    { code: 'IE', name: 'Ireland', dialCode: '+353' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
    { code: 'QA', name: 'Qatar', dialCode: '+974' },
    { code: 'KW', name: 'Kuwait', dialCode: '+965' },
    { code: 'OM', name: 'Oman', dialCode: '+968' },
    { code: 'BH', name: 'Bahrain', dialCode: '+973' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60' },
    { code: 'TH', name: 'Thailand', dialCode: '+66' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62' },
    { code: 'PH', name: 'Philippines', dialCode: '+63' },
    { code: 'JP', name: 'Japan', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', dialCode: '+82' },
    { code: 'CN', name: 'China', dialCode: '+86' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886' },
    { code: 'BR', name: 'Brazil', dialCode: '+55' },
    { code: 'MX', name: 'Mexico', dialCode: '+52' },
    { code: 'AR', name: 'Argentina', dialCode: '+54' },
    { code: 'CL', name: 'Chile', dialCode: '+56' },
    { code: 'CO', name: 'Colombia', dialCode: '+57' },
    { code: 'TR', name: 'Turkey', dialCode: '+90' },
    { code: 'RU', name: 'Russia', dialCode: '+7' }
  ];

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

    countryCode: [
      'IN',
      Validators.required
    ],

    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{6,14}$/)
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
      const phone = this.splitInternationalPhone(this.data.phoneNumber);

      this.form.patchValue({
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        countryCode: phone.countryCode,
        phoneNumber: phone.phoneNumber,
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

    if (error?.status === 409) {
      return error?.error?.message
        ?? 'A doctor with this email or phone number already exists.';
    }

    return error?.error?.message
      ?? error?.error?.title
      ?? fallback;
  }

  private getSelectedDialCode(): string {
    const country = this.countries.find(
      x => x.code === this.form.value.countryCode
    );

    return country?.dialCode ?? '+91';
  }

  private getInternationalPhone(): string {
    const dialCode = this.getSelectedDialCode();
    const localNumber = (this.form.value.phoneNumber ?? '')
      .replace(/\D/g, '');

    return `${dialCode}${localNumber}`;
  }

  private splitInternationalPhone(phone: string): {
    countryCode: string;
    phoneNumber: string;
  } {
    const normalized = (phone ?? '').replace(/[\s()-]/g, '');

    if (!normalized.startsWith('+')) {
      return {
        countryCode: 'IN',
        phoneNumber: normalized.replace(/\D/g, '')
      };
    }

    const matchingCountry = [...this.countries]
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find(country => normalized.startsWith(country.dialCode));

    if (!matchingCountry) {
      return {
        countryCode: 'IN',
        phoneNumber: normalized.replace(/^\+\d{1,3}/, '')
      };
    }

    return {
      countryCode: matchingCountry.code,
      phoneNumber: normalized
        .substring(matchingCountry.dialCode.length)
        .replace(/\D/g, '')
    };
  }

  createDoctor(): void {

    const model: CreateDoctor = {

      firstName: this.form.value.firstName!.trim(),

      lastName: this.form.value.lastName!.trim(),

      email: this.form.value.email!.trim(),

      phoneNumber: this.getInternationalPhone(),

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

      phoneNumber: this.getInternationalPhone(),

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
