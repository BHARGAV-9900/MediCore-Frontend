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
  Bill
} from '../../models/bill';

import {
  BillService
} from '../../services/bill.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';

import {
  MatDialog
} from '@angular/material/dialog';

import {
  BillDialog
} from '../../dialogs/bill-dialog/bill-dialog';
@Component({
  selector: 'app-billing',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './billing.html',

  styleUrl:
    './billing.scss'
})
export class Billing
  implements OnInit {

  private readonly service =
    inject(BillService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialog =
    inject(MatDialog);

  bills: Bill[] = [];

  loading = false;


  ngOnInit(): void {

    this.loadBills();

  }


  loadBills(): void {

    this.loading = true;

    this.service
      .getAll()
      .subscribe({

        next: response => {

          this.bills =
            response.data ?? [];

          this.loading = false;

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to load bills'
          );

        }

      });

  }


  addBill(): void {

    const dialogRef =
      this.dialog.open(
        BillDialog,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',

          autoFocus: false,
          disableClose: true,

          panelClass:
            'bill-dialog-panel'
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadBills();

        }

      });

  }


  editBill(
    bill: Bill
  ): void {

    const dialogRef =
      this.dialog.open(
        BillDialog,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',

          autoFocus: false,
          disableClose: true,

          panelClass:
            'bill-dialog-panel',

          data: bill
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadBills();

        }

      });

  }


  deleteBill(
    bill: Bill
  ): void {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete bill #${bill.id}?`
      );

    if (!confirmed) {

      return;

    }


    this.loading = true;

    this.service
      .delete(bill.id)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Bill deleted successfully'
          );

          this.loadBills();

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to delete bill'
          );

        }

      });

  }

}