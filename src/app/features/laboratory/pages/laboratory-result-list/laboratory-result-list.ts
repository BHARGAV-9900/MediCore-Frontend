import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { MatDialog }
  from '@angular/material/dialog';

import { MATERIAL_MODULES }
  from '../../../../shared/material/material';

import { LaboratoryResultService }
  from '../../services/laboratory-result.service';

import { LaboratoryResult }
  from '../../models/laboratory-result';

import { LaboratoryResultDialog }
  from '../../dialogs/laboratory-result-dialog/laboratory-result-dialog';

import { NotificationService }
  from '../../../../core/services/notification.service';


@Component({
  selector: 'app-laboratory-result-list',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './laboratory-result-list.html',

  styleUrl: './laboratory-result-list.scss'
})
export class LaboratoryResultList
  implements OnInit {

  private readonly service =
    inject(LaboratoryResultService);

  private readonly dialog =
    inject(MatDialog);

  private readonly notification =
    inject(NotificationService);


  laboratoryResults: LaboratoryResult[] = [];

  loading = false;


  ngOnInit(): void {

    this.loadLaboratoryResults();

  }


  loadLaboratoryResults(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        console.log(
          'Laboratory Results:',
          response
        );

        this.laboratoryResults =
          response.data;

        this.loading = false;

      },


      error: error => {

        console.error(error);

        this.loading = false;

        this.notification.error(
          'Unable to load laboratory results'
        );

      }

    });

  }


  openDialog(
    laboratoryResult?: LaboratoryResult
  ): void {

 const dialogRef =
  this.dialog.open(
    LaboratoryResultDialog,
    {
      width: '650px',

      maxWidth: '95vw',

      maxHeight: '90vh',

      data: laboratoryResult
    }
  );


    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {

          this.loadLaboratoryResults();

        }

      }
    );

  }


  editLaboratoryResult(
    laboratoryResult: LaboratoryResult
  ): void {

    this.openDialog(laboratoryResult);

  }


  deleteLaboratoryResult(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this laboratory result?'
      );


    if (!confirmed) {

      return;

    }


    this.service.delete(id).subscribe({

      next: () => {

        this.notification.success(
          'Laboratory result deleted successfully'
        );

        this.loadLaboratoryResults();

      },


      error: error => {

        console.error(error);

        this.notification.error(
          error?.error?.message ??
          'Unable to delete laboratory result'
        );

      }

    });

  }

}