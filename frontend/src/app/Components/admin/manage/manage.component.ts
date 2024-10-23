import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrievanceService } from '../../../services/grievance/grievance.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { images } from '../../../../../public/assets';

interface Grievance {
  grievance_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  user_name: string;
  category: string;
}

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [RouterModule, CommonModule, NgIf, NgClass, NgFor],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit{
  loading:boolean = true;
  grievanceAdminData : Grievance[] = [];
  images = images

  constructor(
    private grievanceService : GrievanceService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.grievanceService.getAdminGrievancePendingData().subscribe({
      next: (res:any) => {
        this.grievanceAdminData = res.grievances;
        this.grievanceAdminData.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        console.log(res.message);
        this.loading = false;
      },
      error: (err)=>{
        console.log(err.error.message);
        this.loading = false;
      }
    })
  }
}
