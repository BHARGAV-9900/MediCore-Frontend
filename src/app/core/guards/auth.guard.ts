import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthenticationService
} from '../../features/authentication/services/authentication.service';

import {
  StorageConstants
} from '../constants/storage.constants';


export const authGuard:
  CanActivateFn = () => {

  const router =
    inject(Router);

  const authenticationService =
    inject(AuthenticationService);


  // =========================================================
  // CHECK ACCESS TOKEN
  // =========================================================

  const accessToken =
    localStorage.getItem(
      StorageConstants.ACCESS_TOKEN
    );


  // ---------------------------------------------------------
  // No token
  // ---------------------------------------------------------

  if (!accessToken) {

    return router.createUrlTree([
      '/login'
    ]);

  }


  // ---------------------------------------------------------
  // Token exists.
  //
  // The interceptor will validate it when the application
  // makes an authenticated request.
  //
  // If the token has expired, the interceptor attempts the
  // refresh-token flow.
  // ---------------------------------------------------------

  return true;

};