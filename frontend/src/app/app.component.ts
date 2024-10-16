import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { CreateTicketComponent } from './Components/create-ticket/create-ticket.component';
import { Emmiters } from './emitters/emitters';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule ,RouterOutlet, HomeComponent, LoginComponent, NavbarComponent, CreateTicketComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit{
  title = 'frontend';
  authenticated = false

  ngOnInit(): void {
    Emmiters.authEmmiter.subscribe(
      (auth: boolean) => {
        this.authenticated = auth;
      }
    )
  }
}
