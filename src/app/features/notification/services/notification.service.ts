import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Notification } from '../models/notification';
import { CreateNotification } from '../models/create-notification';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly apiUrl =
    'https://localhost:7294/api/v1/Notification';

  constructor(
    private readonly http: HttpClient
  ) {}

  getAll(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(
      this.apiUrl
    );
  }

  getById(
    id: number
  ): Observable<ApiResponse<Notification>> {

    return this.http.get<ApiResponse<Notification>>(
      `${this.apiUrl}/${id}`
    );
  }

  getUnread(): Observable<ApiResponse<Notification[]>> {

    return this.http.get<ApiResponse<Notification[]>>(
      `${this.apiUrl}/unread`
    );
  }

  create(
    notification: CreateNotification
  ): Observable<ApiResponse<number>> {

    return this.http.post<ApiResponse<number>>(
      this.apiUrl,
      notification
    );
  }

  markAsRead(
    id: number
  ): Observable<ApiResponse<boolean>> {

    return this.http.put<ApiResponse<boolean>>(
      `${this.apiUrl}/read/${id}`,
      {}
    );
  }

  delete(
    id: number
  ): Observable<ApiResponse<boolean>> {

    return this.http.delete<ApiResponse<boolean>>(
      `${this.apiUrl}/${id}`
    );
  }
}