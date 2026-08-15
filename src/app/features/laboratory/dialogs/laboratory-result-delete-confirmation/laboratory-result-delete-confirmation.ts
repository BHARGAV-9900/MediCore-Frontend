import {
  Component,
  Inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';


export interface LaboratoryResultDeleteConfirmationData {

  laboratoryResultId: number;

  laboratoryOrderId: number;

}


@Component({
  selector: 'app-laboratory-result-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './laboratory-result-delete-confirmation.html',

  styleUrl:
    './laboratory-result-delete-confirmation.scss'
})
export class LaboratoryResultDeleteConfirmation {

  constructor(

    private readonly dialogRef:
      MatDialogRef<LaboratoryResultDeleteConfirmation>,

    @Inject(MAT_DIALOG_DATA)
    public data:
      LaboratoryResultDeleteConfirmationData

  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}