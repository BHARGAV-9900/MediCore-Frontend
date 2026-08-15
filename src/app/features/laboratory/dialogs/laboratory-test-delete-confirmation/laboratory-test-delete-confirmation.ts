import { Component, inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { LaboratoryTest }
  from '../../models/laboratory-test';


@Component({
  selector: 'app-laboratory-test-delete-confirmation',

  standalone: true,

  imports: [
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './laboratory-test-delete-confirmation.html',

  styleUrl:
    './laboratory-test-delete-confirmation.scss'
})
export class LaboratoryTestDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<LaboratoryTestDeleteConfirmation>
    );


  readonly data =
    inject(MAT_DIALOG_DATA) as LaboratoryTest;


  cancel(): void {

    this.dialogRef.close(false);

  }


  delete(): void {

    this.dialogRef.close(true);

  }

}