import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MATERIAL_MODULES } from '../../../../shared/material/material';

import { PatientService } from '../../services/patient.service';

import { Patient } from '../../models/patient';

import { MatDialog } from '@angular/material/dialog';

import { PatientDialog } from '../../dialogs/patient-dialog/patient-dialog';

import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss'
})
export class PatientList implements OnInit {

  private readonly service = inject(PatientService);
  
  private readonly dialog = inject(MatDialog);

  private readonly notification = inject(NotificationService);

  patients: Patient[] = [];

  displayedColumns = [

    'id',

    'firstName',

    'lastName',

    'phone',

    'actions'

  ];

  ngOnInit(): void {

    this.loadPatients();

  }

  loadPatients(): void {

    this.service.getAll().subscribe({

      next: response => {

        this.patients = response.data;

      },

      error: error => {

        console.error(error);

      }

    });

  }

  openDialog(patient?: Patient): void {

  const dialogRef = this.dialog.open(
    PatientDialog,
    {
      width: '900px',
      data: patient
    }
  );

  dialogRef.afterClosed().subscribe(result => {

    if (result) {

      this.loadPatients();

    }

  });

}

deletePatient(id: number): void {

  if (!confirm('Are you sure you want to delete this patient?')) {
    return;
  }

  this.service.delete(id).subscribe({

    next: () => {

      this.notification.success('Patient deleted successfully');

      this.loadPatients();

    },

    error: error => {

      console.error(error);

      this.notification.error('Unable to delete patient');

    }

  });

}

}

