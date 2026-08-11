import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DashboardReport } from '../models/dashboard-report';

export interface DashboardReportResponse {
  success: boolean;

  message: string;

  data: DashboardReport;

  errors: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private readonly apiUrl =
    'https://localhost:7294/api/v1/Reports';

  constructor(
    private readonly http: HttpClient
  ) {}

  getDashboardReport():
    Observable<DashboardReportResponse> {

    return this.http.get<DashboardReportResponse>(
      `${this.apiUrl}/dashboard`
    );

  }

}