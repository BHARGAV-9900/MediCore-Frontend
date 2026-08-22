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

  loadingPaymentSummary = false;


  /* =========================================
     Payment Summary
     ========================================= */

  selectedBillAmount = 0;

  totalPaid = 0;

  remainingBalance = 0;

  paymentStatus:
    'Unpaid' |
    'Partial' |
    'Paid' = 'Unpaid';


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


  /* =========================================
     Form
     ========================================= */

  form = this.fb.nonNullable.group({

    billId: [

      0,

      [

        Validators.required,

        Validators.min(1)

      ]

    ],

    amount: [

      null as number | null,

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


  /* =========================================
     Constructor
     ========================================= */

  constructor(

    @Inject(MAT_DIALOG_DATA)

    data: Payment | undefined

  ) {

    this.payment = data;

  }


  /* =========================================
     Lifecycle
     ========================================= */

  ngOnInit(): void {

    this.loadBills();


    this.form.controls.billId
      .valueChanges
      .subscribe(billId => {

        if (billId > 0) {

          this.loadPaymentSummary(billId);

        }
        else {

          this.resetPaymentSummary();

        }

      });

  }


  /* =========================================
     Load Bills
     ========================================= */

  loadBills(): void {

    this.loadingBills = true;


    this.billService
      .getAll()
      .subscribe({

        next: response => {

          this.bills =
            response.data ?? [];


          this.loadingBills = false;


          /*
           * Edit mode.
           *
           * The bill select is disabled,
           * therefore valueChanges may not
           * fire after the initial value.
           */
          if (this.isEditMode && this.payment) {

            this.form.controls.billId
              .setValue(this.payment.billId);

            this.loadPaymentSummary(
              this.payment.billId
            );

          }

        },


        error: (error: any) => {

          console.error(error);


          this.loadingBills = false;


          this.notification.error(

            error?.error?.message ??

            error?.error?.title ??

            'Unable to load bills'

          );

        }

      });

  }


  /* =========================================
     Load Payment Summary
     ========================================= */

  private loadPaymentSummary(
    billId: number
  ): void {

    const bill =
      this.bills.find(
        x => x.id === billId
      );


    if (!bill) {

      this.resetPaymentSummary();

      return;

    }


    this.selectedBillAmount =
      Number(bill.totalAmount);


    this.loadingPaymentSummary = true;


    this.service
      .getByBill(billId)
      .subscribe({

        next: response => {

          const payments =
            response.data ?? [];


          this.totalPaid =
            payments.reduce(

              (total, payment) =>

                total +
                Number(payment.amount),

              0

            );


          /*
           * When editing an existing payment,
           * remove that payment from the current
           * summary because the user is editing it.
           */
          if (this.isEditMode && this.payment) {

            this.totalPaid -=
              Number(this.payment.amount);

          }


          if (this.totalPaid < 0) {

            this.totalPaid = 0;

          }


          this.updatePaymentSummary();


          this.loadingPaymentSummary = false;

        },


        error: (error: any) => {

          console.error(

            'Load payment summary error:',

            error

          );


          this.loadingPaymentSummary = false;


          this.totalPaid = 0;

          this.updatePaymentSummary();


          this.notification.error(

            error?.error?.message ??

            'Unable to load payment summary'

          );

        }

      });

  }


  /* =========================================
     Update Summary
     ========================================= */

  private updatePaymentSummary(): void {

    this.remainingBalance =

      Math.max(

        this.selectedBillAmount -
        this.totalPaid,

        0

      );


    if (this.totalPaid <= 0) {

      this.paymentStatus = 'Unpaid';

    }

    else if (
      this.totalPaid <
      this.selectedBillAmount
    ) {

      this.paymentStatus = 'Partial';

    }

    else {

      this.paymentStatus = 'Paid';

    }

  }


  /* =========================================
     Reset Summary
     ========================================= */

  private resetPaymentSummary(): void {

    this.selectedBillAmount = 0;

    this.totalPaid = 0;

    this.remainingBalance = 0;

    this.paymentStatus = 'Unpaid';

  }


  /* =========================================
     Current Payment Maximum
     ========================================= */

  get maximumPaymentAmount(): number {

    return this.remainingBalance;

  }


  /* =========================================
     Edit Mode
     ========================================= */

  get isEditMode(): boolean {

    return !!this.payment;

  }


  /* =========================================
     Dialog Title
     ========================================= */

  get dialogTitle(): string {

    return this.isEditMode

      ? 'Edit Payment'

      : 'Add Payment';

  }


  /* =========================================
     Dialog Subtitle
     ========================================= */

  get dialogSubtitle(): string {

    return this.isEditMode

      ? 'Update payment details'

      : 'Record a payment against a bill';

  }


  /* =========================================
     Submit Button
     ========================================= */

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


  /* =========================================
     Form Controls
     ========================================= */

  get billControl() {

    return this.form.controls.billId;

  }


  get amountControl() {

    return this.form.controls.amount;

  }


  get paymentMethodControl() {

    return this.form.controls.paymentMethod;

  }


  /* =========================================
     Bill Label
     ========================================= */

  getBillLabel(
    bill: BillOption
  ): string {

    return `Bill #${bill.id} — Appointment #${bill.appointmentId} — ₹${bill.totalAmount}`;

  }


  /* =========================================
     Save
     ========================================= */

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const formValue =
      this.form.getRawValue();


    if (
      formValue.billId <= 0
    ) {

      this.form.controls.billId.setErrors({

        required: true

      });

      this.form.controls.billId.markAsTouched();

      return;

    }


    if (
      formValue.amount === null ||
      formValue.amount <= 0
    ) {

      this.form.controls.amount.markAsTouched();

      return;

    }


    /*
     * Frontend validation.
     *
     * Backend still remains the final authority.
     */
    if (
      !this.isEditMode &&
      formValue.amount >
      this.remainingBalance
    ) {

      this.notification.error(

        `Payment amount cannot exceed the remaining balance of ₹${this.remainingBalance.toFixed(2)}.`

      );

      return;

    }


    /*
     * Edit mode.
     *
     * remainingBalance already excludes
     * the current payment.
     */
    if (
      this.isEditMode &&
      formValue.amount >
      this.remainingBalance
    ) {

      this.notification.error(

        `Payment amount cannot exceed the remaining balance of ₹${this.remainingBalance.toFixed(2)}.`

      );

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


  /* =========================================
     Create Payment
     ========================================= */

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


        error: (error: any) => {

          console.error(error);


          this.loading = false;


          /*
           * HTTP 409 = payment exceeds
           * remaining balance or bill already paid.
           */
          if (error?.status === 409) {

            this.notification.error(

              error?.error?.message ??

              error?.error?.title ??

              'Payment cannot exceed the remaining balance.'

            );

            return;

          }


          this.notification.error(

            error?.error?.message ??

            error?.error?.title ??

            'Unable to create payment'

          );

        }

      });

  }


  /* =========================================
     Update Payment
     ========================================= */

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


        error: (error: any) => {

          console.error(error);


          this.loading = false;


          if (error?.status === 409) {

            this.notification.error(

              error?.error?.message ??

              error?.error?.title ??

              'Payment cannot exceed the remaining balance.'

            );

            return;

          }


          this.notification.error(

            error?.error?.message ??

            error?.error?.title ??

            'Unable to update payment'

          );

        }

      });

  }


  /* =========================================
     Cancel
     ========================================= */

  cancel(): void {

    if (this.loading) {

      return;

    }


    this.dialogRef.close(false);

  }

}