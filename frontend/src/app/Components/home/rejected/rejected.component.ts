import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrievanceService } from '../../../services/grievance/grievance.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

interface Grievance {
  grievance_id: string;
  created_at: string;
  status: string;
}

@Component({
  selector: 'app-rejected',
  standalone: true,
  imports: [RouterModule, NgClass, NgIf, NgFor],
  templateUrl: './rejected.component.html',
  styleUrl: './rejected.component.css'
})
export class RejectedComponent implements OnInit{
  grievanceData: Grievance[] = [];
  loading: boolean = false;

  constructor(private grievanceService : GrievanceService){}

  ngOnInit(): void {
    this.loading = true;
    this.grievanceService.getGrievanceData().subscribe({
      next: (res:any) => {
        this.grievanceData = res.grievances;
        this.loading = false;
      },
      error: (err) => {
        console.log(err.error.message);
        this.loading = false;
      }
    });
  }
}
