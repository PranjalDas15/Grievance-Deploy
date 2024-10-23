import { CommonModule, NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { images } from '../../../../../public/assets';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { Location } from '@angular/common';

interface NavigationState {
  from: string;
}

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [RouterModule, NgIf, NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit{
  images = images;
  isUpdating:boolean = false;
  form : FormGroup;
  grievance_id: any;
  grievance: any;
  origin: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService,
    private location: Location,
    private http: HttpClient
  ) {
    this.form = this.formBuilder.group({
      status: ['']
    })
    
  }

  ngOnInit(): void {
    this.grievance_id = this.route.snapshot.paramMap.get('grievance_id')
    this.http.get(`${this.authService.baseUrl()}/api/grievance/admin/get/${this.grievance_id}`, {withCredentials: true}).
    subscribe({
      next: (res: any) => {
        this.grievance = res.grievances;
        this.populateForm();
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Error retrieving grievance')
      }
    })
  }

  populateForm() {
    this.form.patchValue({
      status: this.grievance?.status
    });
  }

  toggleUpdate() {
    this.isUpdating = !this.isUpdating;
    if(!this.isUpdating) {
      this.populateForm();
    }
  }

  submit() {
    if (this.form.valid) {
      this.http.put(`${this.authService.baseUrl()}/api/grievance/admin/update/${this.grievance_id}`, this.form.value, { withCredentials: true })
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res.message, 'Success');
            this.isUpdating = false; 
            this.grievance = { ...this.grievance, ...this.form.value }; 
          },
          error: (err) => {
            this.toastr.error(err.error.message || 'Error updating grievance', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
    }
  }

  goBack() {
    this.location.back();
  }

}
