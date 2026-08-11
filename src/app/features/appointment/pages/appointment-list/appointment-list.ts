import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { AppointmentService }
  from '../../services/appointment.service';

import { Appointment }
  from '../../models/appointment';

import { AppointmentDialog }
  from '../../dialogs/appointment-dialog/appointment-dialog';

import { NotificationService }
  from '../../../../core/services/notification.service';


@Component({
  selector: 'app-appointment-list',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './appointment-list.html',

  styleUrl: './appointment-list.scss'
})
export class AppointmentList implements OnInit {

  private readonly service =
    inject(AppointmentService);

  private readonly dialog =
    inject(MatDialog);

  private readonly notification =
    inject(NotificationService);


  appointments: Appointment[] = [];

  loading = false;


  ngOnInit(): void {

    this.loadAppointments();

  }


  // =========================================================
  // Load Appointments
  // =========================================================

  loadAppointments(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        console.log(
          'Appointments:',
          response
        );

        this.appointments =
          response.data;

        this.loading = false;

      },

      error: error => {

        console.error(
          'Unable to load appointments:',
          error
        );

        this.loading = false;

        this.notification.error(
          'Unable to load appointments'
        );

      }

    });

  }


  // =========================================================
  // Open Create / Edit Dialog
  // =========================================================

  openDialog(
    appointment?: Appointment
  ): void {

    const dialogRef =
      this.dialog.open(
        AppointmentDialog,
        {
          width: '700px',
          maxWidth: '95vw',
          data: appointment
        }
      );


    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {

          this.loadAppointments();

        }

      }
    );

  }


  // =========================================================
  // Edit Appointment
  // =========================================================

  editAppointment(
    appointment: Appointment
  ): void {

    this.openDialog(appointment);

  }


  // =========================================================
  // Delete Appointment
  // =========================================================

  deleteAppointment(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this appointment?'
      );


    if (!confirmed) {

      return;

    }


    this.service.delete(id).subscribe({

      next: () => {

        this.notification.success(
          'Appointment deleted successfully'
        );

        this.loadAppointments();

      },

      error: error => {

        console.error(
          'Delete appointment error:',
          error
        );

        this.notification.error(
          error?.error?.message ??
          'Unable to delete appointment'
        );

      }

    });

  }


  // =========================================================
  // Get Readable Status
  // =========================================================

  getStatusLabel(
    status: number
  ): string {

    switch (status) {

      case 1:
        return 'Scheduled';

      case 2:
        return 'Checked In';

      case 3:
        return 'In Progress';

      case 4:
        return 'Completed';

      case 5:
        return 'Cancelled';

      case 6:
        return 'No Show';

      default:
        return 'Unknown';

    }

  }


  // =========================================================
  // Check In
  // Scheduled → Checked In
  // =========================================================

  checkIn(
    appointment: Appointment
  ): void {

    this.updateStatus(
      appointment,
      2,
      'Check in'
    );

  }


  // =========================================================
  // Start Consultation
  // Checked In → In Progress
  // =========================================================

  startConsultation(
    appointment: Appointment
  ): void {

    this.updateStatus(
      appointment,
      3,
      'Start consultation'
    );

  }


  // =========================================================
  // Complete Appointment
  // In Progress → Completed
  // =========================================================

  completeAppointment(
    appointment: Appointment
  ): void {

    this.updateStatus(
      appointment,
      4,
      'Complete appointment'
    );

  }


  // =========================================================
  // Cancel Appointment
  // Scheduled → Cancelled
  // =========================================================

  cancelAppointment(
    appointment: Appointment
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to cancel this appointment?'
      );


    if (!confirmed) {

      return;

    }


    this.updateStatus(
      appointment,
      5,
      'Cancel appointment'
    );

  }


  // =========================================================
  // Mark No Show
  // Scheduled → No Show
  // =========================================================

  markNoShow(
    appointment: Appointment
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to mark this appointment as No Show?'
      );


    if (!confirmed) {

      return;

    }


    this.updateStatus(
      appointment,
      6,
      'Mark as No Show'
    );

  }


  // =========================================================
  // Common Status Update
  // =========================================================

  private updateStatus(
    appointment: Appointment,
    status: number,
    actionName: string
  ): void {

    this.service
      .updateStatus(
        appointment.id,
        status
      )
      .subscribe({

        next: () => {

          this.notification.success(
            `${actionName} successful`
          );

          this.loadAppointments();

        },

        error: error => {

          console.error(
            `${actionName} error:`,
            error
          );

          this.notification.error(
            error?.error?.message ??
            `${actionName} failed`
          );

        }

      });

  }

}