import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { Subject, forkJoin, interval } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

import { AuthenticationService }
  from '../../../features/authentication/services/authentication.service';

import { NotificationService }
  from '../../../features/notification/services/notification.service';

import { Notification }
  from '../../../features/notification/models/notification';

import { UserProfile }
  from '../../../features/authentication/models/user-profile';


@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    RouterLink,
    NgClass,
    MatIconModule

  ],

  templateUrl: './navbar.html',

  styleUrl: './navbar.scss',


})
export class Navbar
  implements OnInit, OnDestroy {

  private readonly router = inject(Router);

  private readonly authService =
    inject(AuthenticationService);

  private readonly notificationService =
    inject(NotificationService);

  private readonly destroy$ =
    new Subject<void>();


  // =========================================================
  // USER MENU
  // =========================================================

  userMenuOpen = false;


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  notificationMenuOpen = false;

  notifications: Notification[] = [];

  unreadCount = 0;

  notificationLoading = false;

    currentUser: UserProfile | null = null;
  // =========================================================
  // INITIALIZATION
  // =========================================================

  ngOnInit(): void {


    this.authService.currentUser$
      .subscribe(user => {

        this.currentUser = user;

      });

    this.loadNotifications();

    /*
     * Refresh notifications every 60 seconds.
     *
     * startWith(0) makes the first request happen immediately.
     */
    interval(60000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.notificationService.getAll()
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {

          this.notifications =
            (response.data ?? [])
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );

          this.loadUnreadCount();

        },

        error: error => {

          console.error(
            'Failed to refresh notifications:',
            error
          );

        }
      });

  }


  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  loadNotifications(): void {

    this.notificationLoading = true;

    this.notificationService
      .getAll()
      .subscribe({

        next: response => {

          this.notifications =
            (response.data ?? [])
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );

          this.notificationLoading = false;

          this.loadUnreadCount();

        },

        error: error => {

          console.error(
            'Failed to load notifications:',
            error
          );

          this.notificationLoading = false;

        }

      });

  }


  // =========================================================
  // LOAD UNREAD COUNT
  // =========================================================

  loadUnreadCount(): void {

    this.notificationService
      .getUnread()
      .subscribe({

        next: response => {

          this.unreadCount =
            response.data?.length ?? 0;

        },

        error: error => {

          console.error(
            'Failed to load unread notifications:',
            error
          );

        }

      });

  }


  // =========================================================
  // TOGGLE NOTIFICATION MENU
  // =========================================================

  toggleNotifications(): void {

    this.notificationMenuOpen =
      !this.notificationMenuOpen;

    if (this.notificationMenuOpen) {

      this.loadNotifications();

    }

    this.userMenuOpen = false;

  }


  // =========================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =========================================================

  markAsRead(
    notification: Notification
  ): void {

    if (notification.isRead) {

      return;

    }

    this.notificationService
      .markAsRead(notification.id)
      .subscribe({

        next: () => {

          notification.isRead = true;

          this.unreadCount =
            Math.max(
              0,
              this.unreadCount - 1
            );

        },

        error: error => {

          console.error(
            'Failed to mark notification as read:',
            error
          );

        }

      });

  }


  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  markAllAsRead(): void {

    const unreadNotifications =
      this.notifications.filter(
        notification =>
          !notification.isRead
      );

    if (
      unreadNotifications.length === 0
    ) {

      return;

    }

    const requests =
      unreadNotifications.map(
        notification =>
          this.notificationService
            .markAsRead(notification.id)
      );

    forkJoin(requests)
      .subscribe({

        next: () => {

          this.notifications =
            this.notifications.map(
              notification => ({
                ...notification,
                isRead: true
              })
            );

          this.unreadCount = 0;

        },

        error: error => {

          console.error(
            'Failed to mark all notifications as read:',
            error
          );

        }

      });

  }


  // =========================================================
  // OPEN NOTIFICATION
  // =========================================================

  openNotification(
    notification: Notification
  ): void {

    this.markAsRead(notification);

    this.notificationMenuOpen = false;

    /*
     * We can later make notification types navigate
     * to their related modules.
     *
     * For now, open the full notifications page.
     */
    this.router.navigate([
      '/dashboard/notifications'
    ]);

  }


  // =========================================================
  // VIEW ALL
  // =========================================================

  viewAllNotifications(): void {

    this.notificationMenuOpen = false;

    this.router.navigate([
      '/dashboard/notifications'
    ]);

  }


  // =========================================================
  // NOTIFICATION TYPE ICON
  // =========================================================

 getNotificationIcon(type: string): string {

  const normalizedType =
    type?.toLowerCase() ?? '';

  if (
    normalizedType.includes('appointment')
  ) {
    return 'calendar_month';
  }

  if (
    normalizedType.includes('laboratory') ||
    normalizedType.includes('lab')
  ) {
    return 'science';
  }

  if (
    normalizedType.includes('inventory') ||
    normalizedType.includes('stock') ||
    normalizedType.includes('medicine')
  ) {
    return 'medication';
  }

  if (
    normalizedType.includes('payment') ||
    normalizedType.includes('billing')
  ) {
    return 'payments';
  }

  if (
    normalizedType.includes('patient')
  ) {
    return 'person';
  }

  return 'notifications';

}

  // =========================================================
  // NOTIFICATION TYPE CLASS
  // =========================================================

  getNotificationTypeClass(
    type: string
  ): string {

    const normalizedType =
      type?.toLowerCase() ?? '';

    if (
      normalizedType.includes('appointment')
    ) {

      return 'appointment';

    }

    if (
      normalizedType.includes('laboratory') ||
      normalizedType.includes('lab')
    ) {

      return 'laboratory';

    }

    if (
      normalizedType.includes('inventory') ||
      normalizedType.includes('stock') ||
      normalizedType.includes('medicine')
    ) {

      return 'inventory';

    }

    if (
      normalizedType.includes('payment') ||
      normalizedType.includes('billing')
    ) {

      return 'payment';

    }

    if (
      normalizedType.includes('patient')
    ) {

      return 'patient';

    }

    return 'default';

  }


  // =========================================================
  // TIME AGO
  // =========================================================

  getTimeAgo(
    createdAt: string
  ): string {

    const created =
      new Date(createdAt).getTime();

    const now =
      Date.now();

    const difference =
      Math.max(
        0,
        now - created
      );

    const seconds =
      Math.floor(
        difference / 1000
      );

    if (seconds < 60) {

      return 'Just now';

    }

    const minutes =
      Math.floor(
        seconds / 60
      );

    if (minutes < 60) {

      return `${minutes}m ago`;

    }

    const hours =
      Math.floor(
        minutes / 60
      );

    if (hours < 24) {

      return `${hours}h ago`;

    }

    const days =
      Math.floor(
        hours / 24
      );

    if (days < 7) {

      return `${days}d ago`;

    }

    return new Date(createdAt)
      .toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short'
        }
      );

  }


  // =========================================================
  // USER MENU
  // =========================================================

  toggleUserMenu(): void {

    this.userMenuOpen =
      !this.userMenuOpen;

    this.notificationMenuOpen =
      false;

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

          this.authService
            .clearAuthentication();

          this.router.navigate([
            '/login'
          ]);

        }

      });

  }


  // =========================================================
  // CLOSE MENUS WHEN CLICKING OUTSIDE
  // =========================================================

  @HostListener(
    'document:click',
    ['$event']
  )
  onDocumentClick(
    event: MouseEvent
  ): void {

    const target =
      event.target as HTMLElement;

    if (
      !target.closest(
        '.user-menu-container'
      )
    ) {

      this.userMenuOpen = false;

    }

    if (
      !target.closest(
        '.notification-container'
      )
    ) {

      this.notificationMenuOpen = false;

    }

  }


  openProfile(): void {

    this.router.navigate([
      '/dashboard/profile'
    ]);

  }


  openChangePassword(): void {

    this.router.navigate([
      '/dashboard/change-password'
    ]);

  }


  // =========================================================
  // CLEANUP
  // =========================================================

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}