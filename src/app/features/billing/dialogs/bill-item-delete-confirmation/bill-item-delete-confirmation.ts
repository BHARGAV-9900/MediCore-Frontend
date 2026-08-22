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

import { BillItem } from '../../models/bill-item';


@Component({
  selector: 'app-bill-item-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './bill-item-delete-confirmation.html',

  styleUrl:
    './bill-item-delete-confirmation.scss'
})
export class BillItemDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<BillItemDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: BillItem
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}