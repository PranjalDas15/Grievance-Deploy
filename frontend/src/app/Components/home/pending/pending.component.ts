import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrievanceService } from '../../../services/grievance/grievance.service';

interface Grievance {
  grievance_id: string;
  created_at: string;
  status: string;
}

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [RouterModule, NgIf, NgFor, NgClass],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent implements OnInit {
  
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
