import {
  Component,
  Inject,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { UserService } from '../../services/user.service';

import {
  User,
  CreateUser,
  UpdateUser
} from '../../models/user';

import { NotificationService } from '../../../../core/services/notification.service';


export interface UserRoleOption {
  id: number;
  name: string;
}


export interface UserDialogData {
  user?: User;
  roles: UserRoleOption[];
}


@Component({
  selector: 'app-user-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './user-dialog.html',

  styleUrl: './user-dialog.scss'
})
export class UserDialog {

  private readonly fb =
    inject(FormBuilder);

  private readonly service =
    inject(UserService);

  private readonly dialogRef =
    inject(MatDialogRef<UserDialog>);

  private readonly notification =
    inject(NotificationService);


  readonly isEdit: boolean;

  readonly roles: UserRoleOption[];


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: UserDialogData
  ) {

    this.isEdit = !!data.user;

    this.roles = data.roles ?? [];


    if (data.user) {

      this.form.patchValue({

        firstName:
          data.user.firstName,

        lastName:
          data.user.lastName,

        email:
          data.user.email,

        roleId:
          data.user.roleId

      });

    }

  }


  form = this.fb.group({

    firstName: this.fb.control(
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ),

    lastName: this.fb.control(
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ),

    email: this.fb.control(
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(200)
      ]
    ),

    password: this.fb.control(
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ]
    ),

    roleId: this.fb.control<number | null>(
      null,
      Validators.required
    )

  });


  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    // ==============================
    // UPDATE USER
    // ==============================

    if (this.isEdit && this.data.user) {

      const request: UpdateUser = {

        firstName:
          this.form.value.firstName!,

        lastName:
          this.form.value.lastName!,

        email:
          this.form.value.email!,

        roleId:
          this.form.value.roleId!

      };


      this.service
        .update(
          this.data.user.id,
          request
        )
        .subscribe({

          next: () => {

            this.notification.success(
              'User updated successfully'
            );

            this.dialogRef.close(true);

          },

          error: error => {

            console.error(error);

            if (error?.status === 409) {

              this.form.controls.email.setErrors({
                emailExists: true
              });

              this.form.controls.email.markAsTouched();

              this.notification.error(
                'Email already exists'
              );

              return;

            }

            this.notification.error(
              'Unable to update user'
            );

          }

        });

      return;

    }


    // ==============================
    // CREATE USER
    // ==============================

    const request: CreateUser = {

      firstName:
        this.form.value.firstName!,

      lastName:
        this.form.value.lastName!,

      email:
        this.form.value.email!,

      password:
        this.form.value.password!,

      roleId:
        this.form.value.roleId!

    };


    this.service
      .create(request)
      .subscribe({

        next: () => {

          this.notification.success(
            'User created successfully'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          console.error(error);

          if (error?.status === 409) {

            this.form.controls.email.setErrors({
              emailExists: true
            });

            this.form.controls.email.markAsTouched();

            this.notification.error(
              'Email already exists'
            );

            return;

          }

          this.notification.error(
            'Unable to create user'
          );

        }

      });

  }


  cancel(): void {

    this.dialogRef.close();

  }

}