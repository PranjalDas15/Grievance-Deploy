import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { CreateTicketComponent } from './Components/create-ticket/create-ticket.component';
import { Emmiters } from './emitters/emitters';
import { AuthService } from './services/auth/auth.service';
import { NgIf } from '@angular/common';
import { AdminHomeComponent } from "./Components/admin/admin-home/admin-home.component";
import { SidebarComponent } from "./Components/sidebar/sidebar.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    RouterOutlet,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    CreateTicketComponent,
    AdminHomeComponent,
    SidebarComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend';
  authenticated = false;
  isConsumer: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: (auth: boolean) => {
        this.authenticated = auth;
        if(auth) {
          this.authService.getUserRole().subscribe({
            next: (role: any) => {
              this.isConsumer = role === 'Consumer';
            },
            error: () => {
              this.toastr.error('Failed to determine user role')
            }
          })
        }
      },
      error: () => {
        this.toastr.error('Error checking authentication');
      }
    })
  }
}
