import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Payment } from '../models/payment';
import { CreatePayment } from '../models/create-payment';

import { ApiResponse } from '../../../core/models/api-response';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/Payment`;

  getAll(): Observable<ApiResponse<Payment[]>> {

    return this.http.get<ApiResponse<Payment[]>>(
      this.apiUrl
    );

  }

  getById(
    id: number
  ): Observable<ApiResponse<Payment>> {

    return this.http.get<ApiResponse<Payment>>(
      `${this.apiUrl}/${id}`
    );

  }

  getByBill(
    billId: number
  ): Observable<ApiResponse<Payment[]>> {

    return this.http.get<ApiResponse<Payment[]>>(
      `${this.apiUrl}/bill/${billId}`
    );

  }

  create(
    model: CreatePayment
  ): Observable<ApiResponse<number>> {

    return this.http.post<ApiResponse<number>>(
      this.apiUrl,
      model
    );

  }

  update(
    id: number,
    model: Omit<CreatePayment, 'billId'>
  ): Observable<ApiResponse<boolean>> {

    return this.http.put<ApiResponse<boolean>>(
      this.apiUrl,
      {
        id,
        ...model
      }
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