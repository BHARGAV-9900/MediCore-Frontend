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

import { Prescription }
  from '../../models/prescription';


@Component({
  selector: 'app-prescription-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './prescription-delete-confirmation.html',

  styleUrl:
    './prescription-delete-confirmation.scss'
})
export class PrescriptionDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<PrescriptionDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Prescription
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}