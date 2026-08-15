import { Component, inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { Patient } from '../../models/patient';

@Component({
  selector: 'app-patient-delete-confirmation',
  standalone: true,

  imports: [
    ...MATERIAL_MODULES
  ],

  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.scss'
})
export class PatientDeleteConfirmation {

  private readonly dialogRef =
    inject(MatDialogRef<PatientDeleteConfirmation>);

  readonly data =
    inject(MAT_DIALOG_DATA) as Patient;


  cancel(): void {

    this.dialogRef.close(false);

  }


  delete(): void {

    this.dialogRef.close(true);

  }

}