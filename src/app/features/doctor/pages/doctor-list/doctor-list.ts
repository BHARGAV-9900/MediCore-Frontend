import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor';

import { DepartmentService } from '../../../department/services/department.service';
import { Department } from '../../../department/models/department';

import { DoctorDialog } from '../../dialogs/doctor-dialog/doctor-dialog';
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

  private readonly service =
    inject(DoctorService);

  private readonly dialog =
    inject(MatDialog);

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

    this.departmentService.getAll().subscribe({

      next: response => {

        this.departments = response.data;

      },

      error: error => {

        console.error(error);

      }

    });

  }


  loadDoctors(): void {

    this.service.getAll().subscribe({

      next: response => {

        console.log(response);

        this.doctors = response.data;

        this.loading = false;

      },

      error: error => {

        console.error(error);

        this.loading = false;

      }

    });

  }


  openDialog(doctor?: Doctor): void {

    console.log(
      doctor
        ? 'Edit Doctor clicked'
        : 'Add Doctor clicked'
    );


    const dialogRef = this.dialog.open(
      DoctorDialog,
      {
        width: '700px',
        data: doctor
      }
    );


    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.loadDoctors();

      }

    });

  }

  deleteDoctor(id: number): void {

  const confirmed = confirm(
    'Are you sure you want to delete this doctor?'
  );

  if (!confirmed) {

    return;

  }

  this.service.delete(id).subscribe({

    next: () => {

      this.notification.success(
        'Doctor deleted successfully'
      );

      this.loadDoctors();

    },

    error: error => {

      console.error(error);

      this.notification.error(
        'Unable to delete doctor'
      );

    }

  });

}

}