import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface AuthResponse {
  role: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  mainloading = false;
  private readonly url: string = 'http://localhost:8000'; 
  // private readonly url: string = 'https://grievance-deploy.onrender.com'; 
  private authenticatedSubject = new BehaviorSubject<boolean>(false); 
  authenticated$ = this.authenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkInitialAuthState(); 
  }

  private checkInitialAuthState(): void {
    this.isAuthenticated().subscribe(isAuth => {
      this.authenticatedSubject.next(isAuth);
    });
  }

  baseUrl(): string {
    return this.url;
  }

  isAuthenticated(): Observable<boolean> {
    this.mainloading = true;
    return this.http.get(`${this.baseUrl()}/api/consumer`, { withCredentials: true }).pipe(
      map(() => {
        this.authenticatedSubject.next(true); 
        this.mainloading = false;
        return true; 
      }), 
      catchError(() => {
        this.authenticatedSubject.next(false); 
        this.mainloading = false;
        return of(false);
      })
    );
  }  

  getUserData(): Observable<any> {
    return this.http.get(`${this.baseUrl()}/api/consumer`, { withCredentials: true });
  }

  isAdminAuthenticated(): Observable<boolean> {
    return this.http.get<AuthResponse>(`${this.baseUrl()}/api/consumer`, { withCredentials: true }).pipe(
      map((response: AuthResponse) => {
        return response.role === 'Admin';
      }), 
      catchError(() => of(false))
    );
  }

  getUserRole(): Observable<string> {
    return this.getUserData().pipe(
      map((user: any) => user.role || 'Consumer'),
      catchError(() => of('Consumer')) 
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl()}/api/login`, credentials, { withCredentials: true }).pipe(
      map((response) => {
        this.authenticatedSubject.next(true); 
        return response;
      }),
      catchError((error) => {
        this.authenticatedSubject.next(false);
        return of(error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl()}/api/logout`, {}, { withCredentials: true }).pipe(
      map((response) => {
        this.authenticatedSubject.next(false);
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }
}
