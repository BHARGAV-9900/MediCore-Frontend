import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material';

import {
  ReportsService
} from '../../services/reports.service';

@Component({
  selector: 'app-reports',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl: './reports.html',

  styleUrl: './reports.scss'
})
export class Reports
  implements OnInit {

  report: any = null;

  loading = false;

  errorMessage = '';

  constructor(
    private readonly reportsService: ReportsService
  ) {}

  ngOnInit(): void {

    this.loadReport();

  }

  loadReport(): void {

    this.loading = true;

    this.errorMessage = '';

    this.reportsService
      .getDashboardReport()
      .subscribe({

        next: response => {

          console.log(
            'Dashboard Report:',
            response
          );

          this.report =
            response.data;

          this.loading = false;

        },

        error: error => {

          console.error(
            'Error loading dashboard report:',
            error
          );

          this.errorMessage =
            error?.error?.message ??
            'Unable to load dashboard report.';

          this.loading = false;

        }

      });

  }

  refreshReport(): void {

    this.loadReport();

  }

}