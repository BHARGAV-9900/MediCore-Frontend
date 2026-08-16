import {
  Component,
  Inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  Notification
} from '../../models/notification';


@Component({
  selector:
    'app-notification-delete-confirmation',

  standalone: true,

  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl:
    './notification-delete-confirmation.html',

  styleUrl:
    './notification-delete-confirmation.scss'
})
export class NotificationDeleteConfirmationComponent {

  constructor(
    private readonly dialogRef:
      MatDialogRef<
        NotificationDeleteConfirmationComponent
      >,

    @Inject(MAT_DIALOG_DATA)
    public readonly notification:
      Notification
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirmDelete(): void {

    this.dialogRef.close(true);

  }

}