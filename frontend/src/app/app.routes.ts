import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { CreateTicketComponent } from './Components/create-ticket/create-ticket.component';
import { AllComponent } from './Components/home/all/all.component';
import { PendingComponent } from './Components/home/pending/pending.component';
import { ResolvedComponent } from './Components/home/resolved/resolved.component';
import { RejectedComponent } from './Components/home/rejected/rejected.component';
import { ComplaintComponent } from './Components/complaint/complaint.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/home/all', pathMatch: 'full'},
  { path: 'new_ticket', component: CreateTicketComponent, canActivate: [AuthGuard]},
  { path: 'complaint/:grievance_id', component: ComplaintComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: HomeComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: 'all', component: AllComponent },
      { path: 'pending', component: PendingComponent },
      { path: 'resolved', component: ResolvedComponent },
      { path: 'rejected', component: RejectedComponent },
    ]
  },
];
