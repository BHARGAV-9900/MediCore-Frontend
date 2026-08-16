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
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';

import { CommonModule } from '@angular/common';

import { Notification } from '../../models/notification';


@Component({
  selector: 'app-notification-mark-read-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],

  templateUrl:
    './notification-mark-read-confirmation.html',

  styleUrl:
    './notification-mark-read-confirmation.scss'
})
export class NotificationMarkReadConfirmationComponent {

  constructor(
    private readonly dialogRef:
      MatDialogRef<NotificationMarkReadConfirmationComponent>,

    @Inject(MAT_DIALOG_DATA)
    public readonly notification: Notification
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}