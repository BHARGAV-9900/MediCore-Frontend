import { Component, HostListener, inject } from '@angular/core';

import { Router } from '@angular/router';

import { RouterLink } from '@angular/router';

import { AuthenticationService } from '../../../features/authentication/services/authentication.service';

@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './navbar.html',

  styleUrl: './navbar.scss'
})
export class Navbar {

  private readonly router = inject(Router);

  private readonly authService =
    inject(AuthenticationService);


  userMenuOpen = false;


  toggleUserMenu(): void {

    this.userMenuOpen =
      !this.userMenuOpen;

  }


  logout(): void {

  this.userMenuOpen = false;

  this.authService
    .logout()
    .subscribe({

      next: () => {

        this.router.navigate([
          '/login'
        ]);

      },

      error: (error: unknown) => {

        console.error(
          'Logout failed:',
          error
        );

        /*
         * Even if the backend request fails,
         * clear the local session so the user
         * is not left in a half-logged-in state.
         */

        this.authService.clearAuthentication();

        this.router.navigate([
          '/login'
        ]);

      }

    });

}


  @HostListener(
    'document:click',
    ['$event']
  )
  onDocumentClick(event: MouseEvent): void {

    const target =
      event.target as HTMLElement;

    if (
      !target.closest('.user-menu-container')
    ) {

      this.userMenuOpen = false;

    }

  }


  openProfile(): void {

    this.router.navigate(['/dashboard/profile']);

  }


  openChangePassword(): void {

    this.router.navigate(['/dashboard/change-password']);

  }
}

