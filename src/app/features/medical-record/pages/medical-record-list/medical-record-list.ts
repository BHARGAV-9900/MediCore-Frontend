import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import {
  MatDialog
} from '@angular/material/dialog';

import {
  MedicalRecord
} from '../../models/medical-record';

import {
  MedicalRecordService
} from '../../services/medical-record.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';

import {
  MedicalRecordDialog
} from '../../dialogs/medical-record-dialog/medical-record-dialog';

import {
  MedicalRecordDeleteConfirmation
} from '../../dialogs/medical-record-delete-confirmation/medical-record-delete-confirmation';


@Component({
  selector: 'app-medical-record-list',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './medical-record-list.html',

  styleUrl:
    './medical-record-list.scss'
})
export class MedicalRecordList
implements OnInit {

  private readonly service =
    inject(MedicalRecordService);

  private readonly notification =
    inject(NotificationService);

  private readonly dialog =
    inject(MatDialog);


  records:
    MedicalRecord[] = [];


  loading = false;


  ngOnInit(): void {

    this.loadMedicalRecords();

  }


  loadMedicalRecords(): void {

    this.loading = true;


    this.service
      .getAll()
      .subscribe({

        next: response => {

          this.records =
            response.data ?? [];

          this.loading = false;

        },

        error: error => {

          console.error(error);

          this.loading = false;

          this.notification.error(
            error?.error?.message ??
            'Unable to load medical records'
          );

        }

      });

  }


  addMedicalRecord(): void {

    const dialogRef =
      this.dialog.open(
        MedicalRecordDialog,
        {
          width: '760px',

          maxWidth: '95vw',

          maxHeight: '90vh',

          autoFocus: false,

          disableClose: true,

          panelClass:
            'medical-record-dialog-panel'
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadMedicalRecords();

        }

      });

  }


  editMedicalRecord(
    record: MedicalRecord
  ): void {

    const dialogRef =
      this.dialog.open(
        MedicalRecordDialog,
        {
          width: '760px',

          maxWidth: '95vw',

          maxHeight: '90vh',

          autoFocus: false,

          disableClose: true,

          panelClass:
            'medical-record-dialog-panel',

          data: record
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadMedicalRecords();

        }

      });

  }


  deleteMedicalRecord(
    record: MedicalRecord
  ): void {

    const dialogRef =
      this.dialog.open(
        MedicalRecordDeleteConfirmation,
        {
          width: '560px',

          maxWidth: '95vw',

          autoFocus: false,

          disableClose: true,

          data: record
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(confirmed => {

        if (!confirmed) {

          return;

        }


        this.loading = true;


        this.service
          .delete(record.id)
          .subscribe({

            next: () => {

              this.loading = false;

              this.notification.success(
                'Medical record deleted successfully'
              );

              this.loadMedicalRecords();

            },

            error: error => {

              console.error(error);

              this.loading = false;

              this.notification.error(
                error?.error?.message ??
                'Unable to delete medical record'
              );

            }

          });

      });

  }


  truncate(
    value: string | null | undefined,
    length: number
  ): string {

    if (!value) {

      return '—';

    }


    if (value.length <= length) {

      return value;

    }


    return value.substring(
      0,
      length
    ) + '...';

  }

}