import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';

import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';
import { CreateNotification } from '../../models/create-notification';

import {
  NotificationDialogComponent
} from '../../dialogs/notification-dialog/notification-dialog';

@Component({
  selector: 'app-notification-list',
  standalone: true,

  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule
  ],

  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss'
})
export class NotificationListComponent
  implements OnInit {

  notifications: Notification[] = [];

  loading = false;

  errorMessage = '';

  constructor(
    private readonly notificationService:
      NotificationService,

    private readonly dialog:
      MatDialog,

    private readonly snackBar:
      MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {

    this.loading = true;
    this.errorMessage = '';

    this.notificationService
      .getAll()
      .subscribe({

        next: (response) => {

          this.notifications =
            response.data ?? [];

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Failed to load notifications:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to load notifications. Please try again.';

        }

      });

  }

  refresh(): void {
    this.loadNotifications();
  }

  openAddDialog(): void {

    const dialogRef =
      this.dialog.open(
        NotificationDialogComponent,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          panelClass: 'notification-dialog-panel'
        }
      );

    dialogRef.afterClosed()
      .subscribe(
        (result: CreateNotification | undefined) => {

          if (!result) {
            return;
          }

          this.createNotification(result);

        }
      );

  }

  private createNotification(
    notification: CreateNotification
  ): void {

    this.loading = true;

    this.notificationService
      .create(notification)
      .subscribe({

        next: () => {

          this.loading = false;

          this.showSuccess(
            'Notification created successfully.'
          );

          this.loadNotifications();

        },

        error: (error) => {

          console.error(
            'Failed to create notification:',
            error
          );

          this.loading = false;

          this.showError(
            'Failed to create notification.'
          );

        }

      });

  }

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

          this.showSuccess(
            'Notification marked as read.'
          );

        },

        error: (error) => {

          console.error(
            'Failed to mark notification as read:',
            error
          );

          this.showError(
            'Failed to mark notification as read.'
          );

        }

      });

  }

  deleteNotification(
    notification: Notification
  ): void {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${notification.title}"?`
      );

    if (!confirmed) {
      return;
    }

    this.notificationService
      .delete(notification.id)
      .subscribe({

        next: () => {

          this.notifications =
            this.notifications.filter(
              item => item.id !== notification.id
            );

          this.showSuccess(
            'Notification deleted successfully.'
          );

        },

        error: (error) => {

          console.error(
            'Failed to delete notification:',
            error
          );

          this.showError(
            'Failed to delete notification.'
          );

        }

      });

  }

  getTypeClass(type: string): string {

    return type
      .toLowerCase()
      .replace(/\s+/g, '-');

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
        panelClass: ['success-snackbar']
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
        panelClass: ['error-snackbar']
      }
    );

  }

}