import { Component, inject } from '@angular/core';

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-login',

    standalone: true,

    imports: [
        ReactiveFormsModule
    ],

    templateUrl: './login.html',

    styleUrl: './login.scss'
})
export class Login {

    private readonly fb = inject(FormBuilder);

    private readonly authService =
        inject(AuthenticationService);

    private readonly router =
        inject(Router);


    hidePassword = true;

    loading = false;


    loginForm = this.fb.group({

        email: [
            '',
            [
                Validators.required,
                Validators.email
            ]
        ],

        password: [
            '',
            [
                Validators.required,
                Validators.minLength(6)
            ]
        ]

    });


    togglePasswordVisibility(): void {

        this.hidePassword =
            !this.hidePassword;

    }


    login(): void {

        if (this.loginForm.invalid) {

            this.loginForm.markAllAsTouched();

            return;

        }


        this.loading = true;


        this.authService
            .login({

                email:
                    this.loginForm.value.email!,

                password:
                    this.loginForm.value.password!

            })

            .subscribe({

                next: () => {

                    this.authService
                        .loadCurrentUser()
                        .subscribe({

                        next: response => {

                            this.loading = false;

                            console.log(
                            'Logged-in user:',
                            response.data
                            );

                            this.router.navigate([
                            '/dashboard/dashboard'
                            ]);

                        },

                error: error => {

                    this.loading = false;

                    console.error(
                    'Failed to load current user:',
                    error
                    );

                    this.authService.clearAuthentication();

                    alert(
                    'Unable to load your user profile.'
                    );

                }

                });

            },


                error: (error) => {

                    this.loading = false;

                    console.error(
                        'Login failed:',
                        error
                    );

                    alert(
                        error?.error?.message ??
                        'Invalid email or password.'
                    );

                }

            });

    }

}