import { Component, OnInit } from '@angular/core';
import { AllComponent } from './all/all.component';
import { PendingComponent } from './pending/pending.component';
import { ResolvedComponent } from './resolved/resolved.component';
import { RejectedComponent } from './rejected/rejected.component';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Emmiters } from '../../emitters/emitters';
import { AuthService } from '../../services/auth/auth.service';
import { images } from '../../../../public/assets';
import { GrievanceService } from '../../services/grievance/grievance.service';
import { delay } from 'rxjs';

interface Notification {
  grievance_id: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    AllComponent,
    PendingComponent,
    ResolvedComponent,
    RejectedComponent,
    NgIf,
    NgFor,
    NgClass,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  userData: any;
  authenticated = false;
  images = images;
  searchResult: any = null;
  grievanceId: string = '';
  loading = false;
  button_loading = false;
  notificationData : Notification[] = [];

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private grievanceService: GrievanceService,
    private http: HttpClient,
    private router: Router
  ) {}

  private getUserData(): void {
    this.authService.getUserData().subscribe({
      next: (res: any) => {
        this.userData = res;
      },
      error: (err) => {
        this.toastr.error(err.error.detail, 'Error');
      },
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.authService.isAuthenticated().subscribe({
      next: (isAuth: boolean) => {
        if(isAuth) {
          this.getUserData();
          this.authenticated = isAuth;
          this.loading = false;
        }
        else {
          this.loading = false;
          this.toastr.error('User not authenticated', 'Error');
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.message )
      }
    })

    this.loading = true;
    this.grievanceService.getNewNotification().subscribe({
      next: (res: any) => {
        this.notificationData = res.notifications.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        this.loading = false;
      },
      error: (err) => {
        console.log(err.error.message);
        this.loading = false;
      }
    });
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.grievanceId = inputElement.value.trim();
  }

  onSearch() {
    if (this.grievanceId.trim() === '') {
      this.toastr.warning('Please enter a grievance ID', 'Warning');
      return;
    } 
    this.button_loading = true;
    this.http.get(`${this.authService.baseUrl()}/api/grievance/search?grievance_id=${this.grievanceId}`, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.searchResult = res.grievances[0] || null;
          this.button_loading = false;
          if (this.searchResult) {
            this.router.navigate(['/complaint', this.searchResult.grievance_id]);
          } else {
            this.toastr.error('Grievance not found', 'Error');
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error retrieving grievance', 'Error');
          this.button_loading = false;
        }
      });
  }

  onSelectGrievance() {
    if (this.searchResult) {
      this.router.navigate(['/complaint', this.searchResult.grievance_id]);
    }
  }

  logout(): void{
    this.loading = true;
    this.http.post(`${this.authService.baseUrl()}/api/logout`, {}, {withCredentials: true}).
    subscribe({
      next: (res: any)=> {
        this.router.navigate(['/login']);
        this.loading = false;
        this.authenticated = false;
        this.toastr.success(res.message)
      }
    })
  }

}
