import {
  Component,
  Inject,
  inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { Appointment }
  from '../../models/appointment';


@Component({
  selector: 'app-appointment-delete-confirmation',

  standalone: true,

  imports: [
    ...MATERIAL_MODULES
  ],

  templateUrl: './delete-confirmation.html',

  styleUrl: './delete-confirmation.scss'
})
export class AppointmentDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<AppointmentDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Appointment
  ) {}


  get formattedDate(): string {

    const date =
      new Date(this.data.appointmentDate);

    return date.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );

  }


  get formattedTime(): string {

    const date =
      new Date(this.data.appointmentDate);

    return date.toLocaleTimeString(
      'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    );

  }


  cancel(): void {

    this.dialogRef.close(false);

  }


  delete(): void {

    this.dialogRef.close(true);

  }

}