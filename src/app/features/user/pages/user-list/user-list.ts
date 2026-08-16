import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import { UserService } from '../../services/user.service';

import { User } from '../../models/user';

import {
  NotificationService
} from '../../../../core/services/notification.service';

import {
  UserDialog,
  UserDialogData,
  UserRoleOption
} from '../../dialogs/user-dialog/user-dialog';

import {
  UserDeactivateConfirmation
} from '../../dialogs/user-deactivate-confirmation/user-deactivate-confirmation';

import {
  UserDeleteConfirmation
} from '../../dialogs/user-delete-confirmation/user-delete-confirmation';


@Component({
  selector: 'app-user-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './user-list.html',

  styleUrl: './user-list.scss'
})
export class UserList
  implements OnInit {


  private readonly service =
    inject(UserService);


  private readonly dialog =
    inject(MatDialog);


  private readonly notification =
    inject(NotificationService);


  users: User[] = [];


  loading = false;


  searchText = '';


  displayedColumns = [
    'name',
    'email',
    'role',
    'status',
    'created',
    'actions'
  ];


  ngOnInit(): void {

    this.loadUsers();

  }


  loadUsers(): void {

    this.loading = true;


    this.service
      .getAll()
      .subscribe({

        next: response => {

          console.log(response);

          this.users =
            response.data ?? [];

          this.loading = false;

        },


        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            'Unable to load users'
          );

        }

      });

  }


  get filteredUsers(): User[] {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    if (!search) {

      return this.users;

    }


    return this.users.filter(user =>

      user.fullName
        .toLowerCase()
        .includes(search) ||

      user.email
        .toLowerCase()
        .includes(search) ||

      user.role
        .toLowerCase()
        .includes(search)

    );

  }


  addUser(): void {

    const roles =
      this.getRoleOptions();


    const dialogRef =
      this.dialog.open(
        UserDialog,
        {
          width: '600px',

          data: {
            roles
          } as UserDialogData
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadUsers();

        }

      });

  }


  editUser(
    user: User
  ): void {

    const roles =
      this.getRoleOptions();


    const dialogRef =
      this.dialog.open(
        UserDialog,
        {
          width: '600px',

          data: {
            user,
            roles
          } as UserDialogData
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadUsers();

        }

      });

  }


  getRoleOptions(): UserRoleOption[] {

    return [

      {
        id: 1,
        name: 'Admin'
      },

      {
        id: 2,
        name: 'Doctor'
      },

      {
        id: 3,
        name: 'Receptionist'
      },

      {
        id: 4,
        name: 'Lab Technician'
      },

      {
        id: 5,
        name: 'Pharmacist'
      },

      {
        id: 1001,
        name: 'Accountant'
      }

    ];

  }


  activateUser(
    user: User
  ): void {

    this.service
      .activate(user.id)
      .subscribe({

        next: () => {

          this.notification.success(
            'User activated successfully'
          );

          this.loadUsers();

        },


        error: error => {

          console.error(error);

          this.notification.error(
            'Unable to activate user'
          );

        }

      });

  }


  deactivateUser(
    user: User
  ): void {

    const dialogRef =
      this.dialog.open(
        UserDeactivateConfirmation,
        {
          width: '560px',
          maxWidth: '95vw',

          autoFocus: false,
          disableClose: true,

          panelClass:
            'user-deactivate-dialog-panel',

          data: {
            user
          }
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(confirmed => {

        if (!confirmed) {

          return;

        }


        this.service
          .deactivate(user.id)
          .subscribe({

            next: () => {

              this.notification.success(
                'User deactivated successfully'
              );

              this.loadUsers();

            },


            error: error => {

              console.error(error);

              this.notification.error(
                'Unable to deactivate user'
              );

            }

          });

      });

  }


  deleteUser(
    user: User
  ): void {

    const dialogRef =
      this.dialog.open(
        UserDeleteConfirmation,
        {
          width: '560px',
          maxWidth: '95vw',

          autoFocus: false,
          disableClose: true,

          panelClass:
            'user-delete-dialog-panel',

          data: {
            user
          }
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(confirmed => {

        if (!confirmed) {

          return;

        }


        this.service
          .delete(user.id)
          .subscribe({

            next: () => {

              this.notification.success(
                'User deleted successfully'
              );

              this.loadUsers();

            },


            error: error => {

              console.error(error);

              this.notification.error(
                'Unable to delete user'
              );

            }

          });

      });

  }

}