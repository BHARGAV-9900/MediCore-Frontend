import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';

import { DepartmentDialog } from '../../dialogs/department-dialog/department-dialog';

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

        console.log(response);

        this.departments =
          response.data;

        this.loading = false;

      },

      error: error => {

        console.error(error);

        this.loading = false;

      }

    });

  }

  openDialog(
    department?: Department
  ): void {

    const dialogRef =
      this.dialog.open(
        DepartmentDialog,
        {
          width: '560px',
          data: department
        }
      );

    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {

          this.loadDepartments();

        }

      }
    );

  }

  editDepartment(
    department: Department
  ): void {

    this.openDialog(department);

  }

  deleteDepartment(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this department?'
      );

    if (!confirmed) {

      return;

    }

    this.service.delete(id).subscribe({

      next: () => {

        this.notification.success(
          'Department deleted successfully'
        );

        this.loadDepartments();

      },

      error: error => {

        console.error(error);

        this.notification.error(
          'Unable to delete department'
        );

      }

    });

  }

}