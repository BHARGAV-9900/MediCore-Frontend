import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { Medicine }
  from '../../models/medicine';

import { MedicineService }
  from '../../services/medicine.service';

import { NotificationService }
  from '../../../../core/services/notification.service';

import { MatDialog }
  from '@angular/material/dialog';

import { MedicineDialog }
  from '../../dialogs/medicine-dialog/medicine-dialog';

import { MedicineDeleteConfirmation }
  from '../../dialogs/medicine-delete-confirmation/medicine-delete-confirmation';


@Component({
  selector: 'app-medicines',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './medicines.html',

  styleUrl: './medicines.scss'
})
export class Medicines implements OnInit {

  private readonly service =
    inject(MedicineService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialog =
    inject(MatDialog);


  medicines: Medicine[] = [];

  loading = false;


  ngOnInit(): void {

    this.loadMedicines();

  }


  loadMedicines(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        this.medicines =
          response.data ?? [];

        this.loading = false;

      },

      error: error => {

        console.error(error);

        this.loading = false;

        this.notification.error(
          error?.error?.message ??
          'Unable to load medicines'
        );

      }

    });

  }


  addMedicine(): void {

    const dialogRef =
      this.dialog.open(
        MedicineDialog,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          autoFocus: false,
          disableClose: true,
          panelClass: 'medicine-dialog-panel'
        }
      );


    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadMedicines();

        }

      });

  }


  editMedicine(
    medicine: Medicine
  ): void {

    const dialogRef =
      this.dialog.open(
        MedicineDialog,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          autoFocus: false,
          disableClose: true,
          panelClass: 'medicine-dialog-panel',
          data: medicine
        }
      );


    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadMedicines();

        }

      });

  }


  deleteMedicine(
    medicine: Medicine
  ): void {

    const dialogRef =
      this.dialog.open(
        MedicineDeleteConfirmation,
        {
          width: '500px',
          maxWidth: '95vw',
          autoFocus: false,
          disableClose: true,
          data: medicine
        }
      );


    dialogRef.afterClosed()
      .subscribe(confirmed => {

        if (!confirmed) {

          return;

        }


        this.loading = true;


        this.service
          .delete(medicine.id)
          .subscribe({

            next: () => {

              this.loading = false;

              this.notification.success(
                'Medicine deleted successfully'
              );

              this.loadMedicines();

            },

            error: error => {

              console.error(error);

              this.loading = false;

              this.notification.error(
                error?.error?.message ??
                'Unable to delete medicine'
              );

            }

          });

      });

  }

}