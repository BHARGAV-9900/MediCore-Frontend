import {
  Component,
  Inject,
  inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { Appointment }
  from '../../models/appointment';


export interface AppointmentStatusConfirmationData {

  appointment: Appointment;

  action:
    | 'check-in'
    | 'start-consultation'
    | 'complete'
    | 'cancel'
    | 'no-show';

}


@Component({
  selector: 'app-status-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './status-confirmation.html',

  styleUrl: './status-confirmation.scss'
})
export class AppointmentStatusConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<AppointmentStatusConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: AppointmentStatusConfirmationData
  ) {}


  get title(): string {

    switch (this.data.action) {

      case 'check-in':
        return 'Check In Patient';

      case 'start-consultation':
        return 'Start Consultation';

      case 'complete':
        return 'Complete Appointment';

      case 'cancel':
        return 'Cancel Appointment';

      case 'no-show':
        return 'Mark No Show';

      default:
        return 'Confirm Action';

    }

  }


  get message(): string {

    switch (this.data.action) {

      case 'check-in':
        return 'Are you sure you want to check in this patient?';

      case 'start-consultation':
        return 'Are you sure you want to start the consultation for this appointment?';

      case 'complete':
        return 'Are you sure you want to mark this appointment as completed?';

      case 'cancel':
        return 'Are you sure you want to cancel this appointment?';

      case 'no-show':
        return 'Are you sure you want to mark this appointment as No Show?';

      default:
        return 'Are you sure you want to continue?';

    }

  }


  get confirmText(): string {

    switch (this.data.action) {

      case 'check-in':
        return 'Check In';

      case 'start-consultation':
        return 'Start Consultation';

      case 'complete':
        return 'Complete';

      case 'cancel':
        return 'Cancel Appointment';

      case 'no-show':
        return 'Mark No Show';

      default:
        return 'Confirm';

    }

  }


  get confirmColor(): string {

    switch (this.data.action) {

      case 'cancel':
      case 'no-show':
        return 'warn';

      default:
        return 'primary';

    }

  }


  confirm(): void {

    this.dialogRef.close(true);

  }


  close(): void {

    this.dialogRef.close(false);

  }

}