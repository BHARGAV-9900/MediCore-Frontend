import { inject } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { map, take } from 'rxjs';

import { AuthenticationService }
  from '../../features/authentication/services/authentication.service';


export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const router = inject(Router);

  const authService =
    inject(AuthenticationService);


  const allowedRoles =
    route.data['roles'] as string[] | undefined;


  // If no roles are configured,
  // allow the authenticated user.
  if (
    !allowedRoles ||
    allowedRoles.length === 0
  ) {

    return true;

  }


  return authService.currentUser$.pipe(

    take(1),

    map(user => {

      // No current user.
      if (!user) {

        return router.createUrlTree([
          '/login'
        ]);

      }


      const userRole =
        user.role
          ?.trim()
          .toLowerCase();


      const hasAccess =
        allowedRoles.some(
          role =>
            role
              .trim()
              .toLowerCase() === userRole
        );


      if (hasAccess) {

        return true;

      }


      // User is authenticated,
      // but does not have permission.
      return router.createUrlTree([
        '/dashboard/dashboard'
      ]);

    })

  );

};