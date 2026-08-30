import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  loading = false;
  saving = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly settingsService: SettingsService,
    private readonly snackBar: MatSnackBar
  ) {
    this.settingsForm = this.fb.group({
      hospitalName: ['', [Validators.required, Validators.maxLength(200)]],
      hospitalEmail: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      hospitalPhone: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^\+?[0-9][0-9\s().-]{6,29}$/)]],
      hospitalAddress: ['', [Validators.required, Validators.maxLength(500)]],
      currency: ['INR', Validators.required],
      dateFormat: ['dd/MM/yyyy', Validators.required],
      timeZone: ['Asia/Kolkata', Validators.required],
      defaultAppointmentDuration: [30, [Validators.required, Validators.min(5), Validators.max(480)]],
      lowStockThreshold: [10, [Validators.required, Validators.min(0)]],
      expiryWarningDays: [30, [Validators.required, Validators.min(0), Validators.max(365)]],
      enableNotifications: [true],
      enableAppointmentNotifications: [true],
      enableBillingNotifications: [true],
      enableLaboratoryNotifications: [true]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.errorMessage = '';

    this.settingsService.get().subscribe({
      next: (response) => {
        if (response.data) {
          this.settingsForm.patchValue(response.data);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load settings:', error);
        this.loading = false;
        this.errorMessage = 'Unable to load settings. Please try again.';
        this.showError(this.errorMessage);
      }
    });
  }

  saveSettings(): void {
    this.trimTextFields();

    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      this.showError(this.getValidationSummary());
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const settings = this.settingsForm.getRawValue();

    this.settingsService.update(settings).subscribe({
      next: (response) => {
        this.saving = false;

        // The API has already persisted the complete form. Keep the values
        // in the form instead of immediately issuing a second GET request.
        // A refresh/reload will therefore verify the real database value.
        this.showSuccess(
          response?.message || 'Settings saved successfully.'
        );
      },
      error: (error) => {
        console.error('Failed to save settings:', error);
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

  private trimTextFields(): void {
    const textFields = [
      'hospitalName',
      'hospitalEmail',
      'hospitalPhone',
      'hospitalAddress'
    ];

    const trimmedValues: Record<string, string> = {};

    for (const field of textFields) {
      const value = this.settingsForm.get(field)?.value;
      if (typeof value === 'string') {
        trimmedValues[field] = value.trim();
      }
    }

    this.settingsForm.patchValue(trimmedValues, { emitEvent: false });
  }

  private getValidationSummary(): string {
    const validationMessages: Record<string, string> = {
      hospitalName: 'Hospital name is required.',
      hospitalEmail: 'Enter a valid hospital email address.',
      hospitalPhone: 'Enter a valid hospital phone number.',
      hospitalAddress: 'Hospital address is required.',
      defaultAppointmentDuration: 'Appointment duration must be between 5 and 480 minutes.',
      lowStockThreshold: 'Low stock threshold must be 0 or greater.',
      expiryWarningDays: 'Expiry warning must be between 0 and 365 days.'
    };

    for (const [controlName, message] of Object.entries(validationMessages)) {
      const control = this.settingsForm.get(controlName);
      if (!control?.invalid) {
        continue;
      }

      if (controlName === 'hospitalName' && (control.hasError('required') || control.hasError('maxlength'))) {
        return message;
      }
      if (controlName === 'hospitalEmail' && (control.hasError('required') || control.hasError('email') || control.hasError('maxlength'))) {
        return message;
      }
      if (controlName === 'hospitalPhone' && (control.hasError('required') || control.hasError('pattern') || control.hasError('maxlength'))) {
        return message;
      }
      if (controlName === 'hospitalAddress' && (control.hasError('required') || control.hasError('maxlength'))) {
        return message;
      }
      if (controlName === 'defaultAppointmentDuration' && (control.hasError('required') || control.hasError('min') || control.hasError('max'))) {
        return message;
      }
      if (controlName === 'lowStockThreshold' && (control.hasError('required') || control.hasError('min'))) {
        return message;
      }
      if (controlName === 'expiryWarningDays' && (control.hasError('required') || control.hasError('min') || control.hasError('max'))) {
        return message;
      }
    }

    return 'Please correct the highlighted fields.';
  }

  private getApiErrorMessage(error: any): string | null {
    const apiMessage = error?.error?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return apiMessage;
    }

    const validationErrors = error?.error?.errors;
    if (validationErrors && typeof validationErrors === 'object') {
      const firstError = Object.values(validationErrors)
        .flat()
        .find(value => typeof value === 'string' && value.trim());

      if (typeof firstError === 'string') {
        return firstError;
      }
    }

    return null;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}