import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrievanceService } from '../../../services/grievance/grievance.service';
import { images } from '../../../../../public/assets';

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
  images = images;

  constructor(private grievanceService : GrievanceService){}

  ngOnInit(): void {
    this.loading = true;
    this.grievanceService.getPendingGrievanceData().subscribe({
      next: (res: any) => {
        this.grievanceData = res.grievances.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.log(err.error.message);
        this.loading = false;
      }
    });
  }

}
