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

  private readonly service = inject(DepartmentService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  departments: Department[] = [];

  loading = false;

  displayedColumns = [
    'id',
    'name',
    'description',
    'actions'
  ];

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        this.departments = response.data ?? [];

        this.loading = false;

      },

      error: error => {

        console.error('Failed to load departments:', error);

        this.loading = false;

        this.notification.error(
          'Unable to load departments'
        );

      }

    });
  }

  openDialog(department?: Department): void {

    const dialogRef = this.dialog.open(
      DepartmentDialog,
      {
        width: '560px',
        maxWidth: '95vw',
        disableClose: true,
        data: department
      }
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result === true) {
        this.loadDepartments();
      }

    });
  }

  editDepartment(department: Department): void {

    this.openDialog(department);

  }

  deleteDepartment(department: Department): void {

    const dialogRef = this.dialog.open(
      DeleteConfirmation,
      {
        width: '420px',
        maxWidth: '95vw',
        data: department
      }
    );

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed !== true) {
        return;
      }

      this.loading = true;

      this.service.delete(department.id).subscribe({

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

          this.notification.error(
            'Unable to delete department'
          );

        }

      });

    });

  }

}