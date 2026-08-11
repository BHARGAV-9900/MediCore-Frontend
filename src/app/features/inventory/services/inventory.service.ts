import { Injectable, inject } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Inventory
} from '../models/inventory';

import {
  CreateInventory
} from '../models/create-inventory';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    'https://localhost:7294/api/v1/Inventory';


  getAll(): Observable<any> {

    return this.http.get<any>(
      this.apiUrl
    );

  }


  getById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );

  }


  create(
    inventory: CreateInventory
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      inventory
    );

  }


  update(
    id: number,
    inventory: Partial<CreateInventory>
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      inventory
    );

  }


  delete(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );

  }


  getLowStock(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/low-stock`
    );

  }


  getExpiring(
    days: number = 30
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/expiring?days=${days}`
    );

  }

}