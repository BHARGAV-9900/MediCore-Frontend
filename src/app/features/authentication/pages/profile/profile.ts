import { Component, OnInit, inject } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  private readonly authService = inject(AuthenticationService);

  profile: UserProfile | null = null;

  loading = true;

  errorMessage = '';

  ngOnInit(): void {

    this.loadProfile();

  }

  loadProfile(): void {

    this.loading = true;

    this.authService.getCurrentUser()
      .subscribe({

        next: response => {

          this.profile = response.data;

          this.loading = false;

        },

        error: error => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ??
            'Unable to load profile.';

          this.loading = false;

        }

      });

  }

}