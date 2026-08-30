import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import {
  SettingsService
} from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule
  ],

  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent
  implements OnInit {

  settingsForm: FormGroup;

  loading = false;
  saving = false;

  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,

    private readonly settingsService:
      SettingsService,

    private readonly snackBar:
      MatSnackBar
  ) {

    this.settingsForm =
      this.fb.group({

        hospitalName: [
          '',
          [
            Validators.required,
            Validators.maxLength(200)
          ]
        ],

        hospitalEmail: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(200)
          ]
        ],

        hospitalPhone: [
          '',
          [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern(/^\+?[0-9][0-9\s().-]{6,29}$/)
          ]
        ],

        hospitalAddress: [
          '',
          [
            Validators.required,
            Validators.maxLength(500)
          ]
        ],

        currency: [
          'INR',
          Validators.required
        ],

        dateFormat: [
          'dd-MMM-yyyy',
          Validators.required
        ],

        timeZone: [
          'Asia/Kolkata',
          Validators.required
        ],

        defaultAppointmentDuration: [
          30,
          [
            Validators.required,
            Validators.min(5),
            Validators.max(480)
          ]
        ],

        lowStockThreshold: [
          10,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        expiryWarningDays: [
          30,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(365)
          ]
        ],

        enableNotifications: [
          true
        ],

        enableAppointmentNotifications: [
          true
        ],

        enableBillingNotifications: [
          true
        ],

        enableLaboratoryNotifications: [
          true
        ]

      });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.errorMessage = '';

    this.settingsService
      .get()
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.settingsForm.patchValue(response.data);
          }

          this.loading = false;
        },

        error: (error) => {
          console.error(
            'Failed to load settings:',
            error
          );

          this.loading = false;
          this.errorMessage =
            'Unable to load settings. Please try again.';
        }
      });
  }

  saveSettings(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();

      this.showError(
        'Please correct the highlighted fields.'
      );

      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const settings =
      this.settingsForm.getRawValue();

    this.settingsService
      .update(settings)
      .subscribe({
        next: () => {
          this.saving = false;

          this.showSuccess(
            'Settings saved successfully.'
          );

          this.loadSettings();
        },

        error: (error) => {
          console.error(
            'Failed to save settings:',
            error
          );

          this.saving = false;

          const message =
            this.getApiErrorMessage(error) ??
            'Failed to save settings. Please try again.';

          this.showError(message);
        }
      });
  }

  resetSettings(): void {
    this.loadSettings();
  }

  private getApiErrorMessage(
    error: any
  ): string | null {
    const apiMessage =
      error?.error?.message;

    if (typeof apiMessage === 'string' &&
        apiMessage.trim()) {
      return apiMessage;
    }

    const validationErrors =
      error?.error?.errors;

    if (validationErrors &&
        typeof validationErrors === 'object') {
      const firstError =
        Object.values(validationErrors)
          .flat()
          .find(
            value =>
              typeof value === 'string' &&
              value.trim()
          );

      if (typeof firstError === 'string') {
        return firstError;
      }
    }

    return null;
  }

  private showSuccess(
    message: string
  ): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [
          'success-snackbar'
        ]
      }
    );
  }

  private showError(
    message: string
  ): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [
          'error-snackbar'
        ]
      }
    );
  }

}