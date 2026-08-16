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

import { PrescriptionItem }
  from '../../models/prescription-item';


@Component({
  selector: 'app-prescription-item-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './prescription-item-delete-confirmation.html',

  styleUrl:
    './prescription-item-delete-confirmation.scss'
})
export class PrescriptionItemDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<PrescriptionItemDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: PrescriptionItem
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}