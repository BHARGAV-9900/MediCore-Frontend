import {
  ApplicationConfig,
  APP_INITIALIZER,
  inject
} from '@angular/core';

import {
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  routes
} from './app.routes';

import {
  authInterceptor
} from './core/interceptors/auth.interceptor';

import {
  AuthenticationService
} from './features/authentication/services/authentication.service';


function initializeAuthentication() {

  const authenticationService =
    inject(AuthenticationService);

  return () =>
    authenticationService
      .initializeAuthentication();

}


export const appConfig:
  ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(

      withInterceptors([

        authInterceptor

      ])

    ),

    {
      provide: APP_INITIALIZER,

      useFactory:
        initializeAuthentication,

      multi: true

    }

  ]

};