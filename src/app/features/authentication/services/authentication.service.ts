import { Injectable, inject } from '@angular/core';

import {
  Observable,
  BehaviorSubject,
  tap,
  map,
  catchError,
  of
} from 'rxjs';

import { ApiService } from '../../../core/http/api.service';

import { ApiEndpoints } from '../../../core/constants/api-endpoints';

import { StorageConstants } from '../../../core/constants/storage.constants';

import { LoginRequest } from '../models/login-request';

import { LoginResponse } from '../models/login-response';

import { UserProfile } from '../models/user-profile';

import { ChangePasswordRequest } from '../models/change-password-request';


interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly api =
    inject(ApiService);


  // =========================================================
  // CURRENT USER
  // =========================================================

  private readonly currentUserSubject =
    new BehaviorSubject<UserProfile | null>(null);

  readonly currentUser$ =
    this.currentUserSubject.asObservable();


  // =========================================================
  // LOGIN
  // =========================================================

  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.api
      .post<LoginResponse>(
        ApiEndpoints.AUTH.LOGIN,
        request
      )
      .pipe(

        tap(response => {

          localStorage.setItem(
            StorageConstants.ACCESS_TOKEN,
            response.data.accessToken
          );

          localStorage.setItem(
            StorageConstants.REFRESH_TOKEN,
            response.data.refreshToken
          );

          localStorage.setItem(
            StorageConstants.EXPIRES_AT,
            response.data.expiresAt
          );

        })

      );

  }


  // =========================================================
  // LOAD CURRENT USER
  // =========================================================

  loadCurrentUser():
    Observable<ApiResponse<UserProfile>> {

    return this.api
      .get<ApiResponse<UserProfile>>(
        ApiEndpoints.AUTH.ME
      )
      .pipe(

        tap(response => {

          this.currentUserSubject.next(
            response.data
          );

        })

      );

  }


  // =========================================================
// INITIALIZE AUTHENTICATION
// =========================================================

initializeAuthentication(): Observable<boolean> {

  const accessToken =
    localStorage.getItem(
      StorageConstants.ACCESS_TOKEN
    );

  // No access token.
  if (!accessToken) {

    this.currentUserSubject.next(null);

    return of(false);

  }

  // Access token exists.
  // Restore the current user from backend.
  return this.loadCurrentUser().pipe(

    tap(response => {

      console.log(
        'Authentication restored:',
        response.data
      );

    }),

    map(() => true),

    catchError(error => {

      console.error(
        'Failed to restore authentication:',
        error
      );

      this.clearAuthentication();

      return of(false);

    })

  );

}

  // =========================================================
  // GET CURRENT USER
  // =========================================================  
  getCurrentUser():
  Observable<ApiResponse<UserProfile>> {

  return this.api.get<ApiResponse<UserProfile>>(
    ApiEndpoints.AUTH.ME
  );

}

  // =========================================================
  // CURRENT USER SNAPSHOT
  // =========================================================

  getCurrentUserSnapshot():
    UserProfile | null {

    return this.currentUserSubject.value;

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout():
    Observable<ApiResponse<boolean>> {

    const refreshToken =
      localStorage.getItem(
        StorageConstants.REFRESH_TOKEN
      );


    if (!refreshToken) {

      this.clearAuthentication();

      return new Observable(observer => {

        observer.next({

          success: true,

          message:
            'Logged out successfully.',

          data: true,

          errors: null

        });

        observer.complete();

      });

    }


    return this.api
      .post<ApiResponse<boolean>>(
        ApiEndpoints.AUTH.LOGOUT,
        {
          refreshToken
        }
      )
      .pipe(

        tap(() => {

          this.clearAuthentication();

        })

      );

  }


  // =========================================================
  // CLEAR AUTHENTICATION
  // =========================================================

  clearAuthentication(): void {

    localStorage.removeItem(
      StorageConstants.ACCESS_TOKEN
    );

    localStorage.removeItem(
      StorageConstants.REFRESH_TOKEN
    );

    localStorage.removeItem(
      StorageConstants.EXPIRES_AT
    );

    this.currentUserSubject.next(null);

  }


  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  changePassword(
    request: ChangePasswordRequest
  ): Observable<ApiResponse<boolean>> {

    return this.api.post<ApiResponse<boolean>>(
      ApiEndpoints.AUTH.CHANGE_PASSWORD,
      request
    );

  }

}