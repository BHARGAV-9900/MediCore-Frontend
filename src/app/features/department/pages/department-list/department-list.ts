import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';

import { DepartmentDialog } from '../../dialogs/department-dialog/department-dialog';
import { DeleteConfirmation } from '../../dialogs/delete-confirmation/delete-confirmation';

import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './department-list.html',
  styleUrl: './department-list.scss'
})
export class DepartmentList implements OnInit {

  private readonly service =
    inject(DepartmentService);

  private readonly dialog =
    inject(MatDialog);

  private readonly notification =
    inject(NotificationService);

  /**
   * Departments displayed in the table.
   */
  departments: Department[] = [];

  /**
   * Loading state.
   */
  loading = false;

  /**
   * Table columns.
   */
  displayedColumns = [
    'id',
    'name',
    'description',
    'actions'
  ];

  /**
   * Load departments when page opens.
   */
  ngOnInit(): void {

    this.loadDepartments();

  }

  /**
   * Get all departments from API.
   */
  loadDepartments(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        this.departments =
          response.data ?? [];

        this.loading = false;

      },

      error: error => {

        console.error(
          'Failed to load departments:',
          error
        );

        this.loading = false;

        this.notification.error(
          'Unable to load departments'
        );

      }

    });

  }

  /**
   * Open Department dialog.
   *
   * IMPORTANT:
   *
   * openDialog()
   *      => CREATE
   *
   * openDialog(department)
   *      => EDIT
   */
  openDialog(
    department?: Department
  ): void {

    const dialogRef =
      this.dialog.open(
        DepartmentDialog,
        {
          width: '560px',
          maxWidth: '95vw',
          disableClose: true,

          /**
           * Explicitly pass null when creating.
           *
           * This guarantees that the dialog
           * knows it is in CREATE mode.
           */
          data: department ?? null
        }
      );

    /**
     * Reload table after successful
     * create/update.
     */
    dialogRef.afterClosed().subscribe(
      result => {

        if (result === true) {

          this.loadDepartments();

        }

      }
    );

  }

  /**
   * Edit existing department.
   */
  editDepartment(
    department: Department
  ): void {

    this.openDialog(department);

  }

  /**
   * Delete department.
   */
  deleteDepartment(
    department: Department
  ): void {

    const dialogRef =
      this.dialog.open(
        DeleteConfirmation,
        {
          width: '420px',
          maxWidth: '95vw',
          data: department
        }
      );

    dialogRef.afterClosed().subscribe(
      confirmed => {

        /**
         * User cancelled deletion.
         */
        if (confirmed !== true) {

          return;

        }

        this.loading = true;

        this.service
          .delete(department.id)
          .subscribe({

            next: () => {

              this.notification.success(
                'Department deleted successfully'
              );

              this.loadDepartments();

            },

            error: error => {

              console.error(
                'Failed to delete department:',
                error
              );

              this.loading = false;

              /**
               * Display backend error
               * when available.
               */
              this.notification.error(
                this.getErrorMessage(
                  error,
                  'Unable to delete department'
                )
              );

            }

          });

      }
    );

  }

  /**
   * Extract backend error message.
   */
  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    return (
      error?.error?.message
      ||
      error?.error?.Message
      ||
      error?.message
      ||
      fallback
    );

  }

}