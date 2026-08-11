import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  DashboardService
} from '../../services/dashboard.service';

import {
  DashboardData
} from '../../models/dashboard';

import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    MatIconModule
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  dashboard: DashboardData | null = null;

  loading = false;

  errorMessage = '';


  constructor(
    private dashboardService: DashboardService
  ) {}


  ngOnInit(): void {

    this.loadDashboard();

  }


  loadDashboard(): void {

    this.loading = true;

    this.errorMessage = '';


    this.dashboardService
      .getDashboard()
      .subscribe({

        next: (response) => {

          console.log(
            'Dashboard API Response:',
            response
          );

          this.dashboard =
            response.data;

          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Error loading dashboard:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load dashboard data.';

          this.loading = false;

        }

      });

  }


  refreshDashboard(): void {

    this.loadDashboard();

  }

}