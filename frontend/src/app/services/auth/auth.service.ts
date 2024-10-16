import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url: string = 'http://localhost:8000'; 

  constructor(private http: HttpClient) {}

  baseUrl(): string {
    return this.url;
    }

  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${this.baseUrl()}/api/consumer`, { withCredentials: true }).pipe(
      map(() => true), 
      catchError(() => of(false))
    );
  }  

  getUserData(): Observable<any> {
    return this.http.get(`${this.baseUrl()}/api/consumer`, { withCredentials: true });
  }

  
}
