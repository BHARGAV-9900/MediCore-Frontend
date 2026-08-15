import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { MATERIAL_MODULES }
from '../../../../shared/material/material';

import { LaboratoryTestService }
from '../../services/laboratory-test.service';

import { LaboratoryTest }
from '../../models/laboratory-test';

import { LaboratoryTestDialog }
from '../../dialogs/laboratory-test-dialog/laboratory-test-dialog';

import { LaboratoryTestDeleteConfirmation }
  from '../../dialogs/laboratory-test-delete-confirmation/laboratory-test-delete-confirmation';

import { NotificationService }
from '../../../../core/services/notification.service';


@Component({
  selector: 'app-laboratory-test-list',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './laboratory-test-list.html',

  styleUrl: './laboratory-test-list.scss'
})
export class LaboratoryTestList
implements OnInit {

  private readonly service =
    inject(LaboratoryTestService);

  private readonly dialog =
    inject(MatDialog);

  private readonly notification =
    inject(NotificationService);


  laboratoryTests: LaboratoryTest[] = [];

  loading = false;


  ngOnInit(): void {

    this.loadLaboratoryTests();

  }


  // Load laboratory tests

  loadLaboratoryTests(): void {

    this.loading = true;

    this.service.getAll().subscribe({

      next: response => {

        console.log(
          'Laboratory Tests:',
          response
        );

        this.laboratoryTests =
          response.data;

        this.loading = false;

      },


      error: error => {

        console.error(error);

        this.loading = false;

        this.notification.error(
          'Unable to load laboratory tests'
        );

      }

    });

  }


  // Open create/edit dialog

  openDialog(
    laboratoryTest?: LaboratoryTest
  ): void {

    const dialogRef =
      this.dialog.open(
        LaboratoryTestDialog,
        {
          width: '650px',

          maxWidth: '95vw',

          maxHeight: '90vh',

          data: laboratoryTest
        }
      );


    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {

          this.loadLaboratoryTests();

        }

      }
    );

  }


  // Edit laboratory test

  editLaboratoryTest(
    laboratoryTest: LaboratoryTest
  ): void {

    this.openDialog(laboratoryTest);

  }


  // Delete laboratory test

  deleteLaboratoryTest(
  laboratoryTest: LaboratoryTest
): void {

  const dialogRef =
    this.dialog.open(
      LaboratoryTestDeleteConfirmation,
      {
        width: '500px',
        maxWidth: '95vw',
        data: laboratoryTest
      }
    );


  dialogRef.afterClosed().subscribe(
    confirmed => {

      if (!confirmed) {

        return;

      }


      this.service
        .delete(laboratoryTest.id)
        .subscribe({

          next: () => {

            this.notification.success(
              'Laboratory test deleted successfully'
            );

            this.loadLaboratoryTests();

          },

          error: error => {

            console.error(error);

            this.notification.error(
              error?.error?.message ??
              'Unable to delete laboratory test'
            );

          }

        });

    }
  );

}

}