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

          this.storeAuthentication(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.expiresAt
          );

        })

      );

  }


  // =========================================================
  // REFRESH ACCESS TOKEN
  // =========================================================

  refreshToken():
    Observable<LoginResponse> {

    const refreshToken =
      localStorage.getItem(
        StorageConstants.REFRESH_TOKEN
      );

    if (!refreshToken) {

      return new Observable(observer => {

        observer.error(
          new Error(
            'Refresh token is not available.'
          )
        );

      });

    }


    return this.api
      .post<LoginResponse>(
        ApiEndpoints.AUTH.REFRESH_TOKEN,
        {
          refreshToken
        }
      )
      .pipe(

        tap(response => {

          this.storeAuthentication(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.expiresAt
          );

        })

      );

  }


  // =========================================================
  // STORE AUTHENTICATION
  // =========================================================

  private storeAuthentication(
    accessToken: string,
    refreshToken: string,
    expiresAt: string
  ): void {

    localStorage.setItem(
      StorageConstants.ACCESS_TOKEN,
      accessToken
    );

    localStorage.setItem(
      StorageConstants.REFRESH_TOKEN,
      refreshToken
    );

    localStorage.setItem(
      StorageConstants.EXPIRES_AT,
      expiresAt
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

  initializeAuthentication():
    Observable<boolean> {

    const accessToken =
      localStorage.getItem(
        StorageConstants.ACCESS_TOKEN
      );


    // ---------------------------------------------------------
    // No access token
    // ---------------------------------------------------------

    if (!accessToken) {

      this.currentUserSubject.next(null);

      return of(false);

    }


    // ---------------------------------------------------------
    // Access token exists.
    // Try restoring current user.
    // If access token is expired, interceptor will attempt
    // refresh automatically.
    // ---------------------------------------------------------

    return this.loadCurrentUser()
      .pipe(

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

    return this.api
      .get<ApiResponse<UserProfile>>(
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
  // IS AUTHENTICATED
  // =========================================================

  isAuthenticated(): boolean {

    return !!localStorage.getItem(
      StorageConstants.ACCESS_TOKEN
    );

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


    // ---------------------------------------------------------
    // No refresh token
    // ---------------------------------------------------------

    if (!refreshToken) {

      this.clearAuthentication();

      return of({

        success: true,

        message:
          'Logged out successfully.',

        data: true,

        errors: null

      });

    }


    // ---------------------------------------------------------
    // Server logout
    // ---------------------------------------------------------

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

        }),

        catchError(error => {

          /*
           * Even if the server logout request fails,
           * remove the local authentication state.
           */

          this.clearAuthentication();

          throw error;

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
  ):
    Observable<ApiResponse<boolean>> {

    return this.api.post<ApiResponse<boolean>>(
      ApiEndpoints.AUTH.CHANGE_PASSWORD,
      request
    );

  }

}