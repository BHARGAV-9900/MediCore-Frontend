import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { MatDialog }
  from '@angular/material/dialog';

import { Prescription }
  from '../../models/prescription';

import { PrescriptionService }
  from '../../services/prescription.service';

import { NotificationService }
  from '../../../../core/services/notification.service';

import { PrescriptionDialog }
  from '../../dialogs/prescription-dialog/prescription-dialog';

import { PrescriptionDeleteConfirmation }
  from '../../dialogs/prescription-delete-confirmation/prescription-delete-confirmation';


@Component({
  selector: 'app-prescriptions',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './prescriptions.html',

  styleUrl: './prescriptions.scss'
})
export class Prescriptions implements OnInit {

  private readonly service =
    inject(PrescriptionService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialog =
    inject(MatDialog);


  prescriptions: Prescription[] = [];

  loading = false;


  ngOnInit(): void {

    this.loadPrescriptions();

  }


  loadPrescriptions(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        this.prescriptions =
          response.data ?? [];

        this.loading = false;

      },

      error: error => {

        console.error(error);

        this.loading = false;

        this.notification.error(
          error?.error?.message ??
          'Unable to load prescriptions'
        );

      }

    });

  }


  addPrescription(): void {

    const dialogRef =
      this.dialog.open(
        PrescriptionDialog,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          autoFocus: false,
          disableClose: true,
          panelClass: 'prescription-dialog-panel'
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadPrescriptions();

        }

      });

  }


  editPrescription(
    prescription: Prescription
  ): void {

    const dialogRef =
      this.dialog.open(
        PrescriptionDialog,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          autoFocus: false,
          disableClose: true,
          panelClass: 'prescription-dialog-panel',
          data: prescription
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadPrescriptions();

        }

      });

  }


  deletePrescription(
    prescription: Prescription
  ): void {

    const dialogRef =
      this.dialog.open(
        PrescriptionDeleteConfirmation,
        {
          width: '520px',
          maxWidth: '95vw',
          autoFocus: false,
          disableClose: true,
          data: prescription
        }
      );


    dialogRef.afterClosed()
      .subscribe(confirmed => {

        if (!confirmed) {

          return;

        }


        this.loading = true;


        this.service
          .delete(prescription.id)
          .subscribe({

            next: () => {

              this.loading = false;

              this.notification.success(
                'Prescription deleted successfully'
              );

              this.loadPrescriptions();

            },

            error: error => {

              console.error(error);

              this.loading = false;

              this.notification.error(
                error?.error?.message ??
                'Unable to delete prescription'
              );

            }

          });

      });

  }

}