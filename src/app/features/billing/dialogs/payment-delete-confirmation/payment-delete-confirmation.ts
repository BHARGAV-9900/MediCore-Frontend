import {
  Component,
  Inject,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import {
  Payment
} from '../../models/payment';


@Component({
  selector: 'app-payment-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './payment-delete-confirmation.html',

  styleUrl:
    './payment-delete-confirmation.scss'
})
export class PaymentDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<PaymentDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Payment
  ) {}


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


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}