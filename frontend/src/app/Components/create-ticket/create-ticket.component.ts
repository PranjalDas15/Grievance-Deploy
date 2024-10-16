import { Component, OnInit } from '@angular/core';
import { category, images } from '../../../../public/assets';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent implements OnInit{
  images = images;
  categories = category;
  form: FormGroup;
  userData: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      phone: [''],
      consumer_no: [''],
      pincode: [''],
      address: [''],
      category: [''],
      detail: ['']
    })
  }

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
        this.toastr.error(err.message)
      }
    })
    console.log(this.categories); 
  }

  submit(): void {
    this.http.post(`${this.authService.baseUrl()}/api/grievance/create`, this.form.getRawValue(), { withCredentials: true })
    .subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.router.navigate(['/'])
      },
      error: (err) => {
        if (Array.isArray(err.error)) {
          err.error.forEach((errorMessage: string) => {
            this.toastr.error(errorMessage, 'Validation Error');
          });
        } else {
          this.toastr.error(err.error.message || 'Error creating grievance', 'Error');
        }
      }
    })
  }
}
