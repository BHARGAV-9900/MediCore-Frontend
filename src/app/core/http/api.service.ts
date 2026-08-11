import {
  inject,
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    environment.apiUrl;


  // =========================================================
  // GET
  // =========================================================

  get<T>(
    endpoint: string
  ): Observable<T> {

    return this.http.get<T>(
      `${this.apiUrl}/${endpoint}`
    );

  }


  // =========================================================
  // POST
  // =========================================================

  post<T>(
    endpoint: string,
    body: unknown
  ): Observable<T> {

    return this.http.post<T>(
      `${this.apiUrl}/${endpoint}`,
      body
    );

  }


  // =========================================================
  // PUT
  // =========================================================

  put<T>(
    endpoint: string,
    body: unknown
  ): Observable<T> {

    return this.http.put<T>(
      `${this.apiUrl}/${endpoint}`,
      body
    );

  }


  // =========================================================
  // PATCH
  // =========================================================

  patch<T>(
    endpoint: string,
    body: unknown
  ): Observable<T> {

    return this.http.patch<T>(
      `${this.apiUrl}/${endpoint}`,
      body
    );

  }


  // =========================================================
  // DELETE
  // =========================================================

  delete<T>(
    endpoint: string
  ): Observable<T> {

    return this.http.delete<T>(
      `${this.apiUrl}/${endpoint}`
    );

  }

}