import {
  Component,
  Inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import {
  MedicalRecord
} from '../../models/medical-record';


@Component({
  selector: 'app-medical-record-delete-confirmation',

  standalone: true,

  imports: [
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './medical-record-delete-confirmation.html',

  styleUrl:
    './medical-record-delete-confirmation.scss'
})
export class MedicalRecordDeleteConfirmation {

  constructor(

    private readonly dialogRef:
      MatDialogRef<MedicalRecordDeleteConfirmation>,

    @Inject(MAT_DIALOG_DATA)
    public readonly data:
      MedicalRecord

  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}