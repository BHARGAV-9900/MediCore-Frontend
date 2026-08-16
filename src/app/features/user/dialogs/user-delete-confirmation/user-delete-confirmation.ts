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

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import { User } from '../../models/user';


export interface UserDeleteConfirmationData {
  user: User;
}


@Component({
  selector: 'app-user-delete-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './user-delete-confirmation.html',

  styleUrl:
    './user-delete-confirmation.scss'
})
export class UserDeleteConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<UserDeleteConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: UserDeleteConfirmationData
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}