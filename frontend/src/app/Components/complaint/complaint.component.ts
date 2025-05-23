import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { category, images } from '../../../../public/assets';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [RouterModule, NgClass, FormsModule, ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css',
})
export class ComplaintComponent implements OnInit {
  images = images;
  grievance: any;
  grievance_id: any;
  form: FormGroup;
  isEditing = false;
  categories = category;
  isDeleting = false;
  loading = false;
  button_loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {this.form = this.formBuilder.group({
    phone: [''],
    consumer_no: [''],
    pincode: [''],
    address: [''],
    category: [''],
    detail: ['']
  }) }

  ngOnInit(): void {
    this.grievance_id = this.route.snapshot.paramMap.get('grievance_id')!;
    this.loading = true;
    this.http.get(`${this.authService.baseUrl()}/api/grievance/get/${this.grievance_id}`, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.grievance = res.grievances[0];
          this.populateForm();
          this.loading = false;
        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error retrieving grievance', 'Error');
          this.loading = false;
        }
      });
  }

  populateForm() {
    this.form.patchValue({
      phone: this.grievance?.phone,
      consumer_no: this.grievance?.consumer_no,
      pincode: this.grievance?.pincode,
      address: this.grievance?.address,
      category: this.grievance?.category,
      detail: this.grievance?.detail
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing; 
    if (!this.isEditing) {
      this.populateForm(); 
    }
  }

  toggleDelete() {
    this.isDeleting = !this.isDeleting
  }

  submit() {
    if (this.form.valid) {
      this.button_loading = true;
      this.http.put(`${this.authService.baseUrl()}/api/grievance/update/${this.grievance_id}`, this.form.value, { withCredentials: true })
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res.message, 'Success');
            this.button_loading = false;
            this.isEditing = false; 
            this.grievance = { ...this.grievance, ...this.form.value }; 
          },
          error: (err) => {
            this.toastr.error(err.error.message || 'Error updating grievance', 'Error');
            this.button_loading = false
          }
        });
    } else {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      this.button_loading = false;
    }
  }

  delete() {
    this.button_loading = true;
    this.http.delete(`${this.authService.baseUrl()}/api/grievance/delete/${this.grievance_id}`, { withCredentials: true})
    .subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success');
        this.router.navigate(['/'])
        this.button_loading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.message, 'Error')
        this.button_loading = false;
      }
    })
  }

  goBack() {
    this.location.back();
  }
}
