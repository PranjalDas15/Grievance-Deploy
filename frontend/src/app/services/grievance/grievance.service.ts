import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GrievanceService {
  private readonly url: string = 'http://localhost:8000'; 
  constructor(private http: HttpClient) { }
  baseUrl(): string {
    return this.url;
    }
    getGrievanceData(): Observable<any> {
      return this.http.get(`${this.baseUrl()}/api/grievance/get`, { withCredentials: true });
    }
}
