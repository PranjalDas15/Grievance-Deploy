import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { images } from '../../../../public/assets';
import { GrievanceService } from '../../services/grievance/grievance.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';

interface Notification {
  grievance_id: string;
  message: string;
  is_read: string;
  created_at: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [RouterModule, NgIf, NgClass, NgFor, CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{

  images = images;
  notificationData: Notification[] = []
  loading: boolean = false;

  constructor(
    private grievanceService: GrievanceService,
    private authService: AuthService,
    private http: HttpClient,
  ){}

  ngOnInit(): void {  
    this.loading = true;
    this.grievanceService.getNewNotification().subscribe({
      next: (res: any) => {
        this.notificationData = res.notifications.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        this.loading = false;
      },
      error: (err) => {
        console.log(err.error.message);
        this.loading = false;
      }
    });

  }

  markAsRead(grievance_id: string) {
    this.grievanceService.updateNotificationStatus(grievance_id).subscribe({
      next: () => {
        this.notificationData = this.notificationData.filter(notification => notification.grievance_id !== grievance_id);
      },
      error: (err) => {
        console.error('Error marking notification as read:', err);
      }
    });
  }
}
