import { HttpInterceptorFn } from '@angular/common/http';
import { StorageConstants } from '../constants/storage.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem(
    StorageConstants.ACCESS_TOKEN
  );

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};