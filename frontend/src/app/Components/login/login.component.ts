import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Emmiters } from '../../emitters/emitters';
import { AuthService } from '../../services/auth/auth.service';
import { images } from '../../../../public/assets';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  images = images;
  isOpen = false;
  form: FormGroup;
  authenticated :boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService) {
    this.form = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    
  }

  toggleIsOpen() {
    this.isOpen = !this.isOpen
  }

  submit():void {
    this.http.post(`${this.authService.baseUrl()}/api/login`, this.form.getRawValue(), 
    {withCredentials: true})
    .subscribe({next: (res: any) => {
      this.toastr.success(res.message)
      this.authenticated = true; 
      Emmiters.authEmmiter.emit(true);
      this.router.navigate([''])
    },
    error: (err)=> {
      if (err.error && err.error.detail) {
        this.toastr.error(err.error.detail, 'Login Failed'); 
      } else {
        this.toastr.error('An unknown error occurred.', 'Login Failed');
      }
    }})
  }

}
