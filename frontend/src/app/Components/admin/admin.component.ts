import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { images } from '../../../../public/assets';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  images = images;
  authenticated = false;
  loading = false;

  constructor(
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.loading = true;
    this.authService.isAdminAuthenticated().subscribe({
      next: (isAuth: boolean) => {
        if(isAuth) {
          this.authenticated = isAuth;
          this.loading = false;
        }
        else {
          this.loading = false;

        }
      },
      error: (err) => {
        this.loading = false;
      }
    })
  }

}
