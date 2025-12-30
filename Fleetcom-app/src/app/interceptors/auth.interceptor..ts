import { tap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('access_token');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    tap({
      error: (err) => {
        if (err.status === 401 && token) {
          auth.logout();
          router.navigate(['/login']);
        }
      }
    })
  );
};
