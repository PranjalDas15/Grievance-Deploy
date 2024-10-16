import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { images } from '../../../../public/assets';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, NgClass, NgIf, NgFor],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  images = images;
  form: FormGroup;
  isOpen = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService ) { 
    this.form = this.formBuilder.group({
      name: [''],
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
  }

  toggleIsOpen() {
    this.isOpen = !this.isOpen; 
  }

  submit(): void {
    this.http.post(`${this.authService.baseUrl()}/api/register`, this.form.getRawValue())
    .subscribe({next: () => {
      this.toastr.success('Registration Successfull')
      this.router.navigate(['login'])
    },
    error: (err)=> {
      this.toastr.error('Please fill all Fields', 'Error')
    }})
  }
}

