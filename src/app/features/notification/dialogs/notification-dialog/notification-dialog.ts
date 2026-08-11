import {
  Component,
  Inject
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import { CommonModule } from '@angular/common';

import { CreateNotification } from '../../models/create-notification';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './notification-dialog.html',
  styleUrl: './notification-dialog.scss'
})
export class NotificationDialogComponent {

  notificationForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,

    private readonly dialogRef:
      MatDialogRef<NotificationDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: unknown
  ) {

    this.notificationForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      message: [
        '',
        [
          Validators.required,
          Validators.maxLength(500)
        ]
      ],

      type: [
        'Appointment',
        Validators.required
      ]

    });

  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {

    if (this.notificationForm.invalid) {

      this.notificationForm.markAllAsTouched();

      return;
    }

    const notification:
      CreateNotification =
      this.notificationForm.getRawValue();

    this.dialogRef.close(notification);
  }
}