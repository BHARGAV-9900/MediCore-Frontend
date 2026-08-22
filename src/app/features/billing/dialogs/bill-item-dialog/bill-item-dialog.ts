import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../../shared/material/material';
import { BillItem, CreateBillItem } from '../../models/bill-item';
import { BillItemService } from '../../services/bill-item.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-bill-item-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  templateUrl: './bill-item-dialog.html',
  styleUrl: './bill-item-dialog.scss'
})
export class BillItemDialog {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BillItemService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<BillItemDialog>);

  readonly item: BillItem | undefined;
  readonly billId: number;
  loading = false;

  form = this.fb.nonNullable.group({
    description: ['', [Validators.required, Validators.maxLength(250)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    unitPrice: [0, [Validators.required, Validators.min(0.01)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: { billId: number; item?: BillItem }) {
    this.billId = data.billId;
    this.item = data.item;

    if (data.item) {
      this.form.patchValue({
        description: data.item.description,
        quantity: data.item.quantity,
        unitPrice: data.item.unitPrice
      });
    }
  }

  get isEditMode(): boolean {
    return !!this.item;
  }

  get lineTotal(): number {
    const value = this.form.getRawValue();
    return Number(value.quantity) * Number(value.unitPrice);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();
    const model: CreateBillItem = {
      billId: this.billId,
      description: value.description.trim(),
      quantity: Number(value.quantity),
      unitPrice: Number(value.unitPrice)
    };

    const request = this.item
      ? this.service.update(this.item.id, model)
      : this.service.create(model);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.notification.success(
          this.isEditMode ? 'Bill item updated successfully' : 'Bill item created successfully'
        );
        this.dialogRef.close(true);
      },
      error: error => {
        console.error(error);
        this.loading = false;
        this.notification.error(
          error?.error?.message ??
          (this.isEditMode ? 'Unable to update bill item' : 'Unable to create bill item')
        );
      }
    });
  }

  cancel(): void {
    if (!this.loading) this.dialogRef.close(false);
  }
}