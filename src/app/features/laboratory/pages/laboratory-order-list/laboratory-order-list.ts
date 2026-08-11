import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule }
from '@angular/common';

import { MatDialog }
from '@angular/material/dialog';

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


@Component({
  selector: 'app-laboratory-order-list',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './laboratory-order-list.html',

  styleUrl: './laboratory-order-list.scss'
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


  // Load laboratory orders

  loadLaboratoryOrders(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        console.log(
          'Laboratory Orders:',
          response
        );

        this.laboratoryOrders =
          response.data;

        this.loading = false;

      },

      error: error => {

        console.error(error);

        this.loading = false;

        this.notification.error(
          'Unable to load laboratory orders'
        );

      }

    });

  }


  // Open create/edit dialog

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


  // Edit

  editLaboratoryOrder(
    laboratoryOrder: LaboratoryOrder
  ): void {

    this.openDialog(laboratoryOrder);

  }


  // Delete

  deleteLaboratoryOrder(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this laboratory order?'
      );


    if (!confirmed) {

      return;

    }


    this.service.delete(id).subscribe({

      next: () => {

        this.notification.success(
          'Laboratory order deleted successfully'
        );

        this.loadLaboratoryOrders();

      },

      error: error => {
        console.error(
          'Failed to create laboratory order:',
          error
        );

        this.loading = false;

        this.notification.error(
          error?.error?.message ??
          'Unable to create laboratory order'
        );
      }

    });

  }

}