import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GrievanceService {
  constructor(private http: HttpClient, private authServices: AuthService) { }
  getGrievanceData(): Observable<any> {
      return this.http.get(`${this.authServices.baseUrl()}/api/grievance/get`, { withCredentials: true });
    }
  
  getPendingGrievanceData(): Observable<any> {
      return this.http.get(`${this.authServices.baseUrl()}/api/grievance/get/pending`, { withCredentials: true });
    }
  
  getResolvedGrievanceData(): Observable<any> {
      return this.http.get(`${this.authServices.baseUrl()}/api/grievance/get/resolved`, { withCredentials: true });
    }
  
  getRejectedGrievanceData(): Observable<any> {
      return this.http.get(`${this.authServices.baseUrl()}/api/grievance/get/rejected`, { withCredentials: true });
    }
  
  getAdminGrievancePendingData(): Observable<any> {
    return this.http.get(`${this.authServices.baseUrl()}/api/grievance/admin/getall`, { withCredentials: true });
  }
  
  getAdminGrievanceUpdatedData(): Observable<any> {
    return this.http.get(`${this.authServices.baseUrl()}/api/grievance/admin/getupdated`, { withCredentials: true });
  }
}
