import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { images } from '../../../../../public/assets';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { GrievanceService } from '../../../services/grievance/grievance.service';

interface Grievance {
  grievance_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  user_name: string;
  category: string;
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterModule, NgClass, NgIf, NgFor, CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit{
  images = images;
  authenticated:boolean = false;
  adminData: any;
  loading: boolean = false;
  grievanceAdminData: Grievance[] = []
  grievanceAdminDataUpdated: Grievance[] = []

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private grievanceService : GrievanceService,
  ){}

  private getAdminData(): void {
    this.authService.getUserData().subscribe({
      next: (res:any) => {
        this.adminData = res;
      },
      error: (err)=> {
        this.toastr.error(err.error.detail, 'Error')
      }
    })
  }

  ngOnInit(): void {
    this.authService.isAdminAuthenticated().subscribe({
      next: (isAuth: boolean) => {
        this.getAdminData();
        if(isAuth){
          this.getAdminData();
        }
        else{
          this.toastr.error('User not authenticated', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error(err.message)
      }
    })

    this.loading = true;
    this.grievanceService.getAdminGrievancePendingData().subscribe({
      next: (res:any) => {
        this.grievanceAdminData = res.grievances;
        this.grievanceAdminData.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        console.log(res.message);
        this.loading = false;
      },
      error: (err)=>{
        console.log(err.error.message);
        this.loading = false;
      }
    })

    this.loading = true;
    this.grievanceService.getAdminGrievanceUpdatedData().subscribe({
      next: (res:any) => {
        this.grievanceAdminDataUpdated = res.grievances;
        this.grievanceAdminDataUpdated.sort((a, b) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        console.log(res.message);
        this.loading = false;
      },
      error: (err)=>{
        console.log(err.error.message);
        this.loading = false;
      }
    })
  }

  logout(): void{
    this.http.post(`${this.authService.baseUrl()}/api/logout`, {}, {withCredentials: true}).
    subscribe({
      next: (res: any) => {
        this.router.navigate(['/login']);
        this.authenticated = false;
        this.toastr.success(res.message)
      }
    })
  }
}
