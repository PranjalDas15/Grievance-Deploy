import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { images } from '../../../../public/assets';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  images = images;
  authenticated = false;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
  ){

  }

  ngOnInit(): void {
    this.authService.isAdminAuthenticated().subscribe({
      next: (auth: boolean) => {
        this.authenticated = auth;
      },
      error: (err) => {
        this.toastr.error('Error checking authentication', 'Error')
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
