import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DashboardData } from '../models/dashboard';

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
  errors: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl =
    'https://localhost:7294/api/v1/Dashboard';

  constructor(
    private http: HttpClient
  ) {}

  getDashboard(): Observable<DashboardResponse> {

    return this.http.get<DashboardResponse>(
      this.apiUrl
    );

  }

}