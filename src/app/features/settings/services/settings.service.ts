import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Settings } from '../models/settings';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly apiUrl =
    'https://localhost:7294/api/v1/Settings';

  constructor(
    private readonly http: HttpClient
  ) {}

  get(): Observable<ApiResponse<Settings>> {

    return this.http.get<ApiResponse<Settings>>(
      this.apiUrl
    );
  }

  update(
    settings: Omit<Settings, 'id'>
  ): Observable<ApiResponse<boolean>> {

    return this.http.put<ApiResponse<boolean>>(
      this.apiUrl,
      settings
    );
  }
}