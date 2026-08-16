import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import {
  PrescriptionItem
} from '../../models/prescription-item';

import {
  PrescriptionItemService
} from '../../services/prescription-item.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';

import {
  MatDialog
} from '@angular/material/dialog';

import {
  PrescriptionItemDialog
} from '../../dialogs/prescription-item-dialog/prescription-item-dialog';

import {
  PrescriptionItemDeleteConfirmation
} from '../../dialogs/prescription-item-delete-confirmation/prescription-item-delete-confirmation';


@Component({
  selector: 'app-prescription-items',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './prescription-items.html',

  styleUrl:
    './prescription-items.scss'
})
export class PrescriptionItems
  implements OnInit {

  private readonly service =
    inject(PrescriptionItemService);


  private readonly notification =
    inject(NotificationService);


  private readonly dialog =
    inject(MatDialog);


  items: PrescriptionItem[] = [];


  loading = false;


  ngOnInit(): void {

    this.loadItems();

  }


  loadItems(): void {

    this.loading = true;


    this.service
      .getAll()
      .subscribe({

        next: response => {

          this.items =
            response.data ?? [];

          this.loading = false;

        },


        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to load prescription items'
          );

        }

      });

  }


  addPrescriptionItem(): void {

    const dialogRef =
      this.dialog.open(
        PrescriptionItemDialog,
        {
          width: '620px',

          maxWidth: '95vw',

          maxHeight: '90vh',

          autoFocus: false,

          disableClose: true,

          panelClass:
            'prescription-item-dialog-panel'
        }
      );


    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadItems();

        }

      });

  }


  editPrescriptionItem(
    item: PrescriptionItem
  ): void {

    const dialogRef =
      this.dialog.open(
        PrescriptionItemDialog,
        {
          width: '620px',

          maxWidth: '95vw',

          maxHeight: '90vh',

          autoFocus: false,

          disableClose: true,

          panelClass:
            'prescription-item-dialog-panel',

          data: item
        }
      );


    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadItems();

        }

      });

  }


  deleteItem(
    item: PrescriptionItem
  ): void {

    const dialogRef =
      this.dialog.open(
        PrescriptionItemDeleteConfirmation,
        {
          width: '520px',

          maxWidth: '95vw',

          autoFocus: false,

          disableClose: true,

          data: item
        }
      );


    dialogRef.afterClosed()
      .subscribe(confirmed => {

        if (!confirmed) {

          return;

        }


        this.loading = true;


        this.service
          .delete(item.id)
          .subscribe({

            next: () => {

              this.loading = false;


              this.notification.success(
                'Prescription item deleted successfully'
              );


              this.loadItems();

            },


            error: error => {

              console.error(error);

              this.loading = false;


              this.notification.error(
                error?.error?.message ??
                'Unable to delete prescription item'
              );

            }

          });

      });

  }

}