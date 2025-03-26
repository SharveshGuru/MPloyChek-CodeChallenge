import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  records: any[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserData();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserRecords().subscribe({
      next: (records) => {
        // Transform the records to format the date
        this.records = records.map(record => ({
          ...record,
          createdAt: this.formatDate(record.createdAt)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load records', err);
        this.isLoading = false;
      }
    });
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(dateString, 'dd MMMM yyyy') || dateString;
  }

  logout() {
    this.authService.clearAuthData();
    this.router.navigate(['/login']);
  }
}