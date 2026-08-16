import {
  Component,
  Inject,
  inject
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { Bill }
  from '../../models/bill';


@Component({
  selector: 'app-bill-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './bill-delete-confirmation.html',

  styleUrl:
    './bill-delete-confirmation.scss'
})
export class BillDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<BillDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Bill
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}