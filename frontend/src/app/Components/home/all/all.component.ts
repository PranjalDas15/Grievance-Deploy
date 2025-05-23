import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { GrievanceService } from '../../../services/grievance/grievance.service';
import { images } from '../../../../../public/assets';

interface Grievance {
  grievance_id: string;
  created_at: string;
  status: string;
}

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [RouterModule, NgIf, NgFor, NgClass],
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css'],
})
export class AllComponent implements OnInit {
  images = images
  grievanceData: Grievance[] = [];
  loading: boolean = false;

  constructor(private grievanceService : GrievanceService) {}


  ngOnInit(): void {
    this.loading = true;
    this.grievanceService.getGrievanceData().subscribe({
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
