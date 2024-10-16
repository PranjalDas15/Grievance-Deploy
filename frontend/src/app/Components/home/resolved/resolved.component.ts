import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrievanceService } from '../../../services/grievance/grievance.service';

interface Grievance {
  grievance_id: string;
  created_at: string;
  status: string;
}

@Component({
  selector: 'app-resolved',
  standalone: true,
  imports: [RouterModule, NgClass, NgFor, NgIf],
  templateUrl: './resolved.component.html',
  styleUrl: './resolved.component.css'
})
export class ResolvedComponent {
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
