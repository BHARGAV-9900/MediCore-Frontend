import {
  Component,
  Inject,
  inject,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import { Payment }
  from '../../models/payment';

import { CreatePayment }
  from '../../models/create-payment';

import { PaymentMethod }
  from '../../models/payment-method';

import { PaymentService }
  from '../../services/payment.service';

import { BillService }
  from '../../services/bill.service';

import { NotificationService }
  from '../../../../core/services/notification.service';


interface BillOption {
  id: number;
  publicId: string;
  appointmentId: number;
  totalAmount: number;
  paymentStatus?: string;
  isPaid?: boolean;
}


@Component({
  selector: 'app-payment-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './payment-dialog.html',

  styleUrl:
    './payment-dialog.scss'
})
export class PaymentDialog
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly service =
    inject(PaymentService);

  private readonly billService =
    inject(BillService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef<PaymentDialog>);


  readonly payment:
    Payment | undefined;


  bills: BillOption[] = [];

  loading = false;

  loadingBills = false;


  readonly paymentMethods = [
    {
      value: PaymentMethod.Cash,
      label: 'Cash'
    },
    {
      value: PaymentMethod.CreditCard,
      label: 'Credit Card'
    },
    {
      value: PaymentMethod.DebitCard,
      label: 'Debit Card'
    },
    {
      value: PaymentMethod.UPI,
      label: 'UPI'
    },
    {
      value: PaymentMethod.NetBanking,
      label: 'Net Banking'
    },
    {
      value: PaymentMethod.Insurance,
      label: 'Insurance'
    }
  ];


  form = this.fb.nonNullable.group({

    billId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    amount: [
      0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    paymentMethod: [
      PaymentMethod.Cash,
      [
        Validators.required
      ]
    ]

  });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: Payment | undefined
  ) {

    this.payment = data;

  }


  ngOnInit(): void {

    this.loadBills();

  }


  loadBills(): void {

    this.loadingBills = true;

    this.billService
      .getAll()
      .subscribe({

        next: response => {

          this.bills =
            response.data ?? [];

          this.loadingBills = false;

        },

        error: error => {

          console.error(error);

          this.loadingBills = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to load bills'
          );

        }

      });

  }


  get isEditMode(): boolean {

    return !!this.payment;

  }


  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Payment'
      : 'Add Payment';

  }


  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update payment details'
      : 'Record a payment against a bill';

  }


  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }

    return this.isEditMode
      ? 'Update Payment'
      : 'Save Payment';

  }


  get billControl() {

    return this.form.controls.billId;

  }


  get amountControl() {

    return this.form.controls.amount;

  }


  get paymentMethodControl() {

    return this.form.controls.paymentMethod;

  }


  getBillLabel(
    bill: BillOption
  ): string {

    return `Bill #${bill.id} — Appointment #${bill.appointmentId} — ₹${bill.totalAmount}`;

  }


  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const formValue =
      this.form.getRawValue();


    if (
      !this.isEditMode &&
      formValue.billId <= 0
    ) {

      this.form.controls.billId.setErrors({
        required: true
      });

      this.form.controls.billId.markAsTouched();

      return;

    }


    const model: CreatePayment = {

      billId:
        formValue.billId,

      amount:
        Number(formValue.amount),

      paymentMethod:
        formValue.paymentMethod

    };


    this.loading = true;


    if (this.isEditMode) {

      this.update(model);

    }
    else {

      this.create(model);

    }

  }


  private create(
    model: CreatePayment
  ): void {

    this.service
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Payment created successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to create payment'
          );

        }

      });

  }


  private update(
    model: CreatePayment
  ): void {

    if (!this.payment) {

      return;

    }


    this.service
      .update(
        this.payment.id,
        {
          amount:
            model.amount,

          paymentMethod:
            model.paymentMethod
        }
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Payment updated successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to update payment'
          );

        }

      });

  }


  cancel(): void {

    if (this.loading) {

      return;

    }

    this.dialogRef.close(false);

  }

}