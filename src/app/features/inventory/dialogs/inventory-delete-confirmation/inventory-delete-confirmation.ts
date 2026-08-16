import {
  Component,
  Inject,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { Inventory } from '../../models/inventory';


export interface InventoryDeleteConfirmationData {
  inventory: Inventory;
}


@Component({
  selector: 'app-inventory-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './inventory-delete-confirmation.html',

  styleUrl:
    './inventory-delete-confirmation.scss'
})
export class InventoryDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<InventoryDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: InventoryDeleteConfirmationData
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}