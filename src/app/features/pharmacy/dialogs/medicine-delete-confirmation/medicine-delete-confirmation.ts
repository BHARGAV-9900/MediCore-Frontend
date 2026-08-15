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

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { Medicine }
  from '../../models/medicine';


@Component({
  selector: 'app-medicine-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './medicine-delete-confirmation.html',

  styleUrl:
    './medicine-delete-confirmation.scss'
})
export class MedicineDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<MedicineDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Medicine
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}