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


export interface UserDeactivateConfirmationData {
  user: User;
}


@Component({
  selector: 'app-user-deactivate-confirmation',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './user-deactivate-confirmation.html',

  styleUrl:
    './user-deactivate-confirmation.scss'
})
export class UserDeactivateConfirmation {

  private readonly dialogRef =
    inject(
      MatDialogRef<UserDeactivateConfirmation>
    );


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: UserDeactivateConfirmationData
  ) {}


  cancel(): void {

    this.dialogRef.close(false);

  }


  confirm(): void {

    this.dialogRef.close(true);

  }

}