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
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this laboratory test?'
      );


    if (!confirmed) {

      return;

    }


    this.service.delete(id).subscribe({

      next: () => {

        this.notification.success(
          'Laboratory test deleted successfully'
        );

        this.loadLaboratoryTests();

      },


      error: error => {
        console.error(
          'Failed to create laboratory test:',
          error
        );

        this.loading = false;

        this.notification.error(
          error?.error?.message ??
          'Unable to create laboratory test'
        );
      }
    });

  }

}