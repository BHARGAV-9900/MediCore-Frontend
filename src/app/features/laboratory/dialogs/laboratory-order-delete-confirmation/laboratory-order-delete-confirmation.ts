import { Component, inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { LaboratoryOrder }
  from '../../models/laboratory-order';


@Component({
  selector:
    'app-laboratory-order-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './laboratory-order-delete-confirmation.html',

  styleUrl:
    './laboratory-order-delete-confirmation.scss'
})
export class LaboratoryOrderDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<LaboratoryOrderDeleteConfirmation>
    );


  readonly data =
    inject(MAT_DIALOG_DATA) as LaboratoryOrder;


  cancel(): void {

    this.dialogRef.close(false);

  }


  delete(): void {

    this.dialogRef.close(true);

  }

}