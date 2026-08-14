import {
  ApplicationConfig,
  provideAppInitializer,
  inject
} from '@angular/core';

import {
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { routes } from './app.routes';

import { authInterceptor }
  from './core/interceptors/auth.interceptor';

import { AuthenticationService }
  from './features/authentication/services/authentication.service';


export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(

      withInterceptors([

        authInterceptor

      ])

    ),

    provideAppInitializer(() => {

      const authService =
        inject(AuthenticationService);

      return authService
        .initializeAuthentication();

    })

  ]

};