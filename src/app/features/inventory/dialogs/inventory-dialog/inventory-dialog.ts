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

import {
  Inventory
} from '../../models/inventory';

import {
  CreateInventory
} from '../../models/create-inventory';

import {
  InventoryService
} from '../../services/inventory.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';


@Component({
  selector: 'app-inventory-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './inventory-dialog.html',

  styleUrl:
    './inventory-dialog.scss'
})
export class InventoryDialog
  implements OnInit {


  private readonly fb =
    inject(FormBuilder);


  private readonly service =
    inject(InventoryService);


  private readonly notification =
    inject(NotificationService);


  private readonly dialogRef =
    inject(MatDialogRef);


  readonly inventory:
    Inventory | undefined;


  loading = false;


  readonly minExpiryDate =
    new Date().toISOString().substring(0, 10);


  readonly maxExpiryDate =
    '9999-12-31';


  form = this.fb.group({

    medicineId: this.fb.control<number | null>(
      null,
      [
        Validators.required,
        Validators.min(1)
      ]
    ),


    quantityInStock: this.fb.control<number | null>(
      null,
      [
        Validators.required,
        Validators.min(0)
      ]
    ),


    minimumStockLevel: this.fb.control<number | null>(
      null,
      [
        Validators.required,
        Validators.min(0)
      ]
    ),


    batchNumber: this.fb.control(
      '',
      [
        Validators.required
      ]
    ),


    expiryDate: this.fb.control(
      '',
      [
        Validators.required
      ]
    ),


    supplier: this.fb.control(
      '',
      [
        Validators.required
      ]
    ),


    storageLocation: this.fb.control(
      '',
      [
        Validators.required
      ]
    )

  });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: Inventory | undefined
  ) {

    this.inventory = data;

  }


  ngOnInit(): void {

    if (this.inventory) {

      this.form.patchValue({

        medicineId:
          this.inventory.medicineId,

        quantityInStock:
          this.inventory.quantityInStock,

        minimumStockLevel:
          this.inventory.minimumStockLevel,

        batchNumber:
          this.inventory.batchNumber,

        expiryDate:
          this.inventory.expiryDate
            .substring(0, 10),

        supplier:
          this.inventory.supplier,

        storageLocation:
          this.inventory.storageLocation

      });

    }

  }


  get isEditMode(): boolean {

    return !!this.inventory;

  }


  get dialogTitle(): string {

    return this.isEditMode
      ? 'Edit Inventory'
      : 'Add Inventory';

  }


  get dialogSubtitle(): string {

    return this.isEditMode
      ? 'Update medicine stock details'
      : 'Add medicine stock to inventory';

  }


  get submitButtonText(): string {

    if (this.loading) {

      return this.isEditMode
        ? 'Updating...'
        : 'Saving...';

    }


    return this.isEditMode
      ? 'Update Inventory'
      : 'Save Inventory';

  }


  get medicineIdControl() {

    return this.form.controls.medicineId;

  }


  get quantityControl() {

    return this.form.controls.quantityInStock;

  }


  get minimumStockControl() {

    return this.form.controls.minimumStockLevel;

  }


  get batchNumberControl() {

    return this.form.controls.batchNumber;

  }


  get expiryDateControl() {

    return this.form.controls.expiryDate;

  }


  get supplierControl() {

    return this.form.controls.supplier;

  }


  get storageLocationControl() {

    return this.form.controls.storageLocation;

  }


  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const raw = this.form.getRawValue();

    const model: CreateInventory = {
      medicineId: raw.medicineId!,
      quantityInStock: raw.quantityInStock!,
      minimumStockLevel: raw.minimumStockLevel!,
      batchNumber: raw.batchNumber!,
      expiryDate: raw.expiryDate!,
      supplier: raw.supplier!,
      storageLocation: raw.storageLocation!
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
    model: CreateInventory
  ): void {

    this.service
      .create(model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Inventory created successfully'
          );

          this.dialogRef.close(true);

        },


        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to create inventory'
          );

        }

      });

  }


  private update(
    model: CreateInventory
  ): void {

    if (!this.inventory) {

      return;

    }


    this.service
      .update(
        this.inventory.id,
        model
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.notification.success(
            'Inventory updated successfully'
          );

          this.dialogRef.close(true);

        },


        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to update inventory'
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