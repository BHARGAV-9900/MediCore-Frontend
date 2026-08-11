import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import { MatDialog } from '@angular/material/dialog';

import { Payment } from '../../models/payment';

import { PaymentService }
  from '../../services/payment.service';

import { NotificationService }
  from '../../../../core/services/notification.service';

import {
  PaymentDialog
} from '../../dialogs/payment-dialog/payment-dialog';

@Component({
  selector: 'app-payments',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './payments.html',

  styleUrl:
    './payments.scss'
})
export class Payments
  implements OnInit {

  private readonly service =
    inject(PaymentService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialog =
    inject(MatDialog);

  payments: Payment[] = [];

  loading = false;

  ngOnInit(): void {

    this.loadPayments();

  }

  loadPayments(): void {

    this.loading = true;

    this.service
      .getAll()
      .subscribe({

        next: response => {

          this.payments =
            response.data ?? [];

          this.loading = false;

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to load payments'
          );

        }

      });

  }

  addPayment(): void {

    const dialogRef =
      this.dialog.open(
        PaymentDialog,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',

          autoFocus: false,

          disableClose: true,

          panelClass:
            'payment-dialog-panel'
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadPayments();

        }

      });

  }

  editPayment(
    payment: Payment
  ): void {

    const dialogRef =
      this.dialog.open(
        PaymentDialog,
        {
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',

          autoFocus: false,

          disableClose: true,

          panelClass:
            'payment-dialog-panel',

          data: payment
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadPayments();

        }

      });

  }

  deletePayment(
    payment: Payment
  ): void {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete payment #${payment.id}?`
      );

    if (!confirmed) {

      return;

    }

    this.loading = true;

    this.service
      .delete(payment.id)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Payment deleted successfully'
          );

          this.loadPayments();

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to delete payment'
          );

        }

      });

  }

  getPaymentMethodName(
    method: number
  ): string {

    switch (method) {

      case 1:
        return 'Cash';

      case 2:
        return 'Credit Card';

      case 3:
        return 'Debit Card';

      case 4:
        return 'UPI';

      case 5:
        return 'Net Banking';

      case 6:
        return 'Insurance';

      default:
        return 'Unknown';

    }

  }

}