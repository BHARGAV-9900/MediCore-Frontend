import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError
} from 'rxjs';

import {
  Router
} from '@angular/router';

import {
  StorageConstants
} from '../constants/storage.constants';

import {
  ApiEndpoints
} from '../constants/api-endpoints';

import {
  AuthenticationService
} from '../../features/authentication/services/authentication.service';


/*
 * Prevent multiple simultaneous refresh-token requests.
 *
 * Example:
 *
 * Request A -> 401
 * Request B -> 401
 * Request C -> 401
 *
 * Only Request A performs refresh.
 * B and C wait for the new access token.
 */

let isRefreshing = false;

const refreshTokenSubject =
  new BehaviorSubject<string | null>(null);


/*
 * ============================================================
 * AUTH INTERCEPTOR
 * ============================================================
 */

export const authInterceptor:
  HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {

  const authenticationService =
    inject(AuthenticationService);

  const router =
    inject(Router);


  /*
   * ==========================================================
   * AUTHENTICATION ENDPOINTS
   *
   * Login, refresh-token and logout should not have the
   * current access token automatically attached.
   * ==========================================================
   */

  const isAuthenticationRequest =
    req.url.includes(
      `/${ApiEndpoints.AUTH.LOGIN}`
    ) ||
    req.url.includes(
      `/${ApiEndpoints.AUTH.REFRESH_TOKEN}`
    ) ||
    req.url.includes(
      `/${ApiEndpoints.AUTH.LOGOUT}`
    );


  if (isAuthenticationRequest) {

    return next(req);

  }


  /*
   * ==========================================================
   * GET ACCESS TOKEN
   * ==========================================================
   */

  const accessToken =
    localStorage.getItem(
      StorageConstants.ACCESS_TOKEN
    );


  /*
   * ==========================================================
   * NO ACCESS TOKEN
   * ==========================================================
   */

  if (!accessToken) {

    return next(req);

  }


  /*
   * ==========================================================
   * ATTACH JWT
   * ==========================================================
   */

  const authenticatedRequest =
    req.clone({

      setHeaders: {

        Authorization:
          `Bearer ${accessToken}`

      }

    });


  /*
   * ==========================================================
   * SEND REQUEST
   * ==========================================================
   */

  return next(authenticatedRequest)
    .pipe(

      catchError(
        (error: HttpErrorResponse) => {

          /*
           * Only 401 means that we should attempt
           * authentication renewal.
           */

          if (error.status !== 401) {

            return throwError(
              () => error
            );

          }


          /*
           * Access token is invalid/expired.
           * Attempt refresh.
           */

          return handleUnauthorizedRequest(
            authenticatedRequest,
            next,
            authenticationService,
            router
          );

        }

      )

    );

};


/*
 * ============================================================
 * HANDLE UNAUTHORIZED REQUEST
 * ============================================================
 */

function handleUnauthorizedRequest(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authenticationService: AuthenticationService,
  router: Router
): Observable<HttpEvent<unknown>> {


  /*
   * ==========================================================
   * ANOTHER REQUEST IS ALREADY REFRESHING
   * ==========================================================
   */

  if (isRefreshing) {

    return refreshTokenSubject
      .pipe(

        /*
         * Wait until a new token is available.
         */

        filter(
          (
            token: string | null
          ): token is string =>
            token !== null
        ),

        take(1),

        switchMap(
          (
            token: string
          ): Observable<HttpEvent<unknown>> => {

            const retryRequest =
              request.clone({

                setHeaders: {

                  Authorization:
                    `Bearer ${token}`

                }

              });


            return next(
              retryRequest
            );

          }

        )

      );

  }


  /*
   * ==========================================================
   * START REFRESH PROCESS
   * ==========================================================
   */

  isRefreshing = true;

  refreshTokenSubject.next(null);


  return authenticationService
    .refreshToken()
    .pipe(

      switchMap(
        (
          response
        ): Observable<HttpEvent<unknown>> => {

          isRefreshing = false;


          /*
           * Get the newly generated access token.
           */

          const newAccessToken =
            response.data.accessToken;


          /*
           * Notify waiting requests.
           */

          refreshTokenSubject.next(
            newAccessToken
          );


          /*
           * Retry the original request with
           * the new access token.
           */

          const retryRequest =
            request.clone({

              setHeaders: {

                Authorization:
                  `Bearer ${newAccessToken}`

              }

            });


          return next(
            retryRequest
          );

        }

      ),

      catchError(
        refreshError => {

          /*
           * Refresh token is invalid/expired.
           */

          isRefreshing = false;

          refreshTokenSubject.next(null);


          /*
           * Clear local authentication.
           */

          authenticationService
            .clearAuthentication();


          /*
           * Send the user back to login.
           */

          router.navigate([
            '/login'
          ]);


          return throwError(
            () => refreshError
          );

        }

      )

    );

}