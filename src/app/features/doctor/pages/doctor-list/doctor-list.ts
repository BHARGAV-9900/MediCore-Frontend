import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor';

import { DepartmentService } from '../../../department/services/department.service';
import { Department } from '../../../department/models/department';

import { DoctorDialog } from '../../dialogs/doctor-dialog/doctor-dialog';
import { DeleteConfirmation } from '../../../department/dialogs/delete-confirmation/delete-confirmation';

import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './doctor-list.html',
  styleUrl: './doctor-list.scss'
})
export class DoctorList implements OnInit {

  private readonly service = inject(DoctorService);

  private readonly dialog = inject(MatDialog);

  private readonly departmentService =
    inject(DepartmentService);

  private readonly notification =
    inject(NotificationService);

  doctors: Doctor[] = [];

  departments: Department[] = [];

  loading = false;

  displayedColumns = [
    'id',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'specialization',
    'experienceYears',
    'consultationFee',
    'departmentName',
    'isAvailable',
    'actions'
  ];

  ngOnInit(): void {

    this.loadDoctors();
    this.loadDepartments();

  }

  loadDoctors(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        this.doctors = response.data ?? [];

        this.loading = false;

      },

      error: error => {

        console.error(
          'Failed to load doctors:',
          error
        );

        this.loading = false;

        this.notification.error(
          'Unable to load doctors'
        );

      }

    });

  }

  loadDepartments(): void {

    this.departmentService.getAll().subscribe({

      next: response => {

        this.departments = response.data ?? [];

      },

      error: error => {

        console.error(
          'Failed to load departments:',
          error
        );

        this.notification.error(
          'Unable to load departments'
        );

      }

    });

  }

  openDialog(doctor?: Doctor): void {

    const dialogRef = this.dialog.open(
      DoctorDialog,
      {
        width: '700px',
        maxWidth: '95vw',
        disableClose: true,
        data: doctor
      }
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result === true) {

        this.loadDoctors();

      }

    });

  }

  deleteDoctor(doctor: Doctor): void {

    const dialogRef = this.dialog.open(
      DeleteConfirmation,
      {
        width: '420px',
        maxWidth: '95vw',
        data: {
          name: `Dr. ${doctor.firstName} ${doctor.lastName}`
        }
      }
    );

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed !== true) {
        return;
      }

      this.loading = true;

      this.service.delete(doctor.id).subscribe({

        next: () => {

          this.notification.success(
            'Doctor deleted successfully'
          );

          this.loadDoctors();

        },

        error: error => {

          console.error(
            'Failed to delete doctor:',
            error
          );

          this.loading = false;

          this.notification.error(
            'Unable to delete doctor'
          );

        }

      });

    });

  }

}