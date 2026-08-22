import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';
import {
  BillItem,
  CreateBillItem
} from '../../models/bill-item';

import { BillItemService } from '../../services/bill-item.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-bill-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './bill-item-dialog.html',
  styleUrl: './bill-item-dialog.scss'
})
export class BillItemDialog {

  private readonly fb = inject(FormBuilder);

  private readonly service =
    inject(BillItemService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef<BillItemDialog>);


  readonly item: BillItem | undefined;

  readonly billId: number;

  loading = false;


  /* =========================================
     Form
     ========================================= */

  form = this.fb.group({

    description: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.maxLength(250)
      ]
    ),

    quantity: this.fb.control<number | null>(
      null,
      [
        Validators.required,
        Validators.min(1)
      ]
    ),

    unitPrice: this.fb.control<number | null>(
      null,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    )

  });


  /* =========================================
     Constructor
     ========================================= */

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: {
      billId: number;
      item?: BillItem;
    }
  ) {

    this.billId = data.billId;

    this.item = data.item;


    if (data.item) {

      this.form.patchValue({

        description:
          data.item.description,

        quantity:
          data.item.quantity,

        unitPrice:
          data.item.unitPrice

      });

    }

  }


  /* =========================================
     Edit Mode
     ========================================= */

  get isEditMode(): boolean {

    return !!this.item;

  }


  /* =========================================
     Line Total
     ========================================= */

  get lineTotal(): number {

    const value =
      this.form.getRawValue();

    return (
      Number(value.quantity ?? 0) *
      Number(value.unitPrice ?? 0)
    );

  }


  /* =========================================
     Save
     ========================================= */

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    this.loading = true;


    const value =
      this.form.getRawValue();


    const model: CreateBillItem = {

      billId: this.billId,

      description:
        value.description.trim(),

      quantity:
        Number(value.quantity),

      unitPrice:
        Number(value.unitPrice)

    };


    /* =====================================
       UPDATE
       ===================================== */

    if (this.item) {

      this.service
        .update(this.item.id, model)
        .subscribe({

          next: () => {

            this.loading = false;

            this.notification.success(
              'Bill item updated successfully'
            );

            this.dialogRef.close(true);

          },

          error: (error: any) => {

            console.error(
              'Update Bill Item Error:',
              error
            );

            this.loading = false;

            this.notification.error(
              error?.error?.message ??
              error?.error?.title ??
              'Unable to update bill item'
            );

          }

        });

      return;

    }


    /* =====================================
       CREATE
       ===================================== */

    this.service
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Bill item created successfully'
          );

          this.dialogRef.close(true);

        },

        error: (error: any) => {

          console.error(
            'Create Bill Item Error:',
            error
          );

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            error?.error?.title ??
            'Unable to create bill item'
          );

        }

      });

  }


  /* =========================================
     Cancel
     ========================================= */

  cancel(): void {

    if (!this.loading) {

      this.dialogRef.close(false);

    }

  }

}