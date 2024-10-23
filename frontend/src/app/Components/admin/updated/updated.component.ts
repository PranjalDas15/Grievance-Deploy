import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrievanceService } from '../../../services/grievance/grievance.service';
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
  selector: 'app-updated',
  standalone: true,
  imports: [RouterModule, CommonModule, NgFor, NgIf, NgClass],
  templateUrl: './updated.component.html',
  styleUrl: './updated.component.css'
})
export class UpdatedComponent implements OnInit{
  loading:boolean = true;
  grievanceAdminDataUpdated : Grievance[] = [];
  images = images;

  constructor(
    private grievanceService : GrievanceService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.grievanceService.getAdminGrievanceUpdatedData().subscribe({
      next: (res:any) => {
        this.grievanceAdminDataUpdated = res.grievances;
        this.grievanceAdminDataUpdated.sort((a, b) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
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
