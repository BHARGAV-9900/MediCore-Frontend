import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { LaboratoryOrderService }
  from '../../services/laboratory-order.service';

import { LaboratoryOrder }
  from '../../models/laboratory-order';

import { LaboratoryOrderDialog }
  from '../../dialogs/laboratory-order-dialog/laboratory-order-dialog';

import { NotificationService }
  from '../../../../core/services/notification.service';

import { LaboratoryOrderDeleteConfirmation }
  from '../../dialogs/laboratory-order-delete-confirmation/laboratory-order-delete-confirmation';


@Component({
  selector: 'app-laboratory-order-list',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './laboratory-order-list.html',

  styleUrl:
    './laboratory-order-list.scss'
})
export class LaboratoryOrderList
  implements OnInit {

  private readonly service =
    inject(LaboratoryOrderService);

  private readonly dialog =
    inject(MatDialog);

  private readonly notification =
    inject(NotificationService);


  laboratoryOrders:
    LaboratoryOrder[] = [];

  loading = false;


  ngOnInit(): void {

    this.loadLaboratoryOrders();

  }


  loadLaboratoryOrders(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        this.laboratoryOrders =
          response.data ?? [];

        this.loading = false;

      },

      error: error => {

        console.error(
          'Failed to load laboratory orders:',
          error
        );

        this.loading = false;

        this.notification.error(
          error?.error?.message ??
          'Unable to load laboratory orders'
        );

      }

    });

  }


  openDialog(
    laboratoryOrder?: LaboratoryOrder
  ): void {

    const dialogRef =
      this.dialog.open(
        LaboratoryOrderDialog,
        {
          width: '650px',

          maxWidth: '95vw',

          maxHeight: '90vh',

          data: laboratoryOrder
        }
      );


    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {

          this.loadLaboratoryOrders();

        }

      }
    );

  }


  editLaboratoryOrder(
    laboratoryOrder: LaboratoryOrder
  ): void {

    this.openDialog(
      laboratoryOrder
    );

  }


  deleteLaboratoryOrder(
    laboratoryOrder: LaboratoryOrder
  ): void {

    const dialogRef =
      this.dialog.open(
        LaboratoryOrderDeleteConfirmation,
        {
          width: '500px',

          maxWidth: '95vw',

          data: laboratoryOrder
        }
      );


    dialogRef.afterClosed().subscribe(
      confirmed => {

        if (!confirmed) {

          return;

        }


        this.service
          .delete(laboratoryOrder.id)
          .subscribe({

            next: () => {

              this.notification.success(
                'Laboratory order deleted successfully'
              );

              this.loadLaboratoryOrders();

            },

            error: error => {

              console.error(
                'Failed to delete laboratory order:',
                error
              );

              this.notification.error(
                error?.error?.message ??
                'Unable to delete laboratory order'
              );

            }

          });

      }
    );

  }

}