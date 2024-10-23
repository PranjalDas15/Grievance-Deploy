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
import { AdminComponent } from './Components/admin/admin.component';
import { AdminHomeComponent } from './Components/admin/admin-home/admin-home.component';
import { ManageComponent } from './Components/admin/manage/manage.component';
import { UpdatedComponent } from './Components/admin/updated/updated.component';
import { AdminAuthGuard } from './guards/admin.guard';
import { UpdateComponent } from './Components/admin/update/update.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '',
    canActivate: [AuthGuard],
    children: [
      // { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path: 'new_ticket',
        component: CreateTicketComponent,
      },
      {
        path: 'complaint/:grievance_id',
        component: ComplaintComponent,
      },
      {
        path: '',
        component: HomeComponent,
        children: [
          { path: '', component: AllComponent },
          { path: 'pending', component: PendingComponent },
          { path: 'resolved', component: ResolvedComponent },
          { path: 'rejected', component: RejectedComponent },
        ],
      },
    ]
  },
  { path: 'admin', component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {path: 'home', component: AdminHomeComponent},
      {path: 'manage', component: ManageComponent},
      {path: 'updated', component: UpdatedComponent},
      {path: 'update/:grievance_id', component: UpdateComponent},
    ]
   },
];

