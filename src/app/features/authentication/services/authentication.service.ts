import { Injectable, inject } from '@angular/core';

import { Observable, tap } from 'rxjs';

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


  logout(): Observable<ApiResponse<boolean>> {

    const refreshToken =
      localStorage.getItem(
        StorageConstants.REFRESH_TOKEN
      );


    /*
     * If there is no refresh token,
     * there is nothing to send to the backend.
     */

    if (!refreshToken) {

      this.clearAuthentication();

      return new Observable(observer => {

        observer.next({
          success: true,
          message: 'Logged out successfully.',
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

  }

      getCurrentUser(): Observable<ApiResponse<UserProfile>> {

      return this.api.get<ApiResponse<UserProfile>>(
        ApiEndpoints.AUTH.ME
      );

    }


    changePassword(
        request: ChangePasswordRequest
      ): Observable<ApiResponse<boolean>> {

        return this.api.post<ApiResponse<boolean>>(
          ApiEndpoints.AUTH.CHANGE_PASSWORD,
          request
        );

      }

}



