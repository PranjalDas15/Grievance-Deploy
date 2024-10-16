import { Component, OnInit } from '@angular/core';
import { AllComponent } from './all/all.component';
import { PendingComponent } from './pending/pending.component';
import { ResolvedComponent } from './resolved/resolved.component';
import { RejectedComponent } from './rejected/rejected.component';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Emmiters } from '../../emitters/emitters';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    AllComponent,
    PendingComponent,
    ResolvedComponent,
    RejectedComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  userData: any;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService
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
    this.authService.isAuthenticated().subscribe({
      next: (isAuth: boolean) => {
        if(isAuth) {
          this.getUserData()
        }
        else {
          this.toastr.error('User not authenticated', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error(err.message, )
      }
    })
  }

}
