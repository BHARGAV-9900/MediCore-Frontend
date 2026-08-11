import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword {

  private readonly fb = inject(FormBuilder);

  private readonly authService =
    inject(AuthenticationService);

  private readonly router =
    inject(Router);


  loading = false;

  successMessage = '';

  errorMessage = '';


  changePasswordForm = this.fb.group({

    currentPassword: [
      '',
      [
        Validators.required
      ]
    ],

    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],

    confirmPassword: [
      '',
      [
        Validators.required
      ]
    ]

  });


  changePassword(): void {

    this.successMessage = '';

    this.errorMessage = '';


    if (this.changePasswordForm.invalid) {

      this.changePasswordForm.markAllAsTouched();

      return;

    }


    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = this.changePasswordForm.value;


    if (newPassword !== confirmPassword) {

      this.errorMessage =
        'New password and confirm password do not match.';

      return;

    }


    this.loading = true;


    this.authService.changePassword({

      currentPassword: currentPassword!,

      newPassword: newPassword!,

      confirmPassword: confirmPassword!

    })
    .subscribe({

      next: response => {

        this.loading = false;

        this.successMessage =
          response.message ||
          'Password changed successfully.';

        this.changePasswordForm.reset();

      },

      error: error => {

        this.loading = false;

        console.error(error);

        this.errorMessage =
          error?.error?.message ??
          'Unable to change password.';

      }

    });

  }

}