import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return of(false); 
        }
        return this.authService.getUserRole().pipe(
          map((role) => {
            if (role === 'Consumer') {
              return true; 
            } else {
              this.router.navigate(['/admin/home']);
              return false;  
            }
          }),
          catchError(() => {
            this.router.navigate(['/login']);
            return of(false); 
          })
        );
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
