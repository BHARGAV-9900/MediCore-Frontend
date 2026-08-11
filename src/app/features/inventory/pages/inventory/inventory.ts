import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MatDialog
} from '@angular/material/dialog';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import {
  Inventory as InventoryModel
} from '../../models/inventory';

import {
  InventoryService
} from '../../services/inventory.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';

import {
  InventoryDialog
} from '../../dialogs/inventory-dialog/inventory-dialog';


@Component({
  selector: 'app-inventory',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './inventory.html',

  styleUrl:
    './inventory.scss'
})
export class Inventory
  implements OnInit {


  private readonly service =
    inject(InventoryService);


  private readonly notification =
    inject(NotificationService);


  private readonly dialog =
    inject(MatDialog);


  inventoryList:
    InventoryModel[] = [];


  loading = false;


  ngOnInit(): void {

    this.loadInventory();

  }


  loadInventory(): void {

    this.loading = true;


    this.service
      .getAll()
      .subscribe({

        next: response => {

          this.inventoryList =
            response.data ?? [];

          this.loading = false;

        },


        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to load inventory'
          );

        }

      });

  }


  addInventory(): void {

    const dialogRef = this.dialog.open(
      InventoryDialog,
      {
        width: '700px',
        maxWidth: '95vw',

        height: 'auto',
        maxHeight: '90vh',

        autoFocus: false,
        disableClose: true,

        panelClass: 'inventory-dialog-panel'
      }
    );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadInventory();

        }

      });

  }


  editInventory(
    inventory: InventoryModel
  ): void {

    const dialogRef = this.dialog.open(
      InventoryDialog,
      {
        width: '700px',
        maxWidth: '95vw',

        height: 'auto',
        maxHeight: '90vh',

        autoFocus: false,
        disableClose: true,

        panelClass: 'inventory-dialog-panel',

        data: inventory
      }
    );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadInventory();

        }

      });

  }


  deleteInventory(
    inventory: InventoryModel
  ): void {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete inventory #${inventory.id}?`
      );


    if (!confirmed) {

      return;

    }


    this.loading = true;


    this.service
      .delete(inventory.id)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Inventory deleted successfully'
          );

          this.loadInventory();

        },


        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to delete inventory'
          );

        }

      });

  }

}