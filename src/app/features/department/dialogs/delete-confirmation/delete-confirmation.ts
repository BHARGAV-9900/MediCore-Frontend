import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES }
from '../../../../shared/material/material';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [...MATERIAL_MODULES],
  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.scss'
})
export class DeleteConfirmation {

  readonly data = inject(MAT_DIALOG_DATA);

  private readonly dialogRef =
    inject(MatDialogRef<DeleteConfirmation>);

  cancel() {

    this.dialogRef.close(false);

  }

  delete() {

    this.dialogRef.close(true);

  }

}